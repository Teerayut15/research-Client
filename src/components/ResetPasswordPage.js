import { useEffect } from 'react';
import Layout from './Layout';
import './ResetPasswordPage.css'
import Swal from 'sweetalert2';


function ResetPasswordPage(){

    useEffect(() => {
        checkAuthen()
    }, [])

    // functions
    async function checkAuthen(){
        if(localStorage.getItem("accessToken") != null){
            await Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถเข้าถึงได้',
                timer: 500,
                showConfirmButton: false,
                backdrop: '#c3c3c3'
            })
            await window.history.back()
        }
    }
    return (
        <Layout>
            <section page='reset-pwd'>
                <div className="reset-pwd-body">
                    <h2>รีเซ็ตรหัสผ่าน</h2>
                    <p>ระบุอีเมลที่ใช้สร้างบัญชี สำหรับการรีเซ็ตรหัสผ่าน</p>
                    <div className="input-item">
                        <label>อีเมล</label>
                        <input type="text" name="email" id="email-input" placeholder='กรอกอีเมล' />
                    </div>
                    <div className="footer">
                        <button>รีเซ็ตรหัสผ่าน</button>
                    </div>
                </div>
            </section>
            
        </Layout>
    )
}

export default ResetPasswordPage;