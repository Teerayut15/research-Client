import './ActivityList.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

function ActivityList(){

    const [activities, setActivities] = useState([])
    useEffect(() => {
        getLastActivity()
    }, [])
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // functions
    async function getLastActivity(){
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
        const url = `http://localhost:3001/historys/lastest`
        const response = await axios.get(url, { headers })
        setActivities(response.data.data)
        console.log(response.data.data)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getUserRole(){
        
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // elements
    const activityElements = activities.map((activity) => {
        return (
            <div className="activity-item" key={activity.id}>
                <div className={`icon ${activity.type}`}>
                    {
                        activity.type == "add" ? <AddRoundedIcon />
                        : activity.type == "download" ? <DownloadingRoundedIcon />
                        : activity.type == "edit" ? <EditRoundedIcon />
                        : <DeleteForeverRoundedIcon />
                    }
                </div>
                <div className="image-cover">
                    <img src="" alt="" />
                </div>
                <div className="title two-line">
                    <p>{activity.thesis_title}</p>
                    <small>{activity.note}</small>
                </div>
                <div className="two-line end">
                    <p className='date'>{activity.date}</p>
                    <small className='time'>{`${activity.time.split(':')[0]}:${activity.time.split(':')[1]}`}</small>
                </div>
                <p className='name'>{activity.user_name}</p>
            </div>
        )
    })

    return (
        <section className='activity-list'>
            {activityElements}
        </section>
    )
}
export default ActivityList;