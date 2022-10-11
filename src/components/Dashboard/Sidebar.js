import './Sidebar.css'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone';
import DeckTwoToneIcon from '@mui/icons-material/DeckTwoTone';
import FlagTwoToneIcon from '@mui/icons-material/FlagTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
function Sidebar(){

    // states
    const [userProfile, setUserProfile] = useState({})

    useEffect(() => {
        // checkAccessToken()
        checkAuthen()
    }, [])
    // functions
    async function signout(){
        Swal.fire({
            icon: 'question',
            title: 'คุณต้องการออกจากระบบ ?',
            confirmButtonText: 'ใช่',
            confirmButtonColor: '#ffa502',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            showConfirmButton: true,
            preConfirm: async () => {
                await localStorage.removeItem("accessToken")
                window.location.href = await "http://localhost:3000/"
            }
        })
    }
    
    async function checkAuthen(){
        if(localStorage.getItem("accessToken") == null){
            
            await Swal.fire({
                icon: 'warning',
                title: 'กรุณาเข้าสู่ระบบก่อนเข้าใช้งาน',
                timer: 1000,
                showConfirmButton: false
            })
            window.location.href = await "http://localhost:3000/"
        }else{
            await checkAccessToken()
        }
    }
    async function checkAccessToken(){
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
        const url = 'http://localhost:3001/auth/check';
        const authenResposne = await axios.post(url,{}, {headers});
        if(authenResposne.data == false){
            await localStorage.removeItem("accessToken")
            window.location.href = await "http://localhost:3000/"
        }else{
            await getUserProfile()
        }
    }
    async function getUserProfile(){
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
        const url = 'http://localhost:3001/users/my/profile';
        const profileResponse = await axios.get(url, {headers})
        var size = Object.keys(userProfile).length;
        if(size < 1){
            setUserProfile({
                ["username"]: profileResponse.data.data.username,
                ["fullname"]: profileResponse.data.data.fullname,
                ["role"]: profileResponse.data.data.role.toUpperCase(),
                ["firstLetterFullname"]: profileResponse.data.data.fullname.charAt(0)
            })
        }else{

        }
        
        
    }
    return (
        <section className="sidebar">
            {/* <div className="burger-button">
                <MenuOpenRoundedIcon 
                    className='sidebar-icon'
                />
            </div> */}
            <header>
                <div className="logo">
                    <h1>TTs BackEnd</h1>
                </div>
                    {
                        localStorage.getItem("accessToken") == null
                        ? null
                        : (
                            <div className="admin-profile">
                                <div className="avatar">
                                    {userProfile.firstLetterFullname}
                                </div>
                                <small>{userProfile.role}</small>
                                <h5>{userProfile.fullname}</h5>
                            </div>
                        )
                    }
            </header>
            <div className="menu-list">
                <div className="menu-item active">
                    <DashboardTwoToneIcon
                        className='sidebar-icon'
                    />
                    <Link to="/dashboard/home">แดชบอร์ด</Link>
                </div>
                <div className="menu-item">
                    <LibraryBooksTwoToneIcon 
                        className='sidebar-icon'
                    />
                    <Link to="/dashboard/thesis">ปริญญานิพนธ์</Link>
                </div>
                <div className="menu-item">
                    <FlagTwoToneIcon 
                        className='sidebar-icon'
                    />
                    <Link to="/dashboard/report">รายงาน</Link>
                </div>

                <div className="menu-item">
                    <AccountCircleTwoToneIcon
                        className='sidebar-icon'
                    />
                    <Link to="/dashboard/user">ผู้ใช้งาน</Link>
                </div>
                <div className="menu-item">
                    <DeckTwoToneIcon
                        className='sidebar-icon'
                    />
                    <Link to="/">กลับสู่หน้าหลัก</Link>
                </div>
                <div className="menu-item">
                    <MeetingRoomTwoToneIcon
                        className='sidebar-icon'
                    />
                    <a href="#" className='signout' onClick={signout}>ออกจากระบบ</a>
                </div>
            </div>
        </section>
    )
}
export default Sidebar;