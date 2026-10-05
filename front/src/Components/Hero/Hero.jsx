import styles from './Hero.module.css'

function Hero({ heroImage, heroTitle, heroText, buttonText, buttonLink }) {
    return (
        <div className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
            <div className={styles.box}>
                <h1>{heroTitle}</h1>
                <p>{heroText}</p>
                <a href={buttonLink} className={styles.button}>{buttonText}</a>
            </div>
        </div>
    );
}

export default Hero