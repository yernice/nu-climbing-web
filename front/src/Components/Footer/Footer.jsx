import styles from './Footer.module.css'

const contacts = [
    { label: "Email", text: "nu_climbing@nu.edu.kz", href: "mailto:nu_climbing@nu.edu.kz" },
    { label: "Telegram", text: "t.me/nuhikingcampingclimbing", href: "https://t.me/nuhikingcampingclimbing" },
    { label: "Instagram", text: "@nu_climbing", href: "https://www.instagram.com/nu_climbing" },
]

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`page ${styles.inner}`}>
                <p className={styles.name}>NU Climbing Club</p>
                <ul className={styles.contacts}>
                    {contacts.map(contact => (
                        <li key={contact.label}>
                            <span className={styles.label}>{contact.label}</span>
                            <a
                                href={contact.href}
                                {...(contact.href.startsWith('http') && { target: "_blank", rel: "noopener noreferrer" })}
                            >
                                {contact.text}
                            </a>
                        </li>
                    ))}
                </ul>
                <p className={styles.credit}>Fonts: Tanker and Bespoke Serif by Indian Type Foundry</p>
            </div>
        </footer>
    );
}

export default Footer
