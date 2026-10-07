import { Link } from 'react-router-dom'
import styles from './Button.module.css'

// `type` renders a real <button> (forms); `to` renders a link; a disabled
// button with `to` renders a plain non-clickable span. `small` is for cards,
// `outline` is the white secondary style.
function Button({ to, type, disabled = false, small = false, outline = false, children }) {
    const base = [styles.button, small && styles.small, outline && styles.outline]
        .filter(Boolean)
        .join(' ')

    if (type) {
        return (
            <button type={type} disabled={disabled} className={base}>
                {children}
            </button>
        );
    }

    if (disabled || !to) {
        return (
            <span className={`${base} ${styles.disabled}`} aria-disabled="true">
                {children}
            </span>
        );
    }

    return <Link to={to} className={base}>{children}</Link>;
}

export default Button
