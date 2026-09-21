
function Card({ cardImage, cardTitle="Blog Title", cardIntro="Blog Intro"}) {
    return (
        <div>
            <img src={cardImage} alt="Blog Post Image"></img>
            <h1>{cardTitle}</h1>
            <p>{cardIntro}</p>
        </div>
    );
}   

export default Card 