import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { Link,useNavigate } from 'react-router-dom';

const CheckEmailPage = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: ""
  })
  const handleChange = (e) => {
    const {name, value} = e.target
    setData((preve) => {
      return{...preve, [name]: value}
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const URL = `${process.env.REACT_APP_BACKEND_URI}/api/email`

    try {
      const response = await axios.post(URL, data)
      toast.success(response.data.message)
      if(response.data.success){
        setData({
          email: ""
        })
        navigate('/password', {
          state: response?.data?.data
        })
      }
      console.log(response.data)
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-5'>

        <div className='bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4 mx-auto'>
          <h3>Welcome to Chat App</h3>
          <form className='grid gap-3 mt-5' onSubmit={handleSubmit}>
  
              <div className='flex flex-col gap-1'>
                <label htmlFor='email'>Email: </label>
                <input type="email" name="email" id="email" placeholder='Enter Your Email' className='bg-slate-100 px-2 py-1 focus:outline-primary' value={data.email} onChange={handleChange} required />
              </div>
              
          <button className='bg-primary text-lg px-8 py-1 hover:bg-secondary mt-4 text-white font-bold' >Log In</button>
          </form>
          <p className='text-sm pt-6 text-center'>Don't Have Account ? <Link className='text-blue-700 hover:text-primary font-semibold' to={"/register"}>Register</Link></p>

        </div>

    </div>
  )
}

export default CheckEmailPage
