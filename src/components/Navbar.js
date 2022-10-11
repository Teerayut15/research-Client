import './Navbar.css'
import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SigninPage from './SigninPage'

function Navbar(){

    // state
    const [clickSignin, setClickSignin] = useState(null)
    

    useEffect(()=>{
        if(localStorage.getItem("accessToken") != null){
            checkAccessToken()
        }
    }, [])

    // functions
    async function checkAccessToken(){
        const headers = {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
        const url = 'http://localhost:3001/auth/check';
        const authenResposne = await axios.post(url,{}, {headers});
        // console.log(authenResposne.data)
        if(authenResposne.data == false){
            window.location.href = "http://localhost:3000/signout"
        }
    }
    
    function openSignin() {
        setClickSignin("login title")
        document.body.style.overflow = "hidden"
    }
    async function closeSignin() {
        await setClickSignin(null)
        document.body.style.overflow = "scroll"
    }

    // elements
    let signinPage = null
    if (!!clickSignin) {
        signinPage = <SigninPage title={clickSignin} onOutSideClick={closeSignin}></SigninPage>
    }
    return (
        <section className="navbar" id='navbar'>
            <div className="container">
                <div className="navbar-body">
                    <Link className='mobile' to='/'><h3>TTS Online</h3></Link>
                    <Link to="/search" className="mobile"><i className="fa-solid fa-magnifying-glass"></i></Link>
                    <Link to="/" className='mobile'><i className="fa-solid fa-bars"></i></Link>
                    <Link to="/" className='no-underline txt-white'>หน้าหลัก</Link>
                    <Link to="/search" className='no-underline txt-white'>ค้นหาปริญญานิพนธ์</Link>
                    {
                        localStorage.getItem("accessToken") == null ? <a href='#' className='no-underline txt-white' onClick={openSignin}>เข้าสู่ระบบ</a>
                        : (
                            <div className="user-dropdown">
                                <a href='#'>{localStorage.getItem("username")}</a>
                                <div className="dropdown-menu" id='dropdown'>
                                    {
                                        localStorage.getItem("role") != "admin" 
                                        ? null
                                        : (
                                            <div className="dropdown-menu-item">
                                                <Link to="/dashboard">จัดการหลังบ้าน</Link>
                                            </div>
                                        )
                                    }
                                    <div className="dropdown-menu-item">
                                        <Link to="/signout">ออกจากระบบ</Link>
                                    </div>
                                </div>
                            </div> 
                        )
                    }
                    
                </div>
                {signinPage}
            </div>
        </section>
    );
}

export default Navbar;