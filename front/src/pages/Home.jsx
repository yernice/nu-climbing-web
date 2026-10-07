import { useEffect, useState } from 'react'
import Hero from '../Components/Hero/Hero.jsx'
import Feature from '../Components/Feature/Feature.jsx'
import Button from '../Components/Button/Button.jsx'
import Card from '../Components/Card/Card.jsx'
import LearningCard from '../Components/LearningCard/LearningCard.jsx'
import defaultImage from '../assets/default_image.jpg'
import { getNextEvent } from '../api/events.js'
import { getLatestProject } from '../api/projects.js'
import { getLatestPosts } from '../api/posts.js'
import { getLatestCourses } from '../api/courses.js'
import { firstSentences, makeIntro } from '../utils/excerpt.js'
import {
    formatEventClock,
    formatEventDate,
    formatSlots,
    getRegistrationState,
    registrationLabels,
} from '../utils/events.js'
import styles from './Home.module.css'

const POST_COUNT = 4
const COURSE_COUNT = 2
const FEATURE_SENTENCES = 5

function Home() {
    // The yellow section shows the upcoming event, or the latest project if there is none.
    const [event, setEvent] = useState(null)
    const [project, setProject] = useState(null)
    const [posts, setPosts] = useState([])
    const [courses, setCourses] = useState([])

    useEffect(() => {
        Promise.all([getNextEvent(), getLatestProject()]).then(([nextEvent, latestProject]) => {
            setEvent(nextEvent)
            setProject(nextEvent ? null : latestProject)
        })
        getLatestPosts(POST_COUNT).then(setPosts)
        getLatestCourses(COURSE_COUNT).then(setCourses)
    }, [])

    const eventState = event && getRegistrationState(event)

    return (
        <>
            <Hero
                heroImage={defaultImage}
                heroTitle="Welcome to Our Club"
                heroText="We're a community of climbers. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                buttonText="Learn More"
                buttonLink="/about"
            />

            {(event || project) && (
                <section className={styles.projects}>
                    <div className={`page ${styles.rows}`}>
                        {event && (
                            <Feature
                                title={event.title}
                                image={event.image}
                                details={[
                                    { label: "Date", value: formatEventDate(event) },
                                    { label: "Time", value: formatEventClock(event) },
                                    { label: "Slots", value: formatSlots(event) },
                                ]}
                                text={firstSentences(event.text, FEATURE_SENTENCES)}
                                imageSide="right"
                            >
                                <Button to={`/events/${event.id}/register`} disabled={eventState !== 'open'}>
                                    {registrationLabels[eventState]}
                                </Button>
                                <Button to="/projects" outline>OTHER EVENTS</Button>
                            </Feature>
                        )}
                        {project && (
                            <Feature
                                title={project.title}
                                image={project.image}
                                text={firstSentences(project.text, FEATURE_SENTENCES)}
                                imageSide="right"
                            >
                                <Button to={`/projects/${project.id}`}>READ MORE</Button>
                                <Button to="/projects?tab=projects" outline>OTHER PROJECTS</Button>
                            </Feature>
                        )}
                    </div>
                </section>
            )}

            <section className="page">
                <h2 className={styles.heading}>Our Blog</h2>
                <div className="card-grid">
                    {posts.map(post => (
                        <Card
                            key={post.id}
                            to={`/blog/${post.id}`}
                            cardTitle={post.title}
                            cardImage={post.image}
                            cardDate={post.card_date}
                            cardText={makeIntro(post.text)}
                        />
                    ))}
                </div>
                <div className={styles.seeAll}>
                    <Button to="/blog">SEE ALL</Button>
                </div>
            </section>

            <section className="page">
                <h2 className={styles.heading}>Learning Material</h2>
                <div className="course-grid">
                    {courses.map(course => (
                        <LearningCard
                            key={course.id}
                            to={`/learning/${course.id}`}
                            image={course.image}
                            title={course.title}
                            description={course.description}
                            materials={course.materials}
                        />
                    ))}
                </div>
                <div className={styles.seeAll}>
                    <Button to="/learning">SEE ALL</Button>
                </div>
            </section>
        </>
    );
}

export default Home
