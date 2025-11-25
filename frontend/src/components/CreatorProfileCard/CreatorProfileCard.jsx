import React from "react";
import PropTypes from "prop-types";
import styles from "./CreatorProfileCard.module.scss";

export default function CreatorProfileCard({name, pictureSrc}) {
    return (
        <div className={styles.creatorProfile}>
            <h2 className={styles.name}>{name}</h2>
            <img className={styles.picture} src={pictureSrc} width="400px" height="400px" alt={`${name} profile`} />
        </div>
    );
}
CreatorProfileCard.propTypes = {
    name: PropTypes.string.isRequired,
    pictureSrc: PropTypes.string.isRequired,
};