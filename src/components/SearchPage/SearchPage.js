import './SearchPage.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ThesisItem from '../ThesisItem';
import Lottie from "react-lottie";
import * as loadingAnimate from "../../loading/loading-2.json"
import Layout from '../Layout';


function SearchPage(){
    // states
    const [target, setTarget] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [greetingText, setGreetingText] = useState(true);
    const [thesisResults, setThesisResults] = useState([]);
    const [loading, setLoading] = useState(false)
    const [yearFilter, setYearFilter] = useState({
        2022: false,
        2021: false,
        2020: false,
        2019: false,
        2018: false
    })
    const [facultyFilter, setFacultyFilter] = useState({
        'engineer': false,
        'education': false,
        'business': false
    })

    // intial
    useEffect(() => {
        document.title = `ค้นหาปริญญานิพนธ์ | ระบบสืบค้นและจัดเก็บปริญญานิพนธ์`
        const searchDelay = setTimeout( async () => {
            search()
        }, 500)

        return () => clearTimeout(searchDelay);
    },[searchText])

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // functions
    function inputHandle(e){
        setTarget(e.target.value)
    }
    async function checkboxHandle(event){
        const { name, value, checked } = event.target
        if(name == 'year'){
            await setYearFilter({
                ...yearFilter,
                [value]: checked
            })
        }else if(name == 'faculty'){
            await setFacultyFilter({
                ...facultyFilter,
                [value]: checked
            })
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function addYearCheckbox(){
        const keys = Object.keys(yearFilter);
        const minYear = Math.min(...keys);
        await setYearFilter({
            ...yearFilter,
            [minYear - 1]: false,
            [minYear - 2]: false,
            [minYear - 3]: false,
            [minYear - 4]: false,
            [minYear - 5]: false
        })
        await document.getElementById(`year_${minYear - 5}`).focus()
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function search(){
        if(searchText == ''){
            setGreetingText(true)
            setThesisResults([])
            return 0
        }
        setLoading(true)
        setGreetingText(false)
        const params = {"target": target, "searchText": searchText}
        const headers = { "Content-Type": "Application/json"}
        const url = `http://localhost:3001/search/${params.target}/${params.searchText}`;
        const searchResposne = await axios.get(url, {headers})
        let searchResposneData = searchResposne.data.data
        
        if(searchResposneData == undefined){
            searchResposneData = []
        }
        setTimeout(async () => {
            await setThesisResults((prevData) => {
                return searchResposneData
            })
            setLoading(false)
        }, 2000);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function enterHandle(e){
        if(e.keyCode === 13){ // key 'ENTER' pressed.
            search()
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function sort(e){
        const sortName = e.target.value
        let sortedData = null;
        if(sortName == "popular"){
            sortedData = await thesisResults.sort((thesis1, thesis2) => {
                return thesis2.views - thesis1.views
            })
        }else if(sortName == "oldest"){
            sortedData = await thesisResults.sort((thesis1, thesis2) => {
                return thesis1.id - thesis2.id
            })
        }else{
            sortedData = await thesisResults.sort((thesis1, thesis2) => {
                return thesis2.id - thesis1.id
            })
        }
        await setThesisResults([])
        await setThesisResults(sortedData)
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    const filterList = { ...facultyFilter, ...yearFilter}
    const asArray = Object.entries(filterList);
    const filteredItem = asArray.filter(item => {
        return item[1]
    })
    const yearChecked = Object.keys(yearFilter).filter(key => {
        return yearFilter[key]
    })
    const facultyChecked = Object.keys(facultyFilter).filter(key => {
        return facultyFilter[key]
    })
    let filterType = {
        year: false,
        faculty: false
    }
    if(yearChecked.length > 0){
        filterType.year = true
    }else{
        filterType.year = false
    }
    if(facultyChecked.length > 0){
        filterType.faculty = true
    }else{
        filterType.faculty = false
    }
    const filterTypeCount = Object.keys(filterType).filter(key => {
        return filterType[key]
    })
    const filteredThesis = thesisResults.filter((thesis) => {
        if(filterTypeCount.length > 1){
            console.log('use and')
            return filterList[thesis.year] && filterList[thesis.faculty_eng_name]
        }else{
            console.log('use or')
            return filterList[thesis.year] || filterList[thesis.faculty_eng_name]
        }
    })
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimate.default,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    let greetingElement = <div className='greeting-text'>
        <i className="fa-solid fa-book"></i>
        <p>ค้นหาปริญญานิพนธ์จาก ชื่อหัวข้อ, ชื่อผู้จัดทำ หรือ ชื่อที่ปรึกษา</p>
    </div>

    let notFound = null
    let searchThesisElements = null
    let filteredThesisElements = null
    if (thesisResults.length == 0) {
        notFound = <div className='notfound'>
            <div className="icon">
            <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <div className="text">
                <i className="fa-solid fa-quote-left"></i>
                <p>ขออภัย, ไม่สามารถค้นหาปริญญานิพนธ์จากคำที่ค้นหาได้ โปรดลองค้นหาใหม่อีกครั้ง</p>
                <i className="fa-solid fa-quote-right"></i>
            </div>
        </div>
    }else{
        searchThesisElements = thesisResults.map((thesis) => {
            return <ThesisItem thesis={thesis} key={thesis.id}></ThesisItem>
        })
        filteredThesisElements = filteredThesis.map(thesis => {
            return <ThesisItem thesis={thesis} key={thesis.id}></ThesisItem>
        })
    }
    const yearCheckboxElement = Object.entries(yearFilter).sort().reverse().map(key => {
        return (
            <div className="checkbox-item" key={key[0]}>
                <input type="checkbox" name="year" id={`year_${key[0]}`} onChange={checkboxHandle} checked={key[1]} value={key[0]}/>
                <label htmlFor={`year_${key[0]}`}>{key[0]}</label>
            </div>
        )
    })
    
    // ui
    return (
        <section className="search">
           
           <Layout>
                <div className="search-body">
                    <div className="search-target">
                        <select name="target" id="" onChange={inputHandle}>
                            <option value="all">ค้นหาทั้งหมด</option>
                            <option value="title">ชื่อหัวข้อ</option>
                            <option value="creators">ชื่อผู้จัดทำ</option>
                            <option value="advisor">ชื่อที่ปรึกษา</option>
                        </select>
                    </div>
                    <div className="search-input">
                        <input 
                            type="text" 
                            className='input-word' 
                            name="word" 
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={enterHandle}
                            placeholder='ค้นหา..'
                        />
                    </div>
                </div>
                <div className="search-result">
                    <div className="search-sort">
                        <p>จัดเรียงข้อมูลโดย</p>
                        <div className="select-box">
                            <select name="sort" id="" onChange={sort}>
                                <option value="newest">ใหม่สุด</option>
                                <option value="oldest">เก่าสุด</option>
                                <option value="popular">ยอดนิยม</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* แสดง loading animation  */}
                        { 
                            !loading ? null
                            : <div className='loading-animate'>
                                <Lottie options={defaultOptions} height={140} width={140} />
                                <p>กำลังโหลด</p>
                            </div>
                        }

                    {greetingText ? greetingElement : null}

                    {/* แสดงผลลัพธิ์การค้นหา */}
                    {
                        searchThesisElements == null
                        ? !greetingText
                            ? notFound
                            : null
                        // ? notFound
                        : searchThesisElements.length < 1
                            ? null
                            : <div className='search-thesis-element'>
                                <div className="thesis">
                                    {
                                        filteredItem.length == 0 && filteredThesis.length == 0
                                        ? searchThesisElements
                                        : filteredThesisElements.length == 0
                                        ? 'ไม่มี'
                                        : filteredThesisElements
                                    }
                                </div>
                                <div className="filter">
                                    <div className="faculty">
                                        <header>คณะ</header>
                                        <div className="checkbox-item">
                                            <input type="checkbox" name="faculty" id="faculty_engineer" onChange={checkboxHandle} checked={facultyFilter['engineer']} value='engineer'/>
                                            <label htmlFor="faculty_engineer">วิศวกรรมศาสตร์</label>
                                        </div>
                                        <div className="checkbox-item">
                                            <input type="checkbox" name="faculty" id="faculty_education" onChange={checkboxHandle} checked={facultyFilter['education']} value='education'/>
                                            <label htmlFor="faculty_education">ครุศาสตร์อุตสาหกรรม</label>
                                        </div>
                                        <div className="checkbox-item">
                                            <input type="checkbox" name="faculty" id="faculty_business" onChange={checkboxHandle} checked={facultyFilter['business']} value='business' />
                                            <label htmlFor="faculty_business">บริหารธุรกิจ</label>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="year">
                                        <header>ปีที่จัดทำ</header>
                                        {yearCheckboxElement}
                                    </div>
                                </div>
                            </div>
                    }
                </div>
           </Layout>
            
        </section>
    );
}

export default SearchPage;