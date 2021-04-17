import React, {useEffect} from 'react';

const Home = () => {
    useEffect(() => {
        document.body.childNodes.forEach(child => {
            if (child.constructor.name === "HTMLCanvasElement") {
                document.body.removeChild(child);
            }
        });
    }, []);
    return <div>Home</div>
}

export default Home;
