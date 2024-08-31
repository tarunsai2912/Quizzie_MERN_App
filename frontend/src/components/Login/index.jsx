import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { Userlogin } from '../../apis/user'
import './index.css'
import ClipLoader from "react-spinners/ClipLoader";

function Login() {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({...formData,
        [e.target.name]: e.target.value
    })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
        newErrors.email = 'Invalid Email'
    } 
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid Email'
    }
    if (formData.password.length < 2) {
      newErrors.password = 'Invalid password'
    }
    return newErrors;
  }

  const setTokenWithExpiry = (token, expiryInMinutes) => {
    const now = new Date()
    const expiryTime = now.getTime() + expiryInMinutes * 60 * 1000
    const tokenData = {
        token,
        expiry: expiryTime,
    }
    localStorage.setItem('authToken', JSON.stringify(tokenData));
  }

  const setUserWithExpiry = (userId, expiryInMinutes) => {
    const now = new Date()
    const expiryTime = now.getTime() + expiryInMinutes * 60 * 1000
    const userData = {
        userId,
        expiry: expiryTime,
    }
    localStorage.setItem('userId', JSON.stringify(userData));
  }

  const handleSubmit = async () => {
    const formErrors = validate();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        if(errors.email){
          setFormData({...formData,
            email: ''
          })
        }
        if(errors.password){
          setFormData({...formData,
            password: ''
          })
        }
        return;
      }
    
    setLoading(true)
    const response = await Userlogin({...formData})
      
    if (response) {
      setTokenWithExpiry(response.token, 60)
      setUserWithExpiry(response.user_Id, 60)
      setLoading(false)
      navigate('/home')
    }
    else{
      alert('Login Failed')
      setFormData({
        email: '',
        password: ''
      })
      setLoading(false)
    }
  }

  return (
    <>
    {!loading ? <div className='log-container'>
      <div className='email-div-log'>
        <p className='email-para-log'>Email</p>
        <input type='email' name='email' value={formData.email} className='email-input-log' onChange={handleChange}></input>
      </div>
      <div className='pass-div-log'>
        <p className='pass-para-log'>Password</p>
        <input type='password' name='password' value={formData.password} className='pass-input-log' onChange={handleChange}></input>
      </div>
      <button onClick={handleSubmit} className='login-btn-log'>Log In</button>
    </div> : <div style={{position: 'relative', left:'40vw'}}><ClipLoader color={"#36D7B7"} loading={loading} size={100} /></div>}
    </>
  )
}

export default Login
