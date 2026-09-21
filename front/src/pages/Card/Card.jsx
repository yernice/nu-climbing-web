import styles from './Card.module.css'
import defaultImage from '../../assets/default_image.jpg'

function Card({ cardImage=defaultImage, cardTitle="Blog Title", cardIntro="Blog Intro"}) {
    return (
        <div className={styles.card}>
            <img src={cardImage} alt="Blog Post Image"></img>
            <div className={styles.content}>
                <h1>{cardTitle}</h1>
                <p>{cardIntro}</p>
            </div>
        </div>
    );
}   

export default Card 