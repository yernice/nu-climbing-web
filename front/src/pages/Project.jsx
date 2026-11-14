import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProject } from '../api/projects.js'
import styles from './Post.module.css'

function Project() {
    const { id } = useParams()
    const [loaded, setLoaded] = useState({ id: null, project: null })

    useEffect(() => {
        let ignore = false
        getProject(id).then(project => {
            if (!ignore) setLoaded({ id, project })
        })
        return () => { ignore = true }
    }, [id])

    if (loaded.id !== id) return <main className="page" />

    const project = loaded.project

    if (!project) {
        return (
            <main className="page">
                <Link to="/projects?tab=projects" className={styles.back}>← Back to projects</Link>
                <h1>Project not found</h1>
            </main>
        )
    }

    return (
        <main className="page">
            <Link to="/projects?tab=projects" className={styles.back}>← Back to projects</Link>
            <h1>{project.title}</h1>
            <img src={project.image} alt={project.title} className={styles.image} />
            {/* Formatted text from the admin editor; the backend builds this HTML and escapes it. */}
            <div className={styles.text} dangerouslySetInnerHTML={{ __html: project.html }} />
        </main>
    );
}

export default Project
