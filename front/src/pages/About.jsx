import styles from './About.module.css'

// Placeholder copy: replace with the club's own text.
const sections = [
    {
        title: "Who are we",
        text: [
            "NU Climbing Club is the rock climbing community of Nazarbayev University, Astana. " +
            "We are a group of students who share a passion for climbing, and we want to share it " +
            "with everyone around us.",
            "The club was officially founded in February 2024, but began its actual functioning in August 2025, " +
            "when we first found our mentor, Jeremy Spring, and conducted member recruitment. It started as a small " +
            "group of friends who shared a love for climbing. Since then, it has grown into a big, " +
            "close-knit community of around 40 members.",
            "Our training sessions are led by our coach, Andrey, a qualified climbing professional who " +
            "helps every member grow from the very basics. Beyond training, Andrey takes an active part " +
            "in organizing our events and is always ready to share his expertise and advice on everything " +
            "related to the sport.",
            "But we’re not just about our own progress. We regularly organize events for students who want " +
            "to give climbing a try.",
            "Our main goal is to popularize rock climbing as a sport. We believe climbing is for everyone!",
        ],
    },
    {
        title: "What do we do",
        text: [
            "Open Training Sessions",
            "Every two weeks we host open training sessions for all Nazarbayev University students. " +
            "They’re a chance for anyone to try climbing for the first time, with no experience or " +
            "equipment needed.",
            "Competitions",
            "Our members compete in climbing competitions in two disciplines: lead climbing and bouldering. " +
            "We train hard, push our limits and represent NU on the wall.",
            "Outdoor Trips",
            "Within the club we organize trips to real rock, where members can take their skills outdoors and explore climbing in nature.",
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
