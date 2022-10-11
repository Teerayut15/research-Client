import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './SigninPage.css'

function SigninPage(props){
    const {onOutSideClick} = props
    const [inputs, setInput] = useState({
        "username": "",
        "password": ""
    })
    function inputHandle(e){
        setInput({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }
    async function authen(){
        const url = "http://localhost:3001/auth";
        const headers = { "Content-Type": "Application/json"}
        const body = {"username": inputs.username, "password": inputs.password}
        const authenResposne = await axios.post(url, body, {headers})
       if(authenResposne.data.code == 200){
            localStorage.setItem("username", authenResposne.data.username)
            localStorage.setItem("role", authenResposne.data.role)
            localStorage.setItem("accessToken", authenResposne.data.access_token)
            onOutSideClick()
       }else{
            Swal.fire({
                icon: 'warning',
                title: 'รหัสผ่านหรือบัญชีผู้ใช้งานไม่ถูกต้อง !!',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#ffa502',
                width: 'auto'
            })
       }
       
    }
    return (
        <section className="signin-page">
            <div className="signin-bg" onClick={onOutSideClick}></div>
            <div className="signin-content">
                <div className="signin-forms">
                    <header><h1>TSS RMUTI</h1></header>
                    <div className="input">
                        <label htmlFor="username">ชื่อผู้ใช้งาน</label>
                        <input type="text" id="username" name="username" placeholder='ชื่อผู้ใช้งาน' value={inputs.username} onChange={inputHandle} />
                    </div>
                    <div className="input">
                        <label htmlFor="password">รหัสผ่าน</label>
                        <input type="password" id="password" name="password" placeholder='รหัสผ่าน' value={inputs.password} onChange={inputHandle} />
                        <Link to='/forget' className='ml-auto '> <small onClick={onOutSideClick}>ลืมรหัสผ่าน</small> </Link>
                    </div>
                    <div className="input">
                        <button type='button' className='signin' onClick={authen}>เข้าสู่ระบบ</button>
                        <small className='secondary'>ยังไม่มีบัญชี. <Link to='/signup' onClick={onOutSideClick}>สร้างบัญชี</Link></small>
                    </div>
                </div>
            </div>
           
        </section>
    )
}

export default SigninPage;