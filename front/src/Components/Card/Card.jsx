import styles from './Card.module.css'
import defaultImage from '../../assets/default_image.jpg'

function Card({ cardImage=defaultImage, cardTitle="Blog Title", cardDate="00.00"}) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={cardImage} alt="Blog Post Image" />
                <span className={styles.date}>{cardDate}</span>
            </div>
            <h2>{cardTitle}</h2>
            <p>READ MORE</p>
        </div>
    );
}   

export default Card 