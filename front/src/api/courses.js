import courses from '../assets/courses.js'

// Mock data layer. When the backend is ready, replace the bodies with fetch calls.
export async function getCourses() {
    return courses
}

// Courses have no real timestamp yet, so the highest id counts as the latest.
export async function getLatestCourses(count) {
    return [...courses].sort((a, b) => b.id - a.id).slice(0, count)
}

export async function getCourse(id) {
    return courses.find(course => course.id === Number(id)) ?? null
}
