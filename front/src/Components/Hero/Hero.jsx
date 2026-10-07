import Button from '../Button/Button.jsx'
import styles from './Hero.module.css'

function Hero({ heroImage, heroTitle, heroText, buttonText, buttonLink }) {
    return (
        <div className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
            <div className={styles.box}>
                <h1>{heroTitle}</h1>
                <p>{heroText}</p>
                <div className={styles.action}>
                    <Button to={buttonLink}>{buttonText}</Button>
                </div>
            </div>
        </div>
    );
}

export default Hero
