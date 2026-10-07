import styles from './Feature.module.css'

// A white content box (60%) next to an image (40%); children are the buttons.
function Feature({ title, image, details, text, imageSide = 'right', children }) {
    const className = imageSide === 'left' ? `${styles.feature} ${styles.imageLeft}` : styles.feature

    return (
        <div className={className}>
            <div className={styles.box}>
                <h2>{title}</h2>
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
                <p className={styles.text}>{text}</p>
                <div className={styles.actions}>{children}</div>
            </div>
            <img src={image} alt={title} className={styles.image} />
        </div>
    );
}

export default Feature
