import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar.js';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice.js';

const CheckPasswordPage = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [data, setData] = useState({
    password: "",
    userId: ""
  })

  useEffect(() => {
    if(!location?.state?.name){
      navigate('/email')
    }
  }, [])

  const handleChange = (e) => {
    const {name, value} = e.target
    setData((preve) => {
      return{...preve, [name]: value}
    })
  }
  
  const handleSubmit = async(e) => {
    e.preventDefault()
    const URL = `${process.env.REACT_APP_BACKEND_URI}/api/password`

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      })
      toast.success(response.data.message)
      if(response.data.success){
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token',response?.data?.token)
        setData({
          password: ""
        })
        navigate('/')
        console.log(response.data)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }

  }

  return (
    <div className='mt-5'>

        <div className='w-fit mx-auto mb-2 justify-center items-center flex-col'>
              <Avatar className='ml-20' width={70} height={70} name={location?.state?.name} imageUrl={location?.state?.profile_pic} />
              <h2 className='font-semibold text-lg mt-2 '>{location?.state?.name}</h2>
        </div>

        <div className='bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4 mx-auto'>
          <h3>Welcome to Chat App</h3>
          <form className='grid gap-3 mt-5' onSubmit={handleSubmit}>
  
          <div className='flex flex-col gap-1'>
                <label htmlFor='password'>Password: </label>
                <input type="password" name="password" id="password" placeholder='Enter Your Password' className='bg-slate-100 px-2 py-1 focus:outline-primary' value={data.password} onChange={handleChange} required />
              </div>
              
          <button className='bg-primary text-lg px-8 py-1 hover:bg-secondary mt-4 text-white font-bold' >Verify User</button>
          </form>
          <p className='text-sm pt-6 text-center'> <Link className='text-blue-700 hover:text-primary font-semibold' to={"/forgot-password"}>Forgote Password ?</Link></p>

        </div>

    </div>
  )
}

export default CheckPasswordPage
