import { useState, useEffect} from 'react'
import axios from "axios";
import Slide from './Slide';
import ThesisItem from './ThesisItem';
import Layout from './Layout';

function Home(){
    // state สำหรับรายการยอดนิยม
    const [thesisList, setThesisList] = useState([])

    useEffect(() => {
        document.title = "ระบบจัดเก็บและสืบค้นปริญญานิพนธ์"
        getAllThesis()
        // visitCount()
    }, [])

    const getAllThesis = async () => {
        const response = await axios.get('http://localhost:3001/thesis');
        const thesisData = await response.data.data;
        setThesisList(thesisData)
    }

    // const visitCount = async () => {
    //     const url = "http://localhost:3001/static/visit"
    //     const response = await axios.post(url)
    //     console.log(response.data)
    // }

    // elements
    const newThesisElements = thesisList.map((thesis, index) => {
        return <ThesisItem thesis={thesis} key={index}></ThesisItem>
    })

    return (
        <section className="home">
            <Layout>
                {/* สไลด์รายการยอดนิยม */}
                <section className="content">
                    <header>
                        <h1>รายการยอดนิยม</h1>
                    </header>
                    <Slide dataList={thesisList}></Slide>
                </section>
                {/* ////////////////////////////////// */}
                
                {/* รายการมาใหม่ */}
                <section className="content">
                    <header>
                        <h1>รายการมาใหม่</h1>
                    </header>
                    <div className="thesis-card">
                        {newThesisElements}
                    </div>
                </section>
                {/* /////////////////////////////////////////// */}
            </Layout>
            
        </section>
    );
}
export default Home;