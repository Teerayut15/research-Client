import './SlideItem.css';
import { Link } from 'react-router-dom'

function SlideItem(props){

    const { thesis } = props;
    const coverImageUrl = 'http://localhost:3001/images/'
    return (
        <Link className="slide-item" to={`/thesis/${thesis.id}`}>
            <div className="slide-top">
                <img src={coverImageUrl+thesis.cover_image_name} alt="" />
            </div>
            <div className="slide-center">
                <p>{thesis.title}</p>
            </div>
            <div className="slide-bottom">
                <p>{thesis.creator_1}</p>
            </div>
        </Link>
    );
}

export default SlideItem;