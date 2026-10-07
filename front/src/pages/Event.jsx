import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../Components/Button/Button.jsx'
import { getEvent } from '../api/events.js'
import { formatEventTime, formatSlots, getRegistrationState, registrationLabels } from '../utils/events.js'
import postStyles from './Post.module.css'
import styles from './Event.module.css'

function Event() {
    const { id } = useParams()
    const [loaded, setLoaded] = useState({ id: null, event: null })

    useEffect(() => {
        let ignore = false
        getEvent(id).then(event => {
            if (!ignore) setLoaded({ id, event })
        })
        return () => { ignore = true }
    }, [id])

    if (loaded.id !== id) return <main className="page" />

    const event = loaded.event

    if (!event) {
        return (
            <main className="page">
                <Link to="/projects" className={postStyles.back}>← Back to events</Link>
                <h1>Event not found</h1>
            </main>
        )
    }

    const state = getRegistrationState(event)

    return (
        <main className="page">
            <Link to="/projects" className={postStyles.back}>← Back to events</Link>
            <h1>{event.title}</h1>
            <img src={event.image} alt={event.title} className={postStyles.image} />
            <dl className={styles.details}>
                <div>
                    <dt>Time</dt>
                    <dd>{formatEventTime(event)}</dd>
                </div>
                <div>
                    <dt>Place</dt>
                    <dd>{event.place}</dd>
                </div>
                <div>
                    <dt>Slots</dt>
                    <dd>{formatSlots(event)}</dd>
                </div>
            </dl>
            <div className={postStyles.text}>
                {event.text.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
            </div>
            <div className={styles.action}>
                <Button to={`/events/${event.id}/register`} disabled={state !== 'open'}>
                    {registrationLabels[state]}
                </Button>
            </div>
        </main>
    );
}

export default Event
