import { Link } from 'react-router-dom'

function Header() {

    return (
        <header>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/learning">Learning</Link>
                <Link to="/about">About us</Link>
            </nav>
        </header>
    )
}

export default Header