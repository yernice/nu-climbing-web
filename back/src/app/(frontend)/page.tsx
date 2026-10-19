import { redirect } from 'next/navigation'

// The public site is the React app in front/; this server is the admin panel and the API.
export default function HomePage() {
  redirect('/admin')
}
