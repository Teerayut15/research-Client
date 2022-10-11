import './FilterTab.css';

function FilterTab(){
    return (
        <section className="filter">
            <div className="faculty">
                <header>คณะ</header>
                <div className="checkbox-item">
                    <input type="checkbox" name="faculty" id="faculty_1" />
                    <label htmlFor="faculty_1">วิศวกรรมศาสตร์</label>
                </div>
                <div className="checkbox-item">
                    <input type="checkbox" name="faculty" id="faculty_2" />
                    <label htmlFor="faculty_2">ครุศาสตร์อุตสาหกรรม</label>
                </div>
                <div className="checkbox-item">
                    <input type="checkbox" name="faculty" id="faculty_3" />
                    <label htmlFor="faculty_3">บริหารธุรกิจ</label>
                </div>
            </div>
            <hr />
            <div className="language">
                <header>ภาษา</header>
                <div className="checkbox-item">
                    <input type="checkbox" name="language" id="language_1" />
                    <label htmlFor="language_1">ไทย</label>
                </div>
                <div className="checkbox-item">
                    <input type="checkbox" name="language" id="language_2" />
                    <label htmlFor="language_2">อังกฤษ</label>
                </div>
            </div>
            <hr />
            <div className="year">
                <header>ปีที่จัดทำ</header>
                <div className="checkbox-item">
                    <input type="checkbox" name="year" id="year_1" value={2022}/>
                    <label htmlFor="year_1">2022</label>
                </div>
                <div className="checkbox-item">
                    <input type="checkbox" name="year" id="year_2" value={2021}/>
                    <label htmlFor="year_2">2021</label>
                </div>
                <div className="checkbox-item">
                    <input type="checkbox" name="year" id="year_3" value={2020}/>
                    <label htmlFor="year_3">2020</label>
                </div>
                <div className="checkbox-item">
                    <input type="checkbox" name="year" id="year_4" value={2019}/>
                    <label htmlFor="year_4">2019</label>
                </div>
                <div className="checkbox-item">
                    <input type="checkbox" name="year" id="year_5" value={2018}/>
                    <label htmlFor="year_5">2018</label>
                </div>
            </div>
        </section>
    )
}

export default FilterTab;