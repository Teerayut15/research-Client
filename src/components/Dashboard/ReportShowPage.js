import './ReportShowPage.css'
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { useParams } from 'react-router-dom';
import axios, { Axios } from 'axios';
import { useEffect, useState } from 'react';
import DashboardMain from './DashboardMain';
import Swal from "sweetalert2";


function ReportShowPage(){

    const { report_id } = useParams()

    const [report, setReport] = useState({})

    useEffect(() => {
        getReport()
    }, [report_id])

    // functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getReport(){
        const url = `http://localhost:3001/reports/${report_id}`
        const headers = {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
        const response = await axios.get(url, { headers })
        const reportData = response.data.data[0]
        reportData.time = `${reportData.time.split(':')[0]}:${reportData.time.split(':')[1]}`
        if(response.data.code == 200){
            await setReport(reportData)
        }else{

        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function changeStatus(status){
        const url = `http://localhost:3001/reports/${report_id}`
        const headers = {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
        const body = {
            status: status
        }
        const reportModal = await Swal.fire({
            title: "คุณต้องการเปลี่ยนสถานะรายงาน ?",
            icon: 'question',
            confirmButtonText: 'ใช่',
            confirmButtonColor: '#ffa502',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            showLoaderOnConfirm: true,
            preConfirm: async() => {
                const response = await axios.put(url, body, { headers })
                return response.data
            }
        })
        if(reportModal.value.code == 200){
            await Swal.fire({
                icon: 'success',
                title: 'เปลี่ยนสถานะรายงานเรียบร้อยแล้ว',
                timer: 1500,
                allowOutsideClick: false,
                showConfirmButton: false
            })
            window.location = await "http://localhost:3000/dashboard/report"
        }else{

        }
        
    }

    return (
        <DashboardMain>
            <section page="show-report">
                <header>
                    <div className="page-back">
                        <KeyboardBackspaceRoundedIcon />
                        ย้อนกลับ
                    </div>
                    <div className="page-title">
                        <h3>{`รายงาน : ${report.thesis_title}`}</h3>
                    </div>
                    <div className="page-etc">
                        <div className="date">{report.date}</div>
                        <div className="time">{`${report.time} น.`}</div>
                        <div className={`status-${report.status}`}>
                            {
                                report.status == "pending" ? "รอดำเนินการ"
                                : report.status == "inprogress" ? "กำลังดำเนินการ"
                                : report.status == "success" ? "สำเร็จ"
                                : "ผิดพลาด"
                            }
                        </div>
                    </div>
                </header>
                <div className="input-list">
                    <div className="input-item">
                        <label>หัวข้อรายงาน</label>
                        <input 
                            type="text" 
                            id='title-input' 
                            name='title'
                            value={report.title}
                            placeholder='กรอกชื่อหัวผู้ใช้งาน'
                            disabled
                        />
                    </div>
                    <div className="input-item">
                        <label>ข้อความ</label>
                        <textarea className="message" value={report.message} disabled></textarea>
                    </div>
                    <div className="input-item">
                        <label>ผู้รายงาน : <span className='reporter'>{report.reporter}</span></label>
                    </div>
                </div>
                <div className="form-button">
                    <hr />
                    <div className="button-list">
                        {
                            report.status == "pending" ? <button className='pending' onClick={() => changeStatus("inprogress")}>รับรายงาน</button>
                            : report.status == "inprogress" ? <button className='success' onClick={() => changeStatus("success")}>สำเร็จ</button>
                            : <button>บันทึกข้อมูล</button>
                        }
                    </div>
                </div>
            </section>
        </DashboardMain>
    )
}

export default ReportShowPage;