import logo from '../assets/images/logo-kkc.png'
import './AppHeader.css'

function AppHeader(){
    return (
        <section className="app-header">
            <div className="container">
                <div className="app-header-body">
                    <img src={logo} alt="" />
                </div>
            </div>
        </section>
    );
}

export default AppHeader;