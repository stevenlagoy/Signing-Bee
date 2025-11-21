import styles from './Login.module.scss';
import {useState} from 'react';
import {useLogin} from '../../hooks/useLogin.jsx'

const login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login, error, isLoading} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email, password)
  }

  return (
    <div className={styles.container}>
        <form className = {styles.login} onSubmit={handleSubmit}>
          <h3 className={styles.title}>Log in</h3>

          <label className={styles.labels}>Email:   </label>
          <input 
            className={styles.inputs}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
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
          {error && <div classname="error">{error}</div>}

        </form>
    </div>
  )
  
}

export default login;