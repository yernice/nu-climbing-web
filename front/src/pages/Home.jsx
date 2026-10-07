import Hero from '../Components/Hero/Hero.jsx'
import defaultImage from '../assets/default_image.jpg'

function Home() {
    return (
        <>
            <Hero
                heroImage={defaultImage}
                heroTitle="Welcome to Our Club"
                heroText="We're a community of climbers. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                buttonText="Learn More"
                buttonLink="/about"
            />
        </>
    );
}

export default Home

