import { useParams } from 'react-router-dom';
import axios from "axios";
import './ThesisPage.css';
import { useEffect, useState } from 'react';
import Slide from './Slide';
import Layout from './Layout';
import Swal from 'sweetalert2';
import { PDFDocument } from 'pdf-lib'

function ThesisPage() {

    const { thesis_id } = useParams();
    const coverImageUrl = 'http://localhost:3001/images/'
    // state
    const [thesis, setThesis] = useState([]);
    const [thesisFile, setThesisFile] = useState([]);
    const [thesisRelate, setThesisRelate] = useState([]);
    const [clickReport, setClickReport] = useState(null)

    // effect
    useEffect(() => {
        init();
        async function init(){
            await getThesis(thesis_id);
            await getThesisFiles(thesis_id)
            await count("views")
            await getAllThesis(); /*ต้องเปลี่ยนเป็น getRelateThesis */
            await window.scrollTo(0, 0);
        }
    }, [thesis_id])
    
    document.title = `${thesis.title} | ระบบจัดเก็บและสืบค้นปริญญานิพนธ์`
    // functions
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function reportModal(){
        if(localStorage.getItem("accessToken") == null){
            Swal.fire({  
                title: 'กรุณาเข้าสู่ระบบก่อน',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: "#ffa502",
                timer: 1500
            })
        }else{
            const reportTitle = await Swal.fire({  
                title: 'แจ้งปัญหาให้เราทราบ',
                text: 'หัวข้อ',
                input: 'text',
                inputPlaceholder: 'กรอกข้อความที่นี่',
                confirmButtonText: 'ยืนยัน',
                confirmButtonColor: "#ffa502",
                showCancelButton: true,
                cancelButtonText: "ยกเลิก"
            })
            if(reportTitle.isConfirmed && reportTitle.value != ""){
                await Swal.fire({  
                    title: 'แจ้งปัญหาให้เราทราบ',
                    text: 'ข้อความ',
                    input: 'textarea',
                    inputPlaceholder: 'กรอกข้อความที่นี่',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: "#ffa502",
                    showCancelButton: true,
                    cancelButtonText: "ยกเลิก",
                    showLoaderOnConfirm: true,
                    preConfirm: async (message) => {
                        await sendReport(reportTitle.value, message)
                    }
                })
                await Swal.fire({
                    icon: "success",
                    title: 'รายงานปัญหาให้เจ้าหน้าที่เรียบร้อยแล้ว',
                })
                
            }
        }
        
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function download(fileId){
        if(localStorage.getItem("accessToken") == null){
            await Swal.fire({ 
                title: 'กรุณาเข้าสู่ระบบก่อน',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: "#ffa502",
                timer: 1500
            })
        }else{
            let timerInterval
            const downloadingModal = await Swal.fire({
                title: 'กำลังดาวน์โหลดไฟล์',
                html: 'ไฟล์จะถูกดาวน์โหลดในอีก <b></b> วินาที',
                timer: 3000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    b.style.color = "#ffa502"
                    timerInterval = setInterval(() => {
                        b.textContent = Math.round(Swal.getTimerLeft() / 1000)
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            })
            if(downloadingModal.dismiss === Swal.DismissReason.timer){
                const url = `http://localhost:3001/thesis/${thesis_id}/download/${fileId}`
                const headers = {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    'Content-Type': 'application/pdf',
                }
                const config = {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                        'Content-Type': 'application/pdf',
                    },
                    responseType: 'blob'
                }
                const response = await axios.get(url, config)
                const fileUrl = await window.URL.createObjectURL(new Blob([response.data]));
                const pdfFile = await embedWatermarkPdf(fileUrl)
                await window.open(pdfFile)
            }
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function embedWatermarkPdf(fileUrl){
        const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const watermarkUrl = 'http://localhost:3001/images/watermark_rmuti_logo_2.png'
        const watermarkImageBytes = await fetch(watermarkUrl).then((res) => res.arrayBuffer());
        const watermarkImage = await pdfDoc.embedPng(watermarkImageBytes)
        const imageDims = watermarkImage.scale(0.5)
        for(let index = 0; index < pages.length; index++){
            pages[index].drawImage(watermarkImage, {
                x: pages[index].getWidth() / 2 - imageDims.width / 2,
                y: pages[index].getHeight() / 2 - imageDims.height / 2 + 25,
                width: imageDims.width,
                height: imageDims.height,
                opacity: 0.2
            })
        }
        const pdfBytes = await pdfDoc.save()
        const pdfFinal = await window.URL.createObjectURL(new Blob([pdfBytes]));
        return pdfFinal
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getThesis(thesisId){
        const response = await axios.get(`http://localhost:3001/thesis/${thesisId}`);
        const responseData = await response.data.data[0];
        setThesis(responseData);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getThesisFiles(thesisId){
        const response = await axios.get(`http://localhost:3001/thesis/${thesisId}/files`);
        const responseData = await response.data.data;
        setThesisFile(responseData);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function sendReport(title, message){
        const url = `http://localhost:3001/reports`
        const headers = {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
        const user = await getUser()
        const body = {
            thesis_id: thesis_id,
            user_id: user.id,
            title: title,
            message: message
        }
        const response = await axios.post(url, body, { headers })
        console.log(response.data)
        // console.log(message)
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function count(column){
        const body = {'thesis_id':  thesis_id, "column": column, "operator": "+"};
        const headers = { 
            'Content-Type': 'Application/json'
        };
        const response = await axios.put(`http://localhost:3001/thesis`,body, {headers});
        const responseData = await response.data.data;
        setThesis(responseData);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getUser(){
        const url = `http://localhost:3001/users/my/profile`
        const headers = {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
        const response = await axios.get(url, { headers })
        return response.data.data
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getAllThesis(){ /*ต้องเปลี่ยนเป็น getRelateThesis */
        const response = await axios.get('http://localhost:3001/thesis');
        const responseData = await response.data.data;
        await setThesisRelate(responseData)
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function convertFileSize(size){
        let unit = "KB";
        let newSize = size / 1000
        let finalSize = ""
        if(newSize >= 1000){
            unit = "MB"
            newSize = size / 1000000
            finalSize = newSize.toFixed(2)+" "+unit
            return finalSize
        }else{
            finalSize = newSize.toFixed()+" "+unit
            return finalSize
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // elements
    const fileItemElements = thesisFile.map((item, index) => {
        return <div className="file-item" key={item.id}>
                    <div className="file">
                        <p className='file-name'>{item.file_name}</p>
                        <div className="file-detail">
                            <p className='file-type'>{item.file_type.toUpperCase()}</p>
                            •
                            <p className='file-size'>{convertFileSize(item.file_size)}</p>
                        </div>
                    </div>
                    <div className='button'>
                        <p className='download-btn' onClick={() => download(item.id)}>ดาวน์โหลด</p>
                    </div>
                    
                </div>
    })
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    return (
        <Layout>
            <section className="thesis-show">
            
                <div className="show-top">
                    <div className="show-top-left">
                        <img src={coverImageUrl + thesis.cover_image_name} alt="" />
                    </div>

                    <div className="show-top-right">
                        <div className="show-detail-top">
                            <h1 className='title'>{thesis.title}</h1>
                            <div className="creators">
                                <p>{thesis.creator_1}</p>
                                {thesis.creator_2 !== null ? <p>{thesis.creator_2}</p> : null}
                                {thesis.creator_3 !== null ? <p>{thesis.creator_3}</p> : null}
                            </div>
                        </div>
                        <div className="show-detail-center">
                            <div className="detail-center-left">
                                <div className="key-and-value">
                                    <p className="key">คณะ</p>
                                    <p className="value">{thesis.faculty_name}</p>
                                </div>
                                <div className="key-and-value">
                                    <p className="key">สาขา</p>
                                    <p className="value">{thesis.branches_name}</p>
                                </div>
                                
                                <div className="key-and-value">
                                    <p className="key">ที่ปรึกษา</p>
                                    <p className="value">{thesis.advisor}</p>
                                </div>
                            </div>

                            <div className="detail-center-right">
                                <div className="key-and-value">
                                    <p className="key">ปีที่จัดทำ</p>
                                    <p className="value">{thesis.year}</p>
                                </div>
                                <div className="key-and-value">
                                    <p className="key">ภาษา</p>
                                    {
                                        thesis.language === "THA" ? <p className="value">ไทย</p>
                                        : <p className="value">อังกฤษ</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="show-detail-bottom">
                            <div className="views-and-downloads">
                                <div className="views">
                                    <p>เข้าชม</p>
                                    <p className='count'> {thesis.views} </p>
                                </div>
                                <div className="downloads">
                                    <p>ดาวน์โหลด</p>
                                    <p className='count'> {thesis.downloads} </p>
                                </div>
                            </div>
                            <div className="like-and-report">
                                <button className='report' onClick={reportModal}>
                                    <i className="fa-solid fa-flag"></i> 
                                    รายงาน
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="show-center">
                    <header><h3>บทคัดย่อ</h3></header>
                    <p> {thesis.abstract} </p>
                </div>

                <hr />

                <div className="show-bottom">
                    <header><h3>ไฟล์</h3></header>
                    {fileItemElements}
                </div>
                
                <hr />
                <div className="relate-slide">
                    <header><h3>รายการที่คุณอาจสนใจ</h3></header>
                    <br />
                    <Slide dataList={thesisRelate}></Slide>
                </div>
        </section>
        </Layout>
    );
}
export default ThesisPage;