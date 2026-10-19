// Example content so the site is not empty while you try it.
//   npm run seed     adds the examples (skips any that already exist)
//   npm run unseed   removes exactly these examples (by title) and their images
// Everything else you create in the admin panel is never touched.
import config from '@payload-config'
import path from 'path'
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const image = (n: number) => path.join(dirname, 'images', `placeholder-${n}.jpg`)
const EXAMPLE_ALT = 'Example image (npm run unseed removes it)'

const daysFromNow = (days: number, hour = 18, minute = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

const posts = [
  {
    title: 'Welcome to the new NU Climbing website',
    publishedAt: daysFromNow(-2),
    img: 1,
    body: 'This is an example post. The club website now has a blog, a list of events with online registration, our projects and learning materials for new climbers.\n\nEverything you see here is managed in the admin panel, so club news can go online in a few minutes.',
  },
  {
    title: 'How our first outdoor trip went',
    publishedAt: daysFromNow(-10),
    img: 2,
    body: 'An example report from a weekend trip. Twelve members spent two days on real rock, most of them for the first time.\n\nWe practised belaying, cleaned routes together and learned how weather changes everything outdoors.',
  },
  {
    title: 'Five tips for your first bouldering session',
    publishedAt: daysFromNow(-20),
    img: 3,
    body: 'Warm up properly, watch others before you try a problem, and climb with your legs more than your arms.\n\nFall on purpose from low heights so you trust the mats, and rest between attempts. This post is an example.',
  },
  {
    title: 'Gear check: what to bring to training',
    publishedAt: daysFromNow(-30),
    img: 4,
    body: 'Comfortable clothes, climbing shoes if you have them and a bottle of water. The club lends shoes and chalk to beginners.\n\nThis example post shows how longer texts are split into paragraphs.',
  },
]

const projects = [
  {
    title: 'New route setting on the campus wall',
    img: 5,
    body: 'An example project: members design and set new routes on the university wall every month, from easy warm-ups to hard problems.\n\nAnyone can join the setting team after a short safety briefing.',
  },
  {
    title: 'Climbing for everyone: beginner nights',
    img: 1,
    body: 'An example project: weekly evenings where experienced members teach newcomers the basics, from knots to falling safely.\n\nNo experience or equipment needed.',
  },
]

const events = [
  {
    title: 'Bouldering evening',
    startAt: daysFromNow(7, 18, 30),
    place: 'NU Sports Center, climbing wall',
    capacity: 15,
    img: 3,
    body: 'An example event. A relaxed evening of bouldering for all levels with new problems set for the night.\n\nShoes and chalk are available for beginners. Register on the site to save your place.',
  },
  {
    title: 'Weekend outdoor trip',
    startAt: daysFromNow(21, 8, 0),
    place: 'Meeting point: NU main entrance',
    capacity: 12,
    img: 2,
    body: 'An example event. A two-day trip to climb outside with experienced members leading every group.\n\nTransport is organised by the club; places are limited.',
  },
  {
    title: 'Season opening meetup',
    startAt: daysFromNow(-14, 19, 0),
    place: 'NU Sports Center',
    capacity: 40,
    img: 4,
    body: 'An example of a past event: registration is closed and the site shows it as PAST.\n\nWe met new members and planned the season.',
  },
]

const courses = [
  {
    title: 'Climbing basics',
    description: 'An example course: safety at the wall, the figure-eight knot and how belaying works.',
    img: 5,
    materials: [
      { type: 'reading', title: 'The figure-eight loop knot', url: 'https://en.wikipedia.org/wiki/Figure-eight_loop' },
      { type: 'reading', title: 'What belaying is', url: 'https://en.wikipedia.org/wiki/Belaying' },
      { type: 'video', title: 'Videos: tying in with a figure eight', url: 'https://www.youtube.com/results?search_query=figure+eight+knot+climbing' },
    ],
  },
  {
    title: 'Bouldering technique',
    description: 'An example course: reading problems, footwork and understanding grades.',
    img: 3,
    materials: [
      { type: 'reading', title: 'Bouldering explained', url: 'https://en.wikipedia.org/wiki/Bouldering' },
      { type: 'reading', title: 'Climbing grades', url: 'https://en.wikipedia.org/wiki/Grade_(climbing)' },
      { type: 'video', title: 'Videos: footwork drills', url: 'https://www.youtube.com/results?search_query=climbing+footwork+drills' },
      { type: 'video', title: 'Videos: how to read a boulder problem', url: 'https://www.youtube.com/results?search_query=how+to+read+a+boulder+problem' },
    ],
  },
] as const

const payload = await getPayload({ config })
const remove = process.argv.includes('remove')

const titled = (collection: 'posts' | 'projects' | 'events' | 'courses', title: string) =>
  payload.find({ collection, where: { title: { equals: title } }, limit: 1, depth: 0 }).then((r) => r.docs[0])

if (remove) {
  for (const [collection, items] of [
    ['posts', posts],
    ['projects', projects],
    ['events', events],
    ['courses', courses],
  ] as const) {
    for (const item of items) {
      const doc = await titled(collection, item.title)
      if (doc) await payload.delete({ collection, id: doc.id })
    }
  }
  await payload.delete({ collection: 'media', where: { alt: { equals: EXAMPLE_ALT } } })
  payload.logger.info('Example content removed.')
} else {
  const images = new Map<number, number>()
  const upload = async (n: number) => {
    if (!images.has(n)) {
      const media = await payload.create({ collection: 'media', data: { alt: EXAMPLE_ALT }, filePath: image(n) })
      images.set(n, media.id)
    }
    return images.get(n)!
  }

  let added = 0
  // Oldest first: the site treats the highest id as the newest post (front/src/api/posts.js).
  const oldestFirst = [...posts].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))
  for (const { img, ...post } of oldestFirst) {
    if (await titled('posts', post.title)) continue
    await payload.create({ collection: 'posts', data: { ...post, image: await upload(img) } })
    added++
  }
  for (const { img, ...project } of projects) {
    if (await titled('projects', project.title)) continue
    await payload.create({ collection: 'projects', data: { ...project, image: await upload(img) } })
    added++
  }
  for (const { img, ...event } of events) {
    if (await titled('events', event.title)) continue
    await payload.create({ collection: 'events', data: { ...event, image: await upload(img) } })
    added++
  }
  for (const { img, materials, ...course } of courses) {
    if (await titled('courses', course.title)) continue
    await payload.create({
      collection: 'courses',
      data: { ...course, materials: materials.map((m) => ({ ...m })), image: await upload(img) },
    })
    added++
  }
  payload.logger.info(`Example content added: ${added} items.`)
}

process.exit(0)
