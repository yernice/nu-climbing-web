import { useEffect, useState } from 'react'
import { getAbout } from '../api/about.js'
import styles from './About.module.css'

const initials = name => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('')

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
        <main>
            <section className={`page ${about.image ? styles.introWithImage : ''}`}>
                <div>
                    <h1>{about.title}</h1>
                    {about.text.length > 0 && (
                        <div className={styles.text}>
                            {about.text.map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                    )}
                </div>
                {about.image && <img src={about.image} alt={about.title} className={styles.image} />}
            </section>

            {about.facts.length > 0 && (
                <section className="page">
                    <dl className={styles.facts}>
                        {about.facts.map(fact => (
                            <div key={fact.id}>
                                <dt>{fact.value}</dt>
                                <dd>{fact.label}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            {about.motto && (
                <section className={styles.band}>
                    <p className={`page ${styles.motto}`}>{about.motto}</p>
                </section>
            )}

            <div className="page">
                {about.activities.length > 0 && (
                    <section>
                        <h2 className={styles.heading}>What we do</h2>
                        <div className={styles.activities}>
                            {about.activities.map((activity, i) => (
                                <article key={activity.id} className={styles.activity}>
                                    <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                                    <h3>{activity.title}</h3>
                                    <p>{activity.text}</p>
                                </article>
                            ))}
                        </div>
                    </section>
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
                                    {person.photo
                                        ? <img src={person.photo} alt={person.name} />
                                        : <span className={styles.initials} aria-hidden="true">{initials(person.name)}</span>}
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
            </div>
        </main>
    );
}

export default About
