import styles from './About.module.css'

// Placeholder copy: replace with the club's own text.
const sections = [
    {
        title: "Who are we",
        text: [
            
        ],
    },
    {
        title: "What do we do",
        text: [

        ],
    },
    {
        title: "Our goals",
        text: [

        ],
    },
]

function About() {
    return (
        <main className="page">
            <h1>About Us</h1>
            {sections.map(section => (
                <section key={section.title} className={styles.section}>
                    <h2>{section.title}</h2>
                    {section.text.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </section>
            ))}
        </main>
    );
}

export default About
