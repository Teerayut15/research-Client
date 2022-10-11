import './App.css';
import './fonts.css'
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import DashboardHome from './components/Dashboard/DashboardHome';
import ThesisPage from './components/ThesisPage';
import Page404 from './components/Page404';
import SignupPage from './components/SignupPage';
import Signout from './components/Signout';
import ResetPasswordPage from './components/ResetPasswordPage';
import ForgetPasswordPage from './components/ForgetPasswordPage';
import SearchPage from './components/SearchPage/SearchPage';
import DashboardLanding from './components/Dashboard/DashboardLanding';
import DashboardThesisPage from './components/Dashboard/DashboardThesisPage';
import DashboardUserPage from './components/Dashboard/DashboardUserPage';
import DashboardReportPage from './components/Dashboard/DashboardReportPage';
import ThesisCreatePage from './components/Dashboard/ThesisCreatePage';
import ThesisShowPage from './components/Dashboard/ThesisShowPage';
import UserShowPage from './components/Dashboard/UserShowPage';
import ReportShowPage from './components/Dashboard/ReportShowPage';
import Watermark from './components/Watermark';
function App() {
    
    return (
        <div className="App">
            <Routes>
                <Route path='/' element={ <Home></Home> }></Route>
                <Route path='thesis/:thesis_id' element={ <ThesisPage></ThesisPage> }></Route>
                {/* <Route path='signin' element={ <SigninPage></SigninPage> }></Route> */}
                <Route path='signout' element={ <Signout></Signout> }></Route>
                <Route path='watermark' element={ <Watermark></Watermark> }></Route>
                <Route path='signup' element={ <SignupPage></SignupPage> }></Route>
                <Route path='forget' element={ <ResetPasswordPage></ResetPasswordPage> }></Route>
                <Route path='search' element={ <SearchPage></SearchPage> }></Route>
                <Route path='dashboard' element={ <DashboardLanding></DashboardLanding> }></Route>
                <Route path='dashboard/home' element={ <DashboardHome></DashboardHome> }></Route>
                <Route path='dashboard/thesis' element={ <DashboardThesisPage></DashboardThesisPage> }></Route>
                <Route path='dashboard/thesis/:thesis_id' element={ <ThesisShowPage></ThesisShowPage> }></Route>
                <Route path='dashboard/thesis/new' element={ <ThesisCreatePage></ThesisCreatePage> }></Route>
                <Route path='dashboard/user' element={ <DashboardUserPage></DashboardUserPage> }></Route>
                <Route path='dashboard/user/:user_id' element={ <UserShowPage></UserShowPage> }></Route>
                <Route path='dashboard/report' element={ <DashboardReportPage></DashboardReportPage> }></Route>
                <Route path='dashboard/report/:report_id' element={ <ReportShowPage></ReportShowPage> }></Route>
                {/* <Route path='dashboard/report/:report_id' element={ <DashboardUserPage></DashboardUserPage> }></Route> */}
                <Route path='*' element={ <Page404></Page404>}></Route>
            </Routes>
            
        </div>
    );
}

export default App;
