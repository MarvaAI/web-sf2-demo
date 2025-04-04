import { useEffect, useState } from "react";
import { loadSoundfont, startPresetNote } from "sfumato";

import SF2_HINDUSTANI_PATH from "./assets/harmonium.sf2";

const Test = () => {
    const [ctx] = useState(new AudioContext());
    const [westernSf2] = useState(null);
    const [hindustaniSf2, setHindustaniSf2] = useState(null);

    useEffect(() => {
        const loadSF2 = async (path) => {
            const sf2 = await loadSoundfont(path);
            console.log("SoundFont loaded:", sf2);
            return sf2;
        };

        const setup = async () => {
            const hindustani = await loadSF2(SF2_HINDUSTANI_PATH);
            setHindustaniSf2(hindustani);
        };

        setup();
    }, []);

    const playNotes = async (sf2) => {
        if (!sf2) {
            console.error("SoundFont not loaded yet!");
            return;
        }
        const basicArohaAndAvaroha = [
            60, 61, 64, 66, 67, 68, 71, 72, 72, 71, 68, 67, 66, 64, 61, 60,
        ]; // C4 to C5 and back to C4

        try {
            for (let i = 0; i < basicArohaAndAvaroha.length; i++) {
                const stopHandle = startPresetNote(
                    ctx,
                    sf2.presets[0],
                    basicArohaAndAvaroha[i]
                );
                console.log("Playing note:", basicArohaAndAvaroha[i]);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                stopHandle(); 
            }
        } catch (error) {
            console.error("Error playing notes:", error);
        }
    };

    return (
        <div>
            <button onClick={() => playNotes(westernSf2)}>
                Play Western Notes
            </button>
            <button onClick={() => playNotes(hindustaniSf2)}>
                Play Hindustani Notes
            </button>
        </div>
    );
};

export default Test;
