import { Link } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {

    return (
        <header>
            <nav className={styles.navbar}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                    <li><Link to="/projects">Projects</Link></li>
                    <li><Link to="/learning">Learning</Link></li>
                    <li><Link to="/about">About us</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header