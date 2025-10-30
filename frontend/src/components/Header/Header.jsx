import { Link } from "react-router-dom";
// These should be put inside of src/assets or ideally public/
import { ReactComponent as Logo } from "./signing-bee-logo.svg";
import { ReactComponent as MenuIcon } from "./3-dot-menu.svg";
import { ReactComponent as DefaultPFP } from "./default-pfp.svg"
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <Logo alt="Signing Bee Logo" width="50" height="50" />
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

      <Link to="/profile" className={styles.profileMenu}>
        <div className={styles.userProfile}>
          <h2 className="user-name">User Name</h2>
          <DefaultPFP alt="Default user profile picture" width="50" height="50" viewBox="0 0 340 340" />
        </div>
      </Link>
    </header>
  );
}