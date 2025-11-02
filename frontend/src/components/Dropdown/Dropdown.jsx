import { useState } from "react";
import styles from "./Dropdown.module.scss";

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
        <img src="/chevron-down.svg" alt="" className={styles.chevron} />
      </button>

      {open && <div className={styles.menu}>{children}</div>}
    </div>
  );
}