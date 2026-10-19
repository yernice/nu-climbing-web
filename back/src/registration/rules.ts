// Registration rules, the same as validate() in front/src/pages/EventRegister.jsx.
// Used by the public endpoint (with the site's messages) and by the admin form.

const NU_EMAIL = /^[^\s@]+@nu\.edu\.kz$/i
const PHONE = /^\+?[\d\s()-]{7,}$/

export type RegistrationInput = { name: string; email: string; phone: string }

export const normalizeEmail = (email: string) => email.trim().toLowerCase()

export function nameError(name: string): string | null {
  if (!name) return 'Enter your name.'
  if (name.length > 200) return 'Name is too long.'
  return null
}

export function emailError(email: string): string | null {
  if (!email) return 'Enter your NU email.'
  if (email.length > 200 || !NU_EMAIL.test(email)) return 'Use your @nu.edu.kz email.'
  return null
}

export function phoneError(phone: string): string | null {
  if (!phone) return 'Enter your phone number.'
  if (phone.length > 30 || !PHONE.test(phone)) return 'Enter a valid phone number.'
  return null
}

/** Trims the fields and checks them. Returns the clean input or field -> message errors. */
export function checkRegistration(
  body: unknown,
): { ok: true; input: RegistrationInput } | { ok: false; errors: Record<string, string> } {
  const value = (key: string) => {
    const raw = (body as Record<string, unknown> | null)?.[key]
    return typeof raw === 'string' ? raw.trim() : ''
  }
  const input = { name: value('name'), email: normalizeEmail(value('email')), phone: value('phone') }
  const errors: Record<string, string> = {}
  const name = nameError(input.name)
  const email = emailError(input.email)
  const phone = phoneError(input.phone)
  if (name) errors.name = name
  if (email) errors.email = email
  if (phone) errors.phone = phone
  return Object.keys(errors).length === 0 ? { ok: true, input } : { ok: false, errors }
}
