import styles from './Signup.module.scss';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useSignup} from '../../hooks/useSignup.jsx'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(username, password)
  }

  return (
    <div className={styles.container}>
        <form className = {styles.signup} onSubmit={handleSubmit}>
          <h3 className={styles.title}>Sign up</h3>

          <label className={styles.labels}>Username:   </label>
          <input 
            className={styles.inputs}
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />

          <br/>

          <label className={styles.labels}>Password:    </label>
          <input 
            className={styles.inputs}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <br/><br/>

          <button disabled={isLoading} className={styles.buttons}>Sign up</button>
          {error && <div className ="error">{error}</div>}

          <p className={styles.switchText}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
    </div>
  )

}

export default Signup;