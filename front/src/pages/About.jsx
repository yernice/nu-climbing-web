import { useEffect, useState } from 'react'
import { getAbout } from '../api/about.js'
import styles from './About.module.css'

function About() {
    // undefined while loading, null if the backend could not be reached
    const [about, setAbout] = useState(undefined)

    useEffect(() => {
        getAbout().then(setAbout)
    }, [])

    if (about === undefined) return <main className="page" />

    if (!about) {
        return (
            <main className="page">
                <h1>About Us</h1>
            </main>
        )
    }

    const { instagram, telegram, email } = about.links
    const hasLinks = instagram || telegram || email

    return (
        <main className="page">
            <h1>{about.title}</h1>

            {about.image && <img src={about.image} alt={about.title} className={styles.image} />}

            {about.text.length > 0 && (
                <div className={styles.text}>
                    {about.text.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>
            )}

            {about.schedule.length > 0 && (
                <section>
                    <h2 className={styles.heading}>Training schedule</h2>
                    <dl className={styles.schedule}>
                        {about.schedule.map(item => (
                            <div key={item.id}>
                                <dt>{item.day}</dt>
                                <dd>{item.place ? `${item.time}, ${item.place}` : item.time}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            {about.team.length > 0 && (
                <section>
                    <h2 className={styles.heading}>Our team</h2>
                    <ul className={styles.team}>
                        {about.team.map(person => (
                            <li key={person.id}>
                                {person.photo && <img src={person.photo} alt={person.name} />}
                                <span className={styles.name}>{person.name}</span>
                                {person.role && <span className={styles.role}>{person.role}</span>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {hasLinks && (
                <section>
                    <h2 className={styles.heading}>Contact us</h2>
                    <ul className={styles.links}>
                        {instagram && <li><a href={instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
                        {telegram && <li><a href={telegram} target="_blank" rel="noopener noreferrer">Telegram</a></li>}
                        {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
                    </ul>
                </section>
            )}
        </main>
    );
}

export default About
