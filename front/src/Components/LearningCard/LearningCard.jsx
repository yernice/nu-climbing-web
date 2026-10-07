import { Link } from 'react-router-dom'
import MaterialIcon from '../MaterialIcon/MaterialIcon.jsx'
import styles from './LearningCard.module.css'
import defaultImage from '../../assets/default_image.jpg'

const MAX_MATERIALS = 3

function LearningCard({ to, image=defaultImage, title="Course Title", description="", materials=[] }) {
    const shown = materials.slice(0, MAX_MATERIALS)
    const hidden = materials.length - shown.length

    return (
        <div className={styles.card}>
            <img src={image} alt={title} />
            <div className={styles.content}>
                <h2>{title}</h2>
                <p className={styles.description}>{description}</p>
                <ul className={styles.materials}>
                    {shown.map(material => (
                        <li key={material.id}>
                            <MaterialIcon type={material.type} />
                            <span>{material.title}</span>
                        </li>
                    ))}
                    {hidden > 0 && <li className={styles.more}>+{hidden} more</li>}
                </ul>
                <Link to={to} className={styles.button}>
                    <h3>LEARN →</h3>
                </Link>
            </div>
        </div>
    );
}

export default LearningCard
