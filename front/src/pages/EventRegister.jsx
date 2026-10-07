import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../Components/Button/Button.jsx'
import { getEvent, registerForEvent } from '../api/events.js'
import { formatEventTime, getRegistrationState } from '../utils/events.js'
import postStyles from './Post.module.css'
import styles from './EventRegister.module.css'

const emptyForm = { name: "", email: "", phone: "" }

function validate(form) {
    const errors = {}
    if (!form.name.trim()) errors.name = "Enter your name."
    if (!form.email.trim()) errors.email = "Enter your NU email."
    else if (!/^[^\s@]+@nu\.edu\.kz$/i.test(form.email.trim())) errors.email = "Use your @nu.edu.kz email."
    if (!form.phone.trim()) errors.phone = "Enter your phone number."
    else if (!/^\+?[\d\s()-]{7,}$/.test(form.phone.trim())) errors.phone = "Enter a valid phone number."
    return errors
}

function EventRegister() {
    const { id } = useParams()
    const [loaded, setLoaded] = useState({ id: null, event: null })
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [done, setDone] = useState(false)

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

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const found = validate(form)
        setErrors(found)
        if (Object.keys(found).length > 0) return

        setSubmitting(true)
        await registerForEvent(event.id, form)
        setSubmitting(false)
        setDone(true)
    }

    return (
        <main className="page">
            <Link to={`/events/${event.id}`} className={postStyles.back}>← Back to event</Link>
            <h1>Register: {event.title}</h1>
            <p className={styles.time}>{formatEventTime(event)}</p>

            {done && (
                <p className={styles.message} role="status">
                    You're registered for {event.title}. See you there!
                </p>
            )}

            {!done && state === 'past' && (
                <p className={styles.message}>Registration closed: this event has already taken place.</p>
            )}

            {!done && state === 'full' && (
                <p className={styles.message}>This event is full.</p>
            )}

            {!done && state === 'open' && (
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <label>
                        Name
                        <input name="name" value={form.name} onChange={handleChange} aria-invalid={!!errors.name} />
                        {errors.name && <span className={styles.error} role="alert">{errors.name}</span>}
                    </label>
                    <label>
                        NU email
                        <input name="email" type="email" value={form.email} onChange={handleChange} aria-invalid={!!errors.email} />
                        {errors.email && <span className={styles.error} role="alert">{errors.email}</span>}
                    </label>
                    <label>
                        Phone
                        <input name="phone" type="tel" value={form.phone} onChange={handleChange} aria-invalid={!!errors.phone} />
                        {errors.phone && <span className={styles.error} role="alert">{errors.phone}</span>}
                    </label>
                    <div>
                        <Button type="submit" disabled={submitting}>REGISTER</Button>
                    </div>
                </form>
            )}
        </main>
    );
}

export default EventRegister
