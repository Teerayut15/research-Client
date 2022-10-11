import { useState, useEffect} from 'react'
import SlideItem from './SlideItem';
import './Slide.css';
import ItemsCarousel from 'react-items-carousel';

function Slide(props){
    const { dataList } = props;
    let windowWidth = window.innerWidth

    // state
    const [itemPerSlide, setItemPerSlide] = useState(2)
    
    // effect
    useEffect(() => {
        updateWidth()
    }, [])
    
    const updateWidth = () => {
        windowWidth = window.innerWidth
        if(windowWidth < 768){
            console.log("iphone")
            setItemPerSlide(2)
        }else if(windowWidth >= 768 && windowWidth <= 1023){
            console.log("ipad")
            setItemPerSlide(4)
        }else if(windowWidth > 1023 && windowWidth <= 1335){
            console.log("small labtop")
            setItemPerSlide(5)
        }else if(windowWidth > 1335){
            console.log("labtop")
            setItemPerSlide(6)
        }
    }
    window.addEventListener('resize', updateWidth)

    
    const popularThesisElements = dataList.map((thesis, index) => {
        return <SlideItem thesis={thesis} key={index}></SlideItem>
    })

    // setting slide
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const chevronWidth = 40;
    return (
        <section className="slide">
            <ItemsCarousel
                requestToChangeActive={setActiveItemIndex}
                activeItemIndex={activeItemIndex}
                numberOfCards={itemPerSlide}
                gutter={20}
                leftChevron={<i className="fa-solid fa-circle-chevron-left slide-button"></i>}
                rightChevron={<i className="fa-solid fa-circle-chevron-right slide-button"></i>}
                outsideChevron
                infiniteLoop={true}
                disableSwipe={false}
                chevronWidth={chevronWidth}
            >
                {popularThesisElements}
            </ItemsCarousel>
        </section>
    );
}

export default Slide;