import './DashboardThesisPage.css'
import './DashboardUserPage.css'
import DashboardMain from './DashboardMain'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
function DashboardUserPage(){

    // states
    const [userList, setUserList] = useState([])
    useEffect(() => {
        getAllUser()
    }, [])

    // functions
    async function getAllUser(){
        const allUserResponse = await axios.get("http://localhost:3001/users")
        
        const userData = allUserResponse.data.data
        await userData.map((user) => {
            user.username = <Link to={`/dashboard/user/${user.id}`} className="link">{user.username}</Link>
            if(user.role == "admin"){
                user.roleName = "เจ้าหน้าที่"
            }else{
                user.roleName = "สมาชิก"
            }
            user.action = (
                <div className="more-icon">
                    <MoreVertRoundedIcon />
                    <div className="more-menu" id={`more-menu-${user.id}`}>
                        <div className="more-menu-item">
                            <Link to={`/dashboard/user/${user.id}`}>ดูรายละเอียด</Link>
                        </div>
                        <div className="more-menu-item">
                            <a href="">ลบ</a>
                        </div>
                        
                    </div>
                </div>
            )
        })
        await setUserList(userData)
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
    // elements
    const columns = [
        // {
        //     name: "#",
        //     selector: row => row.id,
        //     center: true,
        //     width: "5%"
        // },
        {
            name: "ชื่อบัญชี",
            selector: row => row.username,
            style:{
                color: 'red'
            }
        },
        {
            name: "ชื่อ-นามสกุล",
            selector: row => row.fullname
        },
        {
            name: "ระดับ",
            selector: row => row.roleName,
            center: true,
            width: "10%"
        },
        {
            name: "วันที่ลงทะเบียน",
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
                        <h3>ผู้ใช้งาน</h3>
                    </div>
                    
                </header>
                
                <div className="page-body">
                    {/* <div className='table-btn'>
                        <Link to="new"><button className='add'>เพิ่มผู้ใช้งาน</button></Link>
                    </div> */}
                    <DataTable
                        columns={columns}
                        data={userList}
                        pagination
                        customStyles={customStyles}
                        // paginationPerPage={5}
                    />
                </div>
            </section>
        </DashboardMain>
    )
}

export default DashboardUserPage;