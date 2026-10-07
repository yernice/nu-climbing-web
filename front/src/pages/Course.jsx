import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MaterialIcon from '../Components/MaterialIcon/MaterialIcon.jsx'
import { getCourse } from '../api/courses.js'
import styles from './Course.module.css'

function Course() {
    const { id } = useParams()
    const [loaded, setLoaded] = useState({ id: null, course: null })

    useEffect(() => {
        let ignore = false
        getCourse(id).then(course => {
            if (!ignore) setLoaded({ id, course })
        })
        return () => { ignore = true }
    }, [id])

    if (loaded.id !== id) return <main className="page" />

    const course = loaded.course

    if (!course) {
        return (
            <main className="page">
                <Link to="/learning" className={styles.back}>← Back to learning</Link>
                <h1>Course not found</h1>
            </main>
        )
    }

    return (
        <main className="page">
            <Link to="/learning" className={styles.back}>← Back to learning</Link>
            <h1>{course.title}</h1>
            <p className={styles.description}>{course.description}</p>
            <img src={course.image} alt={course.title} className={styles.image} />
            <h2 className={styles.heading}>Materials</h2>
            <ul className={styles.materials}>
                {course.materials.map(material => (
                    <li key={material.id}>
                        <a href={material.url}>
                            <MaterialIcon type={material.type} />
                            <span>{material.title}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default Course
