import { useEffect } from "react";

function DashboardLanding(){
    useEffect(() => {
        window.location = "http://localhost:3000/dashboard/home"
    })
    return (
        <section></section>
    )
}
export default DashboardLanding;