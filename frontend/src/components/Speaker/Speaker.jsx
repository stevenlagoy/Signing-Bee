import styles from "./speaker.module.scss";

export default function Speaker({muted, setMuted}) {

    function handleToggle() {
        setMuted(!muted);
    }

    let buttonClass = styles.muteBtn;
    if (muted) {
        buttonClass = buttonClass + " " + styles.muted;
    }

    let imgSrc;
    let imgAlt;

    if (muted) {
        imgSrc = "/speaker-off.svg";
        imgAlt = "Unmute audio";
    } else {
        imgSrc = "/speaker-on.svg";
        imgAlt = "Mute audio";
    }

    return (
        <button className={buttonClass} onClick={handleToggle}>
            <img src={imgSrc} alt={imgAlt} />
        </button>
    );
}