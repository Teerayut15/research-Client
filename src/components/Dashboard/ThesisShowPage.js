import './ThesisCreatePage.css'
import './ThesisShowPage.css'
import DashboardMain from './DashboardMain';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import Swal from 'sweetalert2';

function ThesisShowPage(){
    
    const { thesis_id } = useParams();
    useEffect(() => {
        getThesis()
    }, [thesis_id])

    const coverImageUrl = 'http://localhost:3001/images/'
    
    // states
    const [imagePreview, setImagePreview] = useState(null);
    const [fileImage, setFileImage] = useState(null);
    const [filePdfText, setFilePdfText] = useState([])
    const [uploadedFilePdfText, setUploadedFilePdfText] = useState([{}])
    const [filePdf, setFilePdf] = useState([])
    const [branchesList, setBranchesList] = useState([])
    const [thesisData, setThesisData] = useState({})
    const [thesisInput, setThesisInput] = useState({
        title: '',
        branches_id: 0,
        creator_1: '',
        creator_2: '',
        creator_3: '',
        advisor: '',
        abstract: '',
        year: 2022,
        language: '',
        cover_image_name: '',
        note: ""
    })


    // functions
    async function getThesis(){
        const url = `http://localhost:3001/thesis/${thesis_id}`;
        const response = await axios.get(url)
        const thesisData = response.data.data[0]
        thesisData.note = ""
        await setThesisData(thesisData)
        await setThesisInput(thesisData)
        getBranches(thesisData.faculty_id)
        getFilePdfText()
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getBranches(facultyId){
        const resposne = await axios.get(`http://localhost:3001/faculty/${facultyId}`);
        const branchesData = resposne.data.data
        setBranchesList(branchesData)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getFilePdfText(){
        const resposne = await axios.get(`http://localhost:3001/thesis/${thesis_id}/files`);
        // console.log(resposne.data.data)
        setUploadedFilePdfText(resposne.data.data)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function thesisInputHandle(event){
        const { name, value } = event.target
        if(value == thesisData[name]){
            event.target.className = ""
        }else{
            event.target.className = "uploaded"
        }
        setThesisInput({
            ...thesisInput,
            [name]: value
        })
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function imageHandle(event){
        const { name, type} = event.target.files[0]
        setFileImage(event.target.files[0])
        setImagePreview(URL.createObjectURL(event.target.files[0]))
        setThesisInput({
            ...thesisInput,
            ["cover_image_name"]: name
        })
        event.target.className = "uploaded"
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function fileHandle(index, event){
        const {name, type, size} = event.target.files[0]
        // console.log(index)
        // เก็บไฟล์เข้า state สำหรับส่งไป save ใน server
        let newFile = [...filePdf];
        newFile[index] = event.target.files[0]
        setFilePdf(newFile)

        // // เก็บข้อมูลไฟล์เข้า state สำหรับนำไปบันทึกในฐานข้อมูล
        let newFileText = [...filePdfText];
        newFileText[index]["file_name"] = name.split('.')[0]
        newFileText[index]["file_type"] = name.split('.')[1]
        newFileText[index]["file_size"] = size
        // console.log(newFileText)
        setFilePdfText(newFileText)

        // เพิ่ม class ให้ element input
        event.target.className = "uploaded"
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function addFileInput(event){
        event.preventDefault()
        setFilePdfText([...filePdfText, {}])
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function removeFileInput(index, event){
        event.preventDefault()
        let newFileText = [...filePdfText]
        let newFilePdf = [...filePdf]
        newFileText.splice(index, 1)
        newFilePdf.splice(index, 1)
        setFilePdfText(newFileText)
        setFilePdf(newFilePdf)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function removeFilePdf(fileId){
        const url = `http://localhost:3001/files/${fileId}`;
        const headers = {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
        const response = await axios.delete(url, {headers})
        console.log(response.data)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function resetImagePreview(){
        setFileImage(null)
        setImagePreview(null)
        const imageInput = document.getElementById("image")
        imageInput.value = ""
        imageInput.className = ""
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function getFilePdfTextNotNull(file){
        return file != null
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function checkThesisInput(){
        console.log(thesisInput)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function checkThesisData(){
        console.log(thesisData)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function checkPdf(){
        console.log(filePdf)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function checkPdfText(){
        console.log(filePdfText)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function checkImagePreview(){
        console.log(imagePreview)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function checkFileImage(){
        console.log(fileImage)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function checkValidate(){
        const noteElement = document.getElementById("note-input")
        if(noteElement.value == ""){
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกบันทึกการอัปเดท',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#ffa502'
            })
            noteElement.className = "required-input"
            noteElement.focus()
        }else{
            Swal.fire({
                icon: 'question',
                title: 'ต้องการบันทึกข้อมูล ?',
                confirmButtonText: 'ใช่',
                confirmButtonColor: '#ffa502',
                showCancelButton: true,
                cancelButtonText: 'ยกเลิก',
                allowOutsideClick: false,
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    await updateThesis()
                    await uploadFileImage()
                    await uploadFilePdf()
                }
            }).then((result) => {
                console.log(result)
                if(result.isConfirmed){
                    Swal.fire({
                        icon: 'success',
                        title: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                        timer: 1500,
                        allowOutsideClick: false,
                        showConfirmButton: false
                    }).then(() => window.location.reload())
                }
            })
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function uploadFilePdf(){
        const filePdfIsEmpty = Object.keys(filePdf).length == 0;
        const url = `http://localhost:3001/files/upload/pdf`
        const headers = {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
        if(!filePdfIsEmpty){
            console.log("update pdf now")
            console.log(filePdf)
            const formDataPdf = new FormData();
            for(let i = 0; i< filePdf.length; i++){
                formDataPdf.append("filePdf", filePdf[i]);
            }
            const pdfSaveResponse = await axios.post(url, formDataPdf, {headers})
            await updateFile()
            await updateThesis()
        }else{
            console.log("don t update pdf")
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function uploadFileImage(){
        const fileImageIsEmpty = fileImage == null;
        const url = `http://localhost:3001/files/upload/image`
        const headers = {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
        if(!fileImageIsEmpty){
            console.log("update image now")
            const formDataImage = new FormData();
            formDataImage.append("fileImage", fileImage);
            const imageSaveResponse = await axios.post(url, formDataImage, {headers})
            await updateThesis()
        }else{
            console.log("don t update image")
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function updateThesis(){
        const url = `http://localhost:3001/thesis/${thesisData.id}`
        
        const preBody = thesisInput
        delete preBody.faculty_id
        delete preBody.faculty_name
        delete preBody.branches_name
        const body = preBody
        const headers = {
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
        const response = await axios.put(url, body, {headers})
        console.log(response.data)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function updateFile(){
        const url = `http://localhost:3001/files/`
        const body = {
            thesisId: thesisData.id,
            filePdfText
        }
        const headers = {
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
        const response = await axios.post(url, body, {headers})
        // console.log(body)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function showDeleteFileAlert(fileId){
        Swal.fire({
            icon: 'warning',
            title: 'คุณแน่ใจว่าต้องการลบ ?',
            text: 'ถ้าหากลบไฟล์แล้วจะไม่สามารถกู้คืนไฟล์ได้',
            confirmButtonText: 'ลบ',
            confirmButtonColor: '#ffa502',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if(result.isConfirmed){
                // console.log(fileId)
                await removeFilePdf(fileId)
                await window.location.reload()
            }
        })
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // elements
    const branchesElements = branchesList.map((branches) => {
        return (
            <option 
                key={branches.id} 
                value={branches.id}
                selected={
                    branches.id == thesisInput.branches_id ? true
                    : false
                }
                >
                    {branches.branches_name}
            </option>
        )
    })
    const uploadedFilePdfTextList = uploadedFilePdfText.filter((filePdfTextList) => {
        return filePdfTextList.id != null
    })
    const uploadedFilePdfTextElements = uploadedFilePdfTextList.map((filePdfTextList, index) => {
        return (
            <>
                <div className='file-pdf' key={index}>
                    <p>{filePdfTextList.file_name}.{filePdfTextList.file_type}</p>
                    <small 
                        className='delete'
                        onClick={e => showDeleteFileAlert(filePdfTextList.id)}
                    >
                        ลบไฟล์
                    </small>
                    {/* <HighlightOffRoundedIcon 
                        onClick={e => showDeleteFileAlert(filePdfTextList.id)}
                    /> */}
                </div>
            </>
        )
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
                            <h3>{thesisInput.title}</h3>
                        </div>
                        
                    </header>

                    <div className="input-list">
                        {
                            imagePreview != null ? <img src={imagePreview} alt="" />
                            : <img src={coverImageUrl + thesisData.cover_image_name} alt="" />
                        }
                        <div className="input-item">
                            <label htmlFor="file-input">รูปหน้าปก  <small>แนะนำขนาด 500x700 pixel</small></label>
                            <div>
                                <input type='file' name='image' id="image" onChange={imageHandle}></input>
                                {
                                    imagePreview == null ? null
                                    : (
                                        <button 
                                            className='remove' 
                                            onClick={resetImagePreview}>
                                            ยกเลิก
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                        <div className="input-item">
                            <label htmlFor="title-input">หัวข้อ </label>
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
                            <label htmlFor="creators-input">ชื่อผู้จัดทำ  <small>ใส่อย่างน้อย 1 คน</small></label>
                            <div className="input-item-group">
                                <input type="text" value={thesisInput.creator_1} name='creator_1' onChange={thesisInputHandle} placeholder='กรอกชื่อคนที่ 1 *'/>
                                <input type="text" value={thesisInput.creator_2 == null ? '' : thesisInput.creator_2} name='creator_2' onChange={thesisInputHandle} placeholder='กรอกชื่อคนที่ 2'/>
                                <input type="text" value={thesisInput.creator_3 == null ? '' : thesisInput.creator_3} name='creator_3' onChange={thesisInputHandle} placeholder='กรอกชื่อคนที่ 3'/>
                            </div>
                        </div>
                        <div className="input-item-group">
                            <div className="input-item">
                                <label htmlFor="advisor-input">ชื่อที่ปรึกษา </label>
                                <input type="text" value={thesisInput.advisor} name='advisor' onChange={thesisInputHandle} placeholder='กรอกชื่อที่ปรึกษา'/>
                            </div>
                            <div className="input-item">
                                <label htmlFor="year-input">ปีที่จัดทำ </label>
                                <input type="number" value={thesisInput.year} name='year' onChange={thesisInputHandle} placeholder='กรอกปีที่จัดทำ'/>
                            </div>
                            <div className="input-item">
                                <label htmlFor="language-input">ภาษา </label>
                                <select name="language" onChange={thesisInputHandle}>
                                    {
                                        thesisInput.language == "tha" ? <option value="THA" selected>ไทย</option>
                                        : <option value="tha">ไทย</option>
                                    }
                                    {
                                        thesisInput.language == "eng" ? <option value="eng" selected>อังกฤษ</option>
                                        : <option value="eng">อังกฤษ</option>
                                    }
                                </select>
                            </div>
                        </div>
                        
                        <div className="input-item-group">
                            <div className="input-item">
                                <label htmlFor="faculty-input">คณะ </label>
                                <select name="faculty" onChange={(e) => getBranches(e.target.value)}>
                                    <option value="default" disabled>เลือกคณะ</option>
                                    {
                                        thesisInput.faculty_id == 1 ? <option value="1" selected>วิศวกรรมศาสตร์</option>
                                        : <option value="1">วิศวกรรมศาสตร์</option>
                                    }
                                    {
                                        thesisInput.faculty_id == 2 ? <option value="2" selected>ครุศาสตร์อุตสาหกรรม</option>
                                        : <option value="2">ครุศาสตร์อุตสาหกรรม</option>
                                    }
                                    {
                                        thesisInput.faculty_id == 3 ? <option value="3" selected>บริหารธุรกิจและเทคโนโลยีสารสนเทศ</option>
                                        : <option value="3">บริหารธุรกิจและเทคโนโลยีสารสนเทศ</option>
                                    }
                                </select>
                            </div>
                            <div className="input-item">
                                <label htmlFor="branches-input">สาขาวิชา </label>
                                <select name="branches_id" onChange={thesisInputHandle}>
                                    <option value="default" disabled>เลือกสาขา</option>
                                    {branchesElements}
                                </select>
                            </div>
                        </div>
                        <div className="input-item">
                            <label htmlFor="abstract-input">บทคัดย่อ </label>
                            <textarea name="abstract" value={thesisInput.abstract} onChange={thesisInputHandle} rows="6"></textarea>
                        </div>
                        
                        <div className="input-item">
                            <label htmlFor="file-input">ไฟล์  
                                <small className="require"> อัปโหลดเฉพาะไฟล์ PDF เท่านั้น</small>
                            </label>
                            {uploadedFilePdfTextElements}
                            {
                                filePdfText.map((element, index) => (
                                    <div key={index}>
                                        <input type='file' name={element.name} onChange={e => fileHandle(index, e)}></input>
                                        <button 
                                            className='remove' 
                                            onClick={e => removeFileInput(index, e)}>
                                            ลบ
                                        </button>
                                    </div>
                                ))
                            }
                            <a href="#" onClick={addFileInput}>เพิ่มไฟล์</a>
                        </div>
                        <div className="input-item">
                            <label>บันทึกข้อความอัปเดท <span className='require'>*</span></label>
                            <input 
                                type="text" 
                                id='note-input' 
                                name='note' 
                                value={thesisInput.note}
                                onChange={thesisInputHandle}
                                placeholder='กรอกข้อความสำหรับบันทึกการเปลี่ยนแปลง'
                            />
                        </div>
                        
                    </div>

                    <div className="form-button">
                        <hr /><br />
                        {/* <button onClick={checkThesisInput}>check thesis input</button> */}
                        {/* <button onClick={checkThesisData}>check thesis data</button> */}
                        {/* <button onClick={checkImagePreview}>check image preview</button> */}
                        {/* <button onClick={checkFileImage}>check file image</button> */}
                        {/* <button onClick={checkPdfText}>check pdf text</button> */}
                        {/* <button onClick={checkPdf}>check file pdf</button> */}
                        <button onClick={checkValidate}>บันทึกข้อมูล</button>
                        {/* <button onClick={checkValidate}>dd</button> */}
                        
                    </div>
                </section>
            </DashboardMain>
    )
}
export default ThesisShowPage;