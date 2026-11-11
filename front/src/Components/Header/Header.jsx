import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import logo from '../../assets/club_logo.jpg'

const links = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Blog" },
    { to: "/projects", label: "Projects" },
    { to: "/learning", label: "Learning" },
    { to: "/about", label: "About us" },
]

// Desktop: one centred row of links. Phone (<= 720px, see the css): logo + menu button,
// and the links open as a list under the bar when the button is tapped.
function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = () => setMenuOpen(false)

    return (
        <header className={styles.header}>
            <div className={styles.bar}>
                <Link to="/" className={styles.logo} onClick={closeMenu}>
                    <img src={logo} alt="NU Climbing Club" />
                </Link>
                <button
                    type="button"
                    className={styles.menuButton}
                    aria-expanded={menuOpen}
                    aria-controls="main-menu"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        {menuOpen
                            ? <path d="M6 6l12 12M18 6L6 18" />
                            : <path d="M3 6h18M3 12h18M3 18h18" />}
                    </svg>
                </button>
            </div>
            <nav className={styles.navbar}>
                <ul id="main-menu" className={menuOpen ? styles.open : undefined}>
                    {links.map(link => (
                        <li key={link.to}>
                            <Link to={link.to} onClick={closeMenu}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}

export default Header
