import DashboardMain from './DashboardMain'
import './DashboardThesisPage.css'
import './DashboardReportPage.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

function DashboardReportPage(){
    const [reportList, setReportList] = useState([])
    useEffect(() => {
        getAllReport()
    }, [])
    // functions
    async function getAllReport(){
        const url = "http://localhost:3001/reports"
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
        const response = await axios.get(url, { headers })
        const resposneData = await response.data.data
        console.log(resposneData)
        await resposneData.map(report => {
            report.thesis_title = (
                    <Link to={`/dashboard/report/${report.id}`} key={report.id} className="link">{report.thesis_title}</Link>
            )
            report.status = (
                <small className={`status-${report.status}`}>
                    {
                        report.status == "pending" ? "รอดำเนินการ"
                        : report.status == "inprogress" ? "กำลังดำเนินการ"
                        : report.status == "success" ? "สำเร็จ"
                        : "ผิดพลาด"
                    }
                </small>
            )
            
        })
        await setReportList(resposneData)
    }

    const customStyles = {
        table: {
            style: {
                paddingBottom: '1rem'
            }
        },
        rows: {
            style: {
                paddingTop: '1.25rem', // override the row height
                paddingBottom: '1.25rem', // override the row height
                // backgroundColor: 'red',
            },
        },
        headCells: {
            style: {
                backgroundColor: '#f1f2f6',
                fontWeight: 500,
                color: '#7a7d7e',
                // borderRadius: '0.5rem',
            },
        },
        cells: {
            style: {
                fontSize: '1rem',
                fontWeight: 300,
                color: '#2f3542',
                // paddingBottom: '1rem'
            },
        },
    };
    const columns = [
        {
            name: "ชื่อปริญญานิพนธ์",
            selector: row => row.thesis_title,
        },
        {
            name: "หัวข้อ",
            selector: row => row.title
            // center: true
        },
        {
            name: "วันที่แจ้ง",
            selector: row => row.date,
            center: true,
            width: "15%"
        },
        {
            name: "สถานะ",
            selector: row => row.status,
            center: true,
            width: "15%"
        }
    ]
    return (
        <DashboardMain>
            <section page="all-report">
                <header>
                    <div className="page-back">
                        <KeyboardBackspaceRoundedIcon />
                        ย้อนกลับ
                    </div>
                    <div className="page-title">
                        <h3>รายงาน</h3>
                    </div>
                </header>

                <div className="page-body">
                    <DataTable
                        columns={columns}
                        data={reportList}
                        pagination
                        customStyles={customStyles}
                        // paginationPerPage={5}
                    />
                </div>
            </section>
        </DashboardMain>
    )
}

export default DashboardReportPage;