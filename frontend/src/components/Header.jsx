import React from "react";
import { ReactComponent as Logo } from "../assets/signing-bee-logo.svg";
import { ReactComponent as MenuIcon } from "../assets/3-dot-menu.svg";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/asl-reference" className={styles.aslRef}>
          ASL Reference
        </a>
        <div className={styles.brand}>
          <h1>Signing Bee</h1>
          <Logo alt="Signing Bee Logo" />
        </div>

        <button
          type="button"
          className={styles.dropMenu}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}