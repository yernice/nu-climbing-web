import styles from './Navigation.module.css'

function Navigation({ posts }) {

    return (
        <nav className={styles.navbar}>
            <ul>
                {posts.map(post => (
                    <li>
                        <a href={`#post-${post.id}`}>{post.title}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navigation