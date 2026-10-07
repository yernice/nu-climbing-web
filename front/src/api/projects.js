import projects from '../assets/projects.js'

// Mock data layer. When the backend is ready, replace the bodies with fetch calls.
export async function getProjects() {
    return projects
}

// Projects have no real timestamp yet, so the highest id counts as the latest.
export async function getLatestProject() {
    return projects.reduce((latest, project) => (!latest || project.id > latest.id ? project : latest), null)
}

export async function getProject(id) {
    return projects.find(project => project.id === Number(id)) ?? null
}
