import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Card from '../Components/Card/Card.jsx'
import { getEvents } from '../api/events.js'
import { getProjects } from '../api/projects.js'
import { makeIntro } from '../utils/excerpt.js'
import { formatEventTime, formatSlots, getRegistrationState, registrationLabels } from '../utils/events.js'
import styles from './Projects.module.css'

function Projects() {
    const [searchParams, setSearchParams] = useSearchParams()
    const tab = searchParams.get('tab') === 'projects' ? 'projects' : 'events'
    const [events, setEvents] = useState([])
    const [projects, setProjects] = useState([])

    useEffect(() => {
        getEvents().then(setEvents)
        getProjects().then(setProjects)
    }, [])

    // The tab lives in the URL so Back from a detail page returns to the same tab.
    function selectTab(name) {
        setSearchParams(name === 'events' ? {} : { tab: name }, { replace: true })
    }

    return (
        <main className="page">
            <h1>Our Projects and Events</h1>
            <div className={styles.tabs}>
                <button
                    className={styles.tab}
                    aria-pressed={tab === 'events'}
                    onClick={() => selectTab('events')}
                >
                    Events
                </button>
                <button
                    className={styles.tab}
                    aria-pressed={tab === 'projects'}
                    onClick={() => selectTab('projects')}
                >
                    Projects
                </button>
            </div>
            <div className="card-grid">
                {tab === 'events' && events.map(event => {
                    const state = getRegistrationState(event)
                    return (
                        <Card
                            key={event.id}
                            to={`/events/${event.id}/register`}
                            cardTitle={event.title}
                            cardImage={event.image}
                            cardText={makeIntro(event.text)}
                            details={[
                                { label: "Time", value: formatEventTime(event) },
                                { label: "Slots", value: formatSlots(event) },
                            ]}
                            buttonText={registrationLabels[state]}
                            buttonDisabled={state !== 'open'}
                        />
                    )
                })}
                {tab === 'projects' && projects.map(project => (
                    <Card
                        key={project.id}
                        to={`/projects/${project.id}`}
                        cardTitle={project.title}
                        cardImage={project.image}
                        cardText={makeIntro(project.text)}
                    />
                ))}
            </div>
        </main>
    );
}

export default Projects
