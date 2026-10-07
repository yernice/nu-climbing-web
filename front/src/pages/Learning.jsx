import { useEffect, useState } from 'react'
import LearningCard from '../Components/LearningCard/LearningCard.jsx'
import { getCourses } from '../api/courses.js'

function Learning() {
    const [courses, setCourses] = useState([])

    useEffect(() => {
        getCourses().then(setCourses)
    }, [])

    return (
        <main className="page">
            <h1>Learning Material</h1>
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
        </main>
    );
}

export default Learning
