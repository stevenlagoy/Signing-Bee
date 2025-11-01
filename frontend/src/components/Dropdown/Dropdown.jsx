import { useState } from "react";
import styles from "./Dropdown.module.scss";
import chevron from "../../assets/chevron-down.svg";

export default function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.divContainer}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen(!open)}
      >
        <span>{trigger}</span>
        <img src={chevron} alt="" className={styles.chevron} />
      </button>

      {open && <div className={styles.menu}>{children}</div>}
    </div>
  );
}