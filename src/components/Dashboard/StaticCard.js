import './StaticCard.css'
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import WhereToVoteRoundedIcon from '@mui/icons-material/WhereToVoteRounded';
import axios from 'axios';
import { useEffect, useState } from 'react';

function StaticCard(props){
    const { staticName } = props;

    const [statics, setStatics] = useState({})
    
    useEffect( ()=> {
        getStatics("today")
    }, [])

    async function getStatics(period){
        const url = `http://localhost:3001/static/${staticName}/${period}`
        const response = await axios.get(url)
        const responseData = response.data.data
        await setStatics({
            ["total"]: responseData.total
        })
    }

    
    return (
        <div className="static-card">
            {/* select period */}
            <select name="period" defaultValue='today' onChange={(e) => getStatics(e.target.value)}>
                <option value="today">วันนี้</option>
                <option value="yesterday">เมื่อวาน</option>
                <option value="all">ทั้งหมด</option>
            </select>

            {/* icon */}
            <div className={`card-icon ${staticName}`}>
                {
                    staticName == "visit" ? <WhereToVoteRoundedIcon />
                    : staticName == "add" ? <MenuBookRoundedIcon />
                    : <DownloadForOfflineRoundedIcon />
                }
            </div>
            
            
            <h2>{statics.total}</h2>
            {/* static name */}
            <div className="card-footer">
                {
                    staticName == "visit" ? <small>ยอดเข้าชม</small>
                    : staticName == "add" ? <small>ยอดปริญญานิพนธ์</small>
                    : <small>ยอดดาวน์โหลด</small>
                }
                
                
                
            </div>
            
            
        </div>
    )
}
export default StaticCard;