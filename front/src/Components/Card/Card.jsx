import { Link } from 'react-router-dom'
import styles from './Card.module.css'
import defaultImage from '../../assets/default_image.jpg'

function Card({ to, cardImage=defaultImage, cardTitle="Blog Title", cardDate="00.00"}) {
    return (
        <Link to={to} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={cardImage} alt="Blog Post Image" />
                <span className={styles.date}>{cardDate}</span>
            </div>
            <h2>{cardTitle}</h2>
            <p>READ MORE</p>
        </Link>
    );
}

export default Card
