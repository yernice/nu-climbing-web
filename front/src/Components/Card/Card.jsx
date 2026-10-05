import styles from './Card.module.css'
import defaultImage from '../../assets/default_image.jpg'

function Card({ cardImage=defaultImage, cardTitle="Blog Title"}) {
    return (
        <div className={styles.card}>
            <img src={cardImage} alt="Blog Post Image"></img>
            <h2>{cardTitle}</h2>
            <p>READ MORE</p>
        </div>
    );
}   

export default Card 