import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import ThemeToggle from "../ThemeToggle";
import LoginDropDown from "../../components/Dropdown/LoginDropDown";
import { useLogout } from '../../hooks/useLogout.jsx'
import { useAuthContext } from '../../hooks/useAuthContext.jsx'

export default function Header() {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

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
        <Link to="/play" className="playLink">
          Play
        </Link>
        <Link to="/about" className="aboutLink">
          About
        </Link>
      </nav>

      <ThemeToggle />
      <LoginDropDown trigger="Profile">
        <Link to="/profile" className={styles.profileMenu}>
          <div className={styles.userProfile}>
            <h2 className={styles.userName}>User Name</h2>

          </div>
        </Link>
        {!user && (
          <div>
            <Link to="/login">Log In</Link>
            <div></div>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}

        {user && (
          <div>
            <span>{user.email}</span>
            <p onClick={handleClick}>Log Out</p>
          </div>
        )}

      </LoginDropDown>
    </header>
  );
}