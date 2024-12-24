import "../app/styles/headline.css";

export function Headline() {
    return (
       <div id="screen" className="headline-container">
            <div className="crt-effect"></div>
            <div className="headline-content">
                <h1 className="headline text-6xl md:text-8xl">喜歡電影的人都有網</h1>
                <h3 className="headline text-4xl md:text-7xl">Movie Psycopath</h3>
            </div>
        </div>
    );
}