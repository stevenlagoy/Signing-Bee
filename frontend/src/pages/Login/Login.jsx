import styles from './Login.module.scss';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useLogin} from '../../hooks/useLogin.jsx'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {login, error, isLoading} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(username, password)
  }

  return (
    <div className={styles.container}>
        <form className = {styles.login} onSubmit={handleSubmit}>
          <h3 className={styles.title}>Log in</h3>

          <label className={styles.labels}>Username:   </label>
          <input 
            className={styles.inputs}
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />

          <br/>

          <label className={styles.labels}>Password:  </label>
          <input 
            className={styles.inputs}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <br/><br/>

          <button disabled={isLoading} className={styles.buttons}>Log in</button>
          {error && <div className="error">{error}</div>}

          <p className={styles.switchText}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
    </div>
  )

}

export default Login;