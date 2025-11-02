import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <img src="/signing-bee-logo.svg" alt="Signing Bee Logo" width="50" height="50" />
        <h1 className={styles.siteName}>Signing Bee</h1>
      </Link>
      <nav className={styles.navLinks}>
        <Link to="/asl-reference" className="aslReferenceLink">
          ASL Reference
        </Link>
        <Link to="/practice" className="practiceLink">
          Practice
        </Link>
        <Link to="/about" className="aboutLink">
          About
        </Link>
      </nav>

    <ThemeToggle />

      <Link to="/profile" className={styles.profileMenu}>
        <div className={styles.userProfile}>
          <h2 className={styles.userName}>User Name</h2>
          <img src="/default-pfp.svg" alt="Default user profile picture" width="50" height="50" viewBox="0 0 340 340" />
        </div>
      </Link>
    </header>
  );
}