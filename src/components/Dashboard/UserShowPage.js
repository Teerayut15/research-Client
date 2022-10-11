import DashboardMain from "./DashboardMain";
import './UserShowPage.css'
import './ThesisCreatePage.css'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
function UserShowPage(){
    const { user_id } = useParams();
    const [userData, setUserData] = useState({})
    const [userProfile, setUserProfile] = useState({})
    const [userInput, setUserInput] = useState({})
    useEffect(() => {
        getUser()
    }, [user_id])

    // functions
    async function getUser(){
        const url = `http://localhost:3001/users/${user_id}`;
        const response = await axios.get(url)
        const userData = response.data.data[0]
        
        if(response.data.code == 200){
            setUserInput(userData)
            setUserData(userData)
        }else{

        }
    }

    function userInputHandle(event){
        const { name, value } = event.target
        if(value == userData[name]){
            event.target.className = ""
        }else{
            event.target.className = "uploaded"
        }
        setUserInput({
            ...userInput,
            [name]: value
        })
    }
    async function saveUserProfile(){
        const url = `http://localhost:3001/users/profile`
        const headers = {
            'Content-Type': 'Application/json',
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
        const body = {
            userId: userInput.id,
            fullname: userInput.fullname,
            role: userInput.role
        }
        await Swal.fire({
            icon: 'question',
            title: 'ต้องการบันทึกข้อมูล ?',
            confirmButtonText: 'ใช่',
            confirmButtonColor: '#ffa502',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            allowOutsideClick: false,
            showLoaderOnConfirm: true,
            preConfirm: async() => {
                const response = await axios.put(url, body, {headers})
                return response.data
            }
        }).then(result => {
            if(result.value.code == 200){
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                    timer: 1500,
                    allowOutsideClick: false,
                    showConfirmButton: false
                }).then(() => window.location = "http://localhost:3000/dashboard/user")
            }
        })
    }

    return (
        <DashboardMain>
            <section page="show-user">
                <header>
                    <div className="page-back">
                        <KeyboardBackspaceRoundedIcon />
                        ย้อนกลับ
                    </div>
                    <div className="page-title">
                        <h3>{`โปรไฟล์ของ ${userInput.username}`}</h3>
                    </div>
                    
                </header>
                <div className="input-list">
                    <div className="input-item">
                        <label htmlFor="username-input">ชื่อผู้ใช้งาน</label>
                        <input 
                            type="text" 
                            id='title-input' 
                            name='title' 
                            value={userInput.username}
                            placeholder='กรอกชื่อหัวผู้ใช้งาน'
                            disabled
                        />
                    </div>
                    <div className="input-item">
                        <label htmlFor="email-input">อีเมล</label>
                        <input 
                            type="text" 
                            id='title-input' 
                            name='title' 
                            value={userInput.email}
                            placeholder='กรอกอีเมล'
                            disabled
                        />
                    </div>
                    <div className="input-item">
                        <label htmlFor="fullname-input">ชื่อ - นามสกุล</label>
                        <input 
                            type="text" 
                            id='title-input' 
                            name='fullname' 
                            value={userInput.fullname}
                            placeholder='กรอกชื่อ - นามสกุล'
                            onChange={userInputHandle}
                        />
                    </div>
                    <div className="input-item">
                        <label htmlFor="role-input">ระดับสมาชิก </label>
                        <select name="role" onChange={userInputHandle}>
                            {
                                userInput.role == "admin" ? <option value="admin" selected>เจ้าหน้าที่</option>
                                : <option value="admin">เจ้าหน้าที่</option>
                            }
                            {
                                userInput.role == "member" ? <option value="member" selected>สมาชิก</option>
                                : <option value="member">สมาชิก</option>
                            }
                        </select>
                    </div>
                </div>
                <div className="form-button">
                        <hr /><br />
                        <button onClick={saveUserProfile}>บันทึกข้อมูล</button>
                        
                </div>
            </section>
        </DashboardMain>
    )
}

export default UserShowPage;