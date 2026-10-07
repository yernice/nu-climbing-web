import projects from '../assets/projects.js'

// Mock data layer. When the backend is ready, replace the bodies with fetch calls.
export async function getProjects() {
    return projects
}

export async function getProject(id) {
    return projects.find(project => project.id === Number(id)) ?? null
}
