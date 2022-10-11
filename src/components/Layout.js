import '../App.css';
import '../fonts.css'
import './Layout.css'
import AppHeader from './AppHeader';
import Navbar from './Navbar';

function Layout(props){
    return (
        <section className='layout'>
            <AppHeader></AppHeader>
            <Navbar></Navbar>
            <div className="container" page="main">
                {props.children}
            </div>
            <footer>
                <div className="container">
                    <div className="footer-content">
                        <div className="brand">
                            <h1>TTS RMUTI</h1>
                            <p>ระบบจัดเก็บและสืบค้นปริญญานิพนธ์</p>
                        </div>
                        <div className="contacts">
                            Facebook
                        </div>
                    </div>
                </div>
            </footer>
        </section>
    )
}

export default Layout;