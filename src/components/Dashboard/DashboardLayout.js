import './DashboardLayout.css';
import Sidebar from './Sidebar';
import DashboardMain from './DashboardMain';

function DashboardLayout(props){
    return (
        <section className="dashboard-layout">
            <Sidebar></Sidebar>
            {props.children}
        </section>
    )
}

export default DashboardLayout;