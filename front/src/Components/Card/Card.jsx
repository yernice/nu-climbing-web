import Button from '../Button/Button.jsx'
import styles from './Card.module.css'
import defaultImage from '../../assets/default_image.jpg'

function Card({
    to,
    cardImage=defaultImage,
    cardTitle="Blog Title",
    cardDate,
    cardText,
    details,
    buttonText="READ MORE",
    buttonDisabled=false,
}) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={cardImage} alt={cardTitle} />
                {cardDate && <span className={styles.date}>{cardDate}</span>}
            </div>
            <h2>{cardTitle}</h2>
            {details && (
                <dl className={styles.details}>
                    {details.map(detail => (
                        <div key={detail.label}>
                            <dt>{detail.label}</dt>
                            <dd>{detail.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
            {cardText && <p className={styles.text}>{cardText}</p>}
            <div className={styles.action}>
                <Button to={to} disabled={buttonDisabled} small>{buttonText}</Button>
            </div>
        </div>
    );
}

export default Card
