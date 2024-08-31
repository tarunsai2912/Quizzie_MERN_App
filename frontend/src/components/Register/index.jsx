import React, {useState} from 'react'
import './index.css'
import ClipLoader from "react-spinners/ClipLoader";
import { Userregister } from '../../apis/user'

function Register({handleLogin}) {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData,
            [e.target.name]: e.target.value
        })
        setErrors({ ...errors, [e.target.name]: '' });
    }

    const validate = () => {
        const newErrors = {};
        
        if (!formData.name) {
            newErrors.name = 'Invalid name'
        }

        if (!formData.email) {
            newErrors.email = 'Invalid Email'
        } 
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid Email'
        }

        if (!formData.password) {
            newErrors.password = 'Weak password'
        } 
        else if (formData.password.length < 6) {
            newErrors.password = 'Weak password'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'password doesn’t match'
        } 
        else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'password doesn’t match'
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            if(errors.name){
                setFormData({...formData,
                    name: ''
                })
            }
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
            if(errors.confirmPassword){
                setFormData({...formData,
                    confirmPassword: ''
                })
            }
            return;
        }
        setLoading(true)
        const response = await Userregister({...formData})
        
        if (response) {
            setLoading(false)
            handleLogin()
        }
        else{
            alert('Failed to Register')
            setLoading(false)
        }
    }

    return (
    <>
    {!loading ? <div className='reg-container'>
        <div className='name-div-reg'>
          <p className='name-para-reg'>Name</p>
          <input type='text' name='name' className='name-input-reg' value={formData.name} onChange={handleChange} style={{border: errors.name ? '2px solid #D60000' : '2px solid #F4F4F4'}}></input>
          {errors.name && <span className='name-err-reg' style={{ color: 'red' }}>{errors.name}</span>}
        </div>
        <div className='email-div-reg'>
          <p className='email-para-reg'>Email</p>
          <input type='email' name='email' className='email-input-reg' value={formData.email} onChange={handleChange} style={{border: errors.email ? '2px solid #D60000' : '2px solid #F4F4F4'}}></input>
          {errors.email && <span className='email-err-reg' style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div className='pass-div-reg'>
          <p className='pass-para-reg'>Password</p>
          <input type='password' name='password' className='pass-input-reg' value={formData.password} onChange={handleChange} style={{border: errors.password ? '2px solid #D60000' : '2px solid #F4F4F4'}}></input>
          {errors.password && <span className='pass-err-reg' style={{ color: 'red' }}>{errors.password}</span>}
        </div>
        <div className='confpass-div-reg'>
          <p className='confpass-para-reg'>Confirm Password</p>
          <input type='password' name='confirmPassword' className='confpass-input-reg' value={formData.confirmPassword} onChange={handleChange} style={{border: errors.confirmPassword ? '2px solid #D60000' : '2px solid #F4F4F4'}}></input>
          {errors.confirmPassword && <span className='confpass-err-reg' style={{ color: 'red' }}>{errors.confirmPassword}</span>}
        </div>
        <button onClick={handleSubmit} className='signup-btn-reg'>Sign-Up</button>
    </div> : <div style={{position: 'relative', left:'40vw'}}><ClipLoader color={"#36D7B7"} loading={loading} size={100} /></div>}
    </>
    )
}

export default Register
