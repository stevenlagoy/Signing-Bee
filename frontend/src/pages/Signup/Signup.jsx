import styles from './Signup.module.scss';
import {useState} from 'react';
import {useSignup} from '../../hooks/useSignup.jsx'

const signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(email, password)
  }

  return (
    <div className={styles.container}>
        <form className = {styles.signup} onSubmit={handleSubmit}>
          <h3 className={styles.title}>Sign up</h3>

          <label className={styles.labels}>Email:   </label>
          <input 
            className={styles.inputs}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
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

        </form>
    </div>
  )
  
}

export default signup;