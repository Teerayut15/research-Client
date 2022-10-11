import './DashboardHome.css'
import { useEffect } from 'react';
import DashboardMain from './DashboardMain'
import ActivityList from './ActivityList';
import StaticCard from './StaticCard';
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';

function DashboardHome(){

    // functions
    // elements
    return (
            <DashboardMain>
                <section page='home'>
                    <header>
                        
                    </header>

                    <div className="page-body">
                        <div className="static-content">
                            <header>
                                <div className="icon">
                                    <EqualizerRoundedIcon />
                                </div>
                                <h3>สถิติรวม</h3>
                            </header>
                            <div className="static-content-body">
                                <StaticCard staticName="visit" />
                                <StaticCard staticName="add" />
                                <StaticCard staticName="download" />
                            </div>
                        </div>

                        <div className="rows">
                            <div className="static-content">
                                <header>
                                    <div className="icon">
                                        <FormatListBulletedRoundedIcon />
                                    </div>
                                    <h3>กิจกรรมล่าสุด</h3>
                                </header>
                                <div className="static-content-body">
                                    <ActivityList />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </DashboardMain>
    )
}

export default DashboardHome;