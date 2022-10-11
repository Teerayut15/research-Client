import './ThesisItem.css'
import { Link } from 'react-router-dom'

function ThesisItem(props){
    const { thesis } = props
    const coverImageUrl = 'http://localhost:3001/images/'

    // ui
    return (
        <Link className="thesis-item" to={`/thesis/${thesis.id}`}>
            <img src={coverImageUrl+thesis.cover_image_name} alt="" />
            <div className="thesis-detail">
                <div className="detail-top">
                    <p className="title">{thesis.title}</p>
                    <div className="creators">
                        <p>
                            {thesis.creator_1}
                            &nbsp;
                            •
                            &nbsp;
                            {thesis.faculty_name}
                            &nbsp;
                            •
                            &nbsp;
                            {thesis.year}
                        </p>
                    </div>
                </div>
                <div className="detail-center">
                    <p className="abstract">{thesis.abstract}</p>
                </div>
                <div className="detail-bottom">
                    <p className="views">
                        <i className="fa-solid fa-eye"></i>
                        {thesis.views}
                    </p>
                    <p className="downloads">
                        <i className="fa-solid fa-file-arrow-down"></i>
                         {thesis.downloads}
                    </p>
                    
                </div>
            </div>
        </Link>
    );
}

export default ThesisItem;