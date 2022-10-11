import './SignupPage.css'
import Layout from './Layout';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import axios from 'axios';

function SignupPage(){

    // states
    const [userInput, setUserInput] = useState({})

    useEffect(() => {
        if(localStorage.getItem("accessToken") != null){
            window.history.back()
        }
    })

    // functions
    function inputHandle(event){
        const { name, value } = event.target
        event.target.className = ""
        setUserInput({
            ...userInput,
            [name]: value
        })
    }
    function emailValidate(input){
        if(input.validity.valid && input.name == 'email'){
            return true
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกอีเมลให้ถูกต้อง !!',
                showConfirmButton: false
            })
            input.className = "required-input "
            input.focus()
            return false
        }
    }
    function usernameLengthValidate(input){
        if(input.validity.valid && input.name == 'username'){
            return true
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'บัญชีผู้ใช้งานควรมีความยาว 8 ตัวอักษรขึ้นไป !!',
                showConfirmButton: false,
                width: '680px'
            })
            input.className = "required-input"
            input.focus()
            return false
        }
    }
    function passwordLengthValidate(input){
        if(input.validity.valid && input.name == 'password'){
            return true
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'รหัสผ่านควรมีความยาว 12 ตัวอักษรขึ้นไป !!',
                showConfirmButton: false,
                width: '680px'
            })
            input.className = "required-input"
            input.focus()
            return false
        }
    }
    function passwordMatchValidate(password, confirmPassword){
        if(password.value == confirmPassword.value){
            return true
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'รหัสผ่านไม่ตรงกัน !!',
                showConfirmButton: false
            })
            return false
        }
    }
    function emptyValidate(){
        let emptyValidateArray = []
        const emailElement = document.getElementById('email-input')
        const fullnameElement = document.getElementById('fullname-input')
        const usernameElement = document.getElementById('username-input')
        const passwordElement = document.getElementById('password-input')
        const passwordConfirmElement = document.getElementById('passwordConfirm-input')
        const elementArray = [emailElement, fullnameElement, usernameElement, passwordElement, passwordConfirmElement]

        for(let index = 0; index < elementArray.length; index++){
            if(elementArray[index].value == ""){
                Swal.fire({
                    icon: 'warning',
                    title: 'กรุณากรอกข้อมูลให้ครบ !!',
                    showConfirmButton: false
                })
                elementArray[index].className = "required-input"
                elementArray[index].focus()
                emptyValidateArray.push(false)
            }else{
                emptyValidateArray.push(true)
            }
        }

        const validateFilter = emptyValidateArray.filter( (valid) => {
            return valid == true
        })
        if(validateFilter.length == 5){
            return true
        }else{
            return false
        }
    }
    async function validateForm(){
        const allValidate = []
        const emailElement = document.getElementById('email-input')
        const usernameElement = document.getElementById('username-input')
        const passwordElement = document.getElementById('password-input')
        const passwordConfirmElement = document.getElementById('passwordConfirm-input')

        allValidate.push(await emptyValidate())
        allValidate.push(await emailValidate(emailElement))
        allValidate.push(await usernameLengthValidate(usernameElement))
        allValidate.push(await passwordLengthValidate(passwordElement))
        allValidate.push(await passwordMatchValidate(passwordElement, passwordConfirmElement))
        

        const validateFilter = allValidate.filter( (valid) => {
            return valid == true
        })
        if(validateFilter.length == 5){
            return true
        }else{
            return false
        }
    }
    async function signup(){
        const url = `http://localhost:3001/auth/signup`
        const headers = {
            'Content-Type': 'Application/json'
        }
        const validate = await validateForm()
        console.log(validate)
        if(validate){
            const response = await axios.post(url, userInput, { headers })
            if(response.data.code == 200){
                await Swal.fire({
                    icon: 'success',
                    title: 'สร้างบัญชีผู้ใช้งานสำเร็จ',
                    timer: 1500,
                    showConfirmButton: false
                })
                window.location = await "http://localhost:3000"
            }else if(response.data.code == 409){
                await Swal.fire({
                    icon: 'warning',
                    title: 'ชื่อบัญชีนี้ถูกใช้งานไปแล้ว',
                    timer: 1500,
                    showConfirmButton: false
                })
            }else{

            }
        }
    }

    return (
        <Layout>
            <section page='signup'>
                
                <div className="signup-body">
                    <header>
                        <h2>สร้างบัญชีผู้ใช้งานใหม่</h2>
                        <p>เมื่อมีบัญชีผู้ใช้คุณจะสามารถใช้งานเว็บได้อย่างราบรื่น</p>
                        
                    </header>
                    <div className="signup-content">
                        <div className="input-list">
                            <div className="input-item">
                                <label>อีเมล <span className='require'>*</span></label>
                                <input 
                                    type="email" 
                                    name='email' 
                                    id='email-input' 
                                    onChange={inputHandle} 
                                    placeholder='กรอกอีเมล' 
                                />
                            </div>
                            <div className="input-item">
                                <label>ชื่อ - นามสกุล <span className='require'>*</span></label>
                                <input 
                                    type="text" 
                                    name='fullname' 
                                    id='fullname-input' 
                                    onChange={inputHandle} 
                                    placeholder='กรอกชื่อ - นามสกุล ' 
                                />
                            </div>
                            <div className="input-item">
                                <label>ชื่อบัญชี <span className='require'>*</span></label>
                                <input 
                                    type="text" 
                                    name='username' 
                                    id='username-input' 
                                    onChange={inputHandle} 
                                    placeholder='กรอกชื่อบัญชีผู้ใช้งาน 8 ตัวอักษรขึ้นไป' 
                                    minlength="8"
                                />
                            </div>
                            <div className="input-item">
                                <label>รหัสผ่าน <span className='require'>*</span></label>
                                <input 
                                    type="password" 
                                    name='password' 
                                    id='password-input' 
                                    onChange={inputHandle} 
                                    placeholder='กรอกรหัสผ่าน'
                                    minlength="12"
                                />
                            </div>
                            <div className="input-item">
                                <label>ยืนยันรหัสผ่าน <span className='require'>*</span></label>
                                <input 
                                    type="password" 
                                    name='confirmPassword' 
                                    id='passwordConfirm-input' 
                                    onChange={inputHandle} 
                                    placeholder='กรอกรหัสผ่าน'
                                    minlength="12"
                                />
                            </div>

                            <div className="form-button">
                                <button onClick={signup}>สร้างบัญชีเดี๋ยวนี้</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default SignupPage;