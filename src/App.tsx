import { useState } from "react";
import "./App.css";
import Test from "./Test";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <Test />
            <p>Open console for debug info</p>
        </>
    );
}

export default App;
