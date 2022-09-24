import './DashboardMain.css'
import DashboardLayout from './DashboardLayout'

function DashboardMain(props){
    return (
        <DashboardLayout>
            <section className='dashboard-main'>
                <div className="hidden-sidebar"></div>
                {props.children}
            </section>
        </DashboardLayout>     
    )
}

export default DashboardMain;