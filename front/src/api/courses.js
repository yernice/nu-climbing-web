import courses from '../assets/courses.js'

// Mock data layer. When the backend is ready, replace the bodies with fetch calls.
export async function getCourses() {
    return courses
}

export async function getCourse(id) {
    return courses.find(course => course.id === Number(id)) ?? null
}
