import './ThesisCreatePage.css'
import DashboardMain from './DashboardMain';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

function ThesisCreatePage(){

    // state
    const [imagePreview, setImagePreview] = useState(null) // เก็บรูปหน้าปกฟรีวิว
    const [image, setImage] = useState(null) // เก็บไฟล์รูปสำหรับส่งไปบันทึกในเครื่อง server
    const [filePdfText, setFilePdfText] = useState([{}]) // เก็บออปเจคของไฟล์ pdf สำหรับบันทึกลงฐานข้อมูล
    const [filePdf, setFilePdf] = useState([{}]) // เก็บไฟล์ pdf สำหรับส่งไปบันทึกในเครื่อง server
    const [branchesList, setBranchesList] = useState([])
    const [thesisInput, setThesisInput] = useState({
        title: '',
        branches_id: 0,
        creator_1: '',
        creator_2: '',
        creator_3: '',
        advisor: '',
        abstract: '',
        year: 2022,
        language: 'THA',
        cover_image_name: ''
    })
    
    // functions
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function thesisInputHandle(event){
        const { name, value } = event.target
        event.target.className = ""
        setThesisInput({
            ...thesisInput,
            [name]: value
        })
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // เมื่อมีการอัปโหลดไฟล์รูปภาพ
    async function imageHandle(event){
        const { name, type} = event.target.files[0]
        await setImage(event.target.files[0])
        setThesisInput({
            ...thesisInput,
            ["cover_image_name"]: name
        })
        setImagePreview(URL.createObjectURL(event.target.files[0]))
        event.target.className = "uploaded"
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // เมื่อมีการอัปโหลดไฟล์
    function fileHandle(index, event){
        const {name, type, size} = event.target.files[0]
        console.log(index)
        // เก็บไฟล์เข้า state สำหรับส่งไป save ใน server
        let newFile = [...filePdf];
        newFile[index] = event.target.files[0]
        setFilePdf(newFile)

        // // เก็บข้อมูลไฟล์เข้า state สำหรับนำไปบันทึกในฐานข้อมูล
        let newFileText = [...filePdfText];
        newFileText[index]["file_name"] = name.split('.')[0]
        newFileText[index]["file_type"] = name.split('.')[1]
        newFileText[index]["file_size"] = size
        console.log(newFileText)
        setFilePdfText(newFileText)

        // เพิ่ม class ให้ element input
        event.target.className = "uploaded"
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // เพิ่ม field input (ช่องอัปโหลดไฟล์ pdf)
    function addFileInput(event){
        event.preventDefault()
        setFilePdfText([...filePdfText, {}])
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ลบ field input (ช่องอัปโหลดไฟล์ pdf)
    function removeFileInput(index, event){
        event.preventDefault()
        let newFile = [...filePdfText]
        newFile.splice(index, 1)
        setFilePdf(newFile)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getBranches(event){
        event.target.className = ""
        const resposne = await axios.get(`http://localhost:3001/faculty/${event.target.value}`);
        setBranchesList(resposne.data.data)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function checkFiles(){
        console.log({
            "text": thesisInput,
            "fileText": filePdfText
        })
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function validateForm(){
        let accept = []
        const imageElement = document.getElementById("image-input")
        const titleElement = document.getElementById("title-input")
        const creatorElement = document.getElementById("creator-input")
        const advisorElement = document.getElementById("advisor-input")
        const yearElement = document.getElementById("year-input")
        const languageElement = document.getElementById("language-input")
        const facultyElement = document.getElementById("faculty-input")
        const branchesElement = document.getElementById("branches-input")
        const abstractElement = document.getElementById("abstract-input")
        const filePdfElement = document.getElementById("filepdf-input")
        const elementArray = [imageElement, titleElement, creatorElement, advisorElement, yearElement, languageElement, facultyElement, branchesElement, abstractElement, filePdfElement]
        for(let index = 0; index < elementArray.length; index++){
            if(elementArray[index].value == "" || elementArray[index].value == "default"){
                Swal.fire({
                    icon: 'warning',
                    title: 'กรุณากรอกข้อมูลให้ครบ !!',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#ffa502'
                })
                elementArray[index].className = "required-input"
                elementArray[index].focus()
                accept.push(false)
            }else{
                accept.push(true)
            }
        }
        const passValidate = accept.filter((acp) => {
            return acp == true
        })
        if(passValidate.length == 10){
            return true
        }else{
            return false
        }
        
    
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function addNewThesis(event){
        const validate = await validateForm()
        const headers = {
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        };
        const uploadHeader = {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
        const body = {
            thesisText: thesisInput,
            filePdfText: filePdfText
        }
        if(validate){
            const thesisStoreResponse = await axios.post("http://localhost:3001/thesis", body, {headers});
        
            if(thesisStoreResponse.data.code == 200){

                // บันทึก ไฟล์ pdf ลงใน server
                const formDataPdf = new FormData();
                for(let i = 0; i< filePdf.length; i++){
                    formDataPdf.append("filePdf", filePdf[i]);
                }
                const pdfSaveResponse = await axios.post("http://localhost:3001/files/upload/pdf", formDataPdf, {headers: uploadHeader})

                // บันทึก ไฟล์ image ลงใน server
                const formDataImage = new FormData();
                formDataImage.append("fileImage", image);
                const imageSaveResponse = await axios.post("http://localhost:3001/files/upload/image", formDataImage, {headers: uploadHeader})

                await Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'เพิ่มปริญญานิพนธ์ใหม่ เสร็จเรียบร้อยแล้ว ',
                    timer: 1500
                })
                window.location = await "http://localhost:3000/dashboard/thesis"
            }else{
                console.log(thesisStoreResponse.data)
            }
        }else{
            console.log(validate)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // elements
    const fileInputElement = <input type='file' name='file_pdf'></input>
    const branchesElement = branchesList.map((branches) => {
        return <option value={branches.id}>{branches.branches_name}</option>
    })

    return (
            <DashboardMain>
                <section page='create-thesis'>
                    <header>
                        <div className="page-back">
                            <KeyboardBackspaceRoundedIcon />
                            ย้อนกลับ
                        </div>
                        <div className="page-title">
                            <h3>เพิ่มปริญญานิพนธ์</h3>
                        </div>
                        
                    </header>
                    <div className="input-list">
                        <img src={imagePreview} alt="" />
                        <div className="input-item">
                            <label htmlFor="file-input">รูปหน้าปก <span className="require">*</span> <small>แนะนำขนาด 500x700 pixel</small></label>
                            <input type='file' name='image' id='image-input' onChange={imageHandle}></input>
                        </div>
                        <div className="input-item">
                            <label htmlFor="title-input">หัวข้อ <span className="require">*</span></label>
                            <input 
                                type="text" 
                                id='title-input' 
                                name='title' 
                                value={thesisInput.title}
                                onChange={thesisInputHandle}
                                placeholder='กรอกชื่อหัวข้อ'
                            />
                        </div>
                        <div className="input-item">
                            <label htmlFor="creators-input">ชื่อผู้จัดทำ <span className="require">*</span> <small>ใส่อย่างน้อย 1 คน</small></label>
                            <div className="input-item-group">
                                <input type="text" value={thesisInput.creator_1} name='creator_1' onChange={thesisInputHandle} id="creator-input" placeholder='กรอกชื่อคนที่ 1 *'/>
                                <input type="text" value={thesisInput.creator_2} name='creator_2' onChange={thesisInputHandle} placeholder='กรอกชื่อคนที่ 2'/>
                                <input type="text" value={thesisInput.creator_3} name='creator_3' onChange={thesisInputHandle} placeholder='กรอกชื่อคนที่ 3'/>
                            </div>
                        </div>
                        <div className="input-item-group">
                            <div className="input-item">
                                <label htmlFor="advisor-input">ชื่อที่ปรึกษา <span className="require">*</span></label>
                                <input type="text" id='advisor-input' value={thesisInput.advisor} name='advisor' onChange={thesisInputHandle} placeholder='กรอกชื่อที่ปรึกษา'/>
                            </div>
                            <div className="input-item">
                                <label htmlFor="year-input">ปีที่จัดทำ <span className="require">*</span></label>
                                <input type="number" id='year-input' value={thesisInput.year} name='year' onChange={thesisInputHandle} placeholder='กรอกปีที่จัดทำ'/>
                            </div>
                            <div className="input-item">
                                <label htmlFor="language-input">ภาษา <span className="require">*</span></label>
                                <select name="language" id='language-input' value={thesisInput.language} onChange={thesisInputHandle}>
                                    <option value="THA" selected>ไทย</option>
                                    <option value="ENG">อังกฤษ</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="input-item-group">
                            <div className="input-item">
                                <label>คณะ <span className="require">*</span></label>
                                <select name="faculty" id="faculty-input" onChange={getBranches}>
                                    <option value="default" disabled selected>เลือกคณะ</option>
                                    <option value="1">ครุศาสตร์อุตสาหกรรม</option>
                                    <option value="2">วิศวกรรมศาสตร์</option>
                                    <option value="3">บริหารธุรกิจและเทคโนโลยีสารสนเทศ</option>
                                </select>
                            </div>
                            <div className="input-item">
                                <label>สาขาวิชา <span className="require">*</span></label>
                                <select name="branches_id" id='branches-input' onChange={thesisInputHandle}>
                                    <option value="default" disabled selected>เลือกสาขา</option>
                                    {branchesElement}
                                </select>
                            </div>
                        </div>
                        <div className="input-item">
                            <label>บทคัดย่อ <span className="require">*</span></label>
                            <textarea name="abstract" id='abstract-input' value={thesisInput.abstract} onChange={thesisInputHandle} rows="5"></textarea>
                        </div>
                        
                        <div className="input-item">
                            <label htmlFor="file-input">ไฟล์  
                                <span className="require"> *</span>
                                <small className="require"> อัปโหลดเฉพาะไฟล์ PDF เท่านั้น</small>
                            </label>
                            {
                                filePdfText.map((element, index) => (
                                    <div key={index}>
                                        <input type='file' id='filepdf-input' name={element.name} onChange={e => fileHandle(index, e)}></input>
                                        {
                                            index ? (
                                                <button 
                                                    className='remove' 
                                                    onClick={e => removeFileInput(index, e)}>
                                                    ลบ
                                                </button>
                                            )
                                            : null
                                        }
                                    </div>
                                ))
                            }
                            <a href="#" onClick={addFileInput}>เพิ่มไฟล์</a>
                            <button onClick={checkFiles}>check file</button>
                            {/* <button onClick={onSubmitForms}>submit file</button> */}
                        </div>
                        
                        
                    </div>
                    <div className="form-button">
                        <hr /><br />
                        <button onClick={addNewThesis}>เพิ่มข้อมูล</button>
                    </div>
                </section>
            </DashboardMain>
    )
}
export default ThesisCreatePage;