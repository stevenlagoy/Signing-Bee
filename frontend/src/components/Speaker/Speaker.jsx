import signingBeeRound from "../../services/signingBeeRound";

export default function Speaker() {
    const handleRepeatWord = async () => {
        await signingBeeRound.speakCurrentWord();
    };

    return (
        <button onClick={handleRepeatWord}>
            Repeat Word
        </button>
    );
}
