import { useEffect } from "react"

function Signout(){

    useEffect(()=>{
        signout()
    }, [])

    async function signout(){
        await localStorage.removeItem("username")
        await localStorage.removeItem("role")
        await localStorage.removeItem("accessToken")
        window.location.href = "http://localhost:3000/"
    }
    return (
        <section>
            {/* <h1>SIGN OUT HERE.</h1> */}
        </section>
    );
}

export default Signout;