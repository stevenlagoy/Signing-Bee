import signingBeeRound from "../../services/signingBeeRound";
import styles from "./Speaker.module.scss";

export default function Speaker({ muted, setMuted }) {

    // function handleToggle() {
    //     setMuted(!muted);
    // }

    let buttonClass = styles.muteBtn;
    // if (muted) {
    //     buttonClass = buttonClass + " " + styles.muted;
    // }

    // let imgSrc;
    // let imgAlt;

    // if (muted) {
    //     imgSrc = "/speaker-off.svg";
    //     imgAlt = "Unmute audio";
    // } else {
    //     imgSrc = "/speaker-on.svg";
    //     imgAlt = "Mute audio";
    // }

    let imgSrc = "/speaker-on.svg";
    let imgAlt = "Mute audio";
    const handleRepeatWord = async () => {
        await signingBeeRound.speakCurrentWord();
    };

    return (
        <button className={buttonClass} onClick={handleRepeatWord}>
            <img src={imgSrc} alt={imgAlt} />
        </button>
    );

    // return (
    //     <button className={buttonClass} onClick={handleToggle}>
    //         <img src={imgSrc} alt={imgAlt} />
    //     </button>
    // );
}
