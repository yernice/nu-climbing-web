import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

function Hero({ heroImage, heroTitle, heroText, buttonText, buttonLink }) {
    return (
        <div className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
            <div className={styles.box}>
                <h1>{heroTitle}</h1>
                <p>{heroText}</p>
                <Link to={buttonLink} className={styles.button}>{buttonText}</Link>
            </div>
        </div>
    );
}

export default Hero