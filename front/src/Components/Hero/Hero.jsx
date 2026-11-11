import Button from '../Button/Button.jsx'
import styles from './Hero.module.css'

// The photo is its own element (not the hero's background) so that on phones the box can sit
// below it and overlap only its bottom edge.
function Hero({ heroImage, heroTitle, heroText, buttonText, buttonLink }) {
    return (
        <div className={styles.hero}>
            <div className={styles.photo} style={{ backgroundImage: `url(${heroImage})` }} />
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
