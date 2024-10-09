import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {Link, useParams} from 'react-router-dom'
import Avatar from './Avatar.js'
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa6";
import { IoIosVideocam } from "react-icons/io";
import uploadFile from '../helpers/uploadFile.js';
import { IoMdClose } from "react-icons/io";
import Loading from './Loading.js';
import { IoSendSharp } from "react-icons/io5";
import moment from 'moment'

const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)
  const [dataUser,setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  })
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  })
  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage ] = useState([])
  const currentMessage = useRef(null)

  useEffect(() => {
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior : 'smooth', block: 'end' })
    }
  }, [allMessage])

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(preve => !preve)
  }

  const handleUploadImage = async(e) => {
    const file = e.target.files[0];
    setLoading(true)
    const uploadPhoto = await uploadFile(file);
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage(preve => {
      return {
        ...preve, 
        imageUrl: uploadPhoto.url
      }
    })
  }

  const handleClearUploadPhoto = () => {
    setMessage(preve => {
      return {
        ...preve, 
        imageUrl: ""
      }
    })
  }

  const handleUploadVideo = async(e) => {
    const file = e.target.files[0];
    setLoading(true)
    const uploadVideo = await uploadFile(file);
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage(preve => {
      return {
        ...preve, 
        videoUrl: uploadVideo.url
      }
    })
  }

  const handleClearUploadVideo = () => {
    setMessage(preve => {
      return {
        ...preve, 
        videoUrl: ""
      }
    })
  }
  useEffect(() => {
    if(socketConnection){
      socketConnection.emit('message-page', params.userId)

      socketConnection.emit('seen', params.userId)

    socketConnection.on('message-user', (data) => {
      setDataUser(data)
    })

    socketConnection.on('message', (data) => {
      setAllMessage(data)
      console.log(data)
    })
  }
  }, [socketConnection, params?.userId, user])
  
  const handleOnChange = (e) => {
    const {name, value} = e.target
    setMessage(preve => {
      return{...preve, text: value}
    })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if(message.text || message.imageUrl || message.videoUrl) {
      if(socketConnection) {
        socketConnection.emit('new message',{
          sender : user?._id,
          receiver : params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        })
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        })
      }
    } 
  }


  return (
    <div className='bg-slate-200'>
          <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
              <div className='flex items-center gap-5'>
                <Link to={"/"} className='lg:hidden'><FaAngleLeft size={25} />
                </Link>
                  <div>
                    <Avatar width={50} height={50} imageUrl={dataUser?.profile_pic} name={dataUser?.name} userId={dataUser?._id} />
                  </div>
                  <div>
                  <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
                  <p className='my-0 -my-1 text-sm'>{dataUser.online ? <span className='text-primary'>Online</span> : <span className='text-slate-400'>Offline</span>}</p>
                  </div>
              </div>

              <div>
              <button className='cursor-pointer hover:text-primary'>
              <BsThreeDotsVertical />
              </button>  
              </div>

          </header>

          <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
            <div className='flex flex-col mx-2 gap-2 ' ref={currentMessage} >
              {
                allMessage.map((msg,index) => {
                  return(
            <div className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                       <div className='w-full relative'>
                              {
                                msg?.imageUrl && (
                                  <img 
                                    src={msg?.imageUrl}
                                    className='w-full h-full object-scale-down'
                                  />
                                )
                              }
                              {
                                msg?.videoUrl && (
                                  <video
                                    src={msg.videoUrl}
                                    className='w-full h-full object-scale-down'
                                    controls
                                  />
                                )
                              }
                            </div>
                      <p className='px-2'>{msg.text}</p>
                      <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                    </div>
                  )
                } )
              }
            </div>

            {
              message.imageUrl && (     
            <div className='w-full h-full sticky bottom-0 bg-slate-600 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadPhoto}>
              <IoMdClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <img src={message.imageUrl} className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'  />
              </div>
            </div>
              )
            }
             {
              message.videoUrl && (     
            <div className='w-full h-full sticky bottom-0 bg-slate-600 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
              <IoMdClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <video src={message.videoUrl} className='aspect-video w-full h-full max-w-sm m-2 object-scale-down' controls muted autoPlay  />
              </div>
            </div>
              )
            }

            {loading && (
              <div className='w-full sticky bottom-0 h-full justify-center items-center'>
                <Loading />
              </div>
            )}

          </section>

          <section className='h-16 bg-white flex items-center px-2'>
            <div className='relative'>
              <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'><FaPlus size={20} /></button>
              {
                openImageVideoUpload && (
              <div className='bg-white rounded shadow absolute bottom-14 w-36 p-2'>
                <form>
                    <label htmlFor="uploadImage" className='flex items-center p-2 px-3 gap-3 cursor-pointer hover:bg-slate-200'>
                    <div className='text-primary'><FaRegImage size={18} /></div>
                    <p>Image</p>
                    </label>
                    <label htmlFor="uploadVideo" className='flex items-center p-2 px-3 gap-3 cursor-pointer hover:bg-slate-200'>
                    <div className=' text-purple-500'><IoIosVideocam size={18} /></div>
                    <p>Video</p>
                    </label>

                    <input type="file" id="uploadImage" className='hidden' onChange={handleUploadImage} /> 
                    <input type="file" id="uploadVideo" className='hidden' onChange={handleUploadVideo} />

                </form>
              </div>
                )
              }
            </div>

              <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
                <input type="text" placeholder='Enter Message' className='py-1 px-4 outline-none w-full h-full' value={message.text} onChange={handleOnChange} />
                <button className='text-primary hover:text-secondary'><IoSendSharp size={28} /></button>
              </form>

          </section>
    </div>
  )
}

export default MessagePage
