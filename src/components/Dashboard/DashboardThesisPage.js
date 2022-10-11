import './DashboardThesisPage.css'
import DashboardMain from './DashboardMain'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
function DashboardThesisPage(){

    const coverImageUrl = 'http://localhost:3001/images/'

    // states
    const [thesisList, setThesisList] = useState([])
    
    useEffect(() => {
        getAllThesis()
    }, [])

    // functions
    async function getAllThesis(){
        const allThesisResponse = await axios.get("http://localhost:3001/thesis")
        
        const thesisData = allThesisResponse.data.data
        await thesisData.map((thesis) => {
            thesis.title = <Link to={`/dashboard/thesis/${thesis.id}`} className="link">{thesis.title}</Link>
            thesis.action = (
                <div className="more-icon">
                    <MoreVertRoundedIcon />
                    <div className="more-menu" id={`more-menu-${thesis.id}`}>
                        <div className="more-menu-item">
                            <Link to={`/dashboard/thesis/${thesis.id}`}>ดูรายละเอียด</Link>
                        </div>
                        <div className="more-menu-item">
                            <a href="">ลบ</a>
                        </div>
                        
                    </div>
                </div>
            )
        })
        await setThesisList(thesisData)
    }
    
    const customStyles = {
        table: {
            style: {
                paddingBottom: '1rem'
            }
        },
        rows: {
            style: {
                paddingTop: '1rem', // override the row height
                paddingBottom: '1rem', // override the row height
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
                color: '#2f3542'
            },
        },
    };
    // elements
    const columns = [
        {
            name: "#",
            selector: row => <img className='cover-image' src={coverImageUrl+row.cover_image_name} alt="" />,
            center: true,
            width: '6%'
        },
        {
            name: "หัวข้อ",
            selector: row => row.title
        },
        {
            name: "เข้าชม",
            selector: row => row.views,
            center: true,
            width: "10%"
        },
        {
            name: "ดาวน์โหลด",
            selector: row => row.downloads,
            center: true,
            width: "10%"
        },
        {
            name: "วันที่สร้าง",
            selector: row => row.date,
            center: true,
            width: "20%"
        },
        {
            name: " ",
            selector: row => row.action,
            center: true,
            width: "10%"
        },
    ]

    return (
        <DashboardMain>
            <section page="all-thesis">
                <header>
                    <div className="page-back">
                        <KeyboardBackspaceRoundedIcon />
                        ย้อนกลับ
                    </div>
                    <div className="page-title">
                        <h3>ปริญญานิพนธ์</h3>
                    </div>
                    
                </header>
                
                <div className="page-body">
                    <div className='table-btn'>
                        <Link to="new"><button className='add'>เพิ่มปริญญานิพนธ์</button></Link>
                    </div>
                    <DataTable
                        columns={columns}
                        data={thesisList}
                        pagination
                        customStyles={customStyles}
                        paginationPerPage={5}
                    />
                </div>
            </section>
        </DashboardMain>
    )
}

export default DashboardThesisPage;