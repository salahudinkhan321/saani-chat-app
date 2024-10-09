import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { RiLogoutBoxRFill } from "react-icons/ri";
import Avatar from "./Avatar.js";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails.js";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser.js";
import { FaRegImage } from "react-icons/fa6";
import { IoIosVideocam } from "react-icons/io";
import { logout } from "../redux/userSlice.js";
import toast from "react-hot-toast";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    if(socketConnection){
        socketConnection.emit('sidebar',user._id)
        
        socketConnection.on('conversation',(data)=>{
            console.log('conversation',data)
            
            const conversationUserData = data.map((conversationUser,index)=>{
                if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                    return{
                        ...conversationUser,
                        userDetails : conversationUser?.sender
                    }
                }
                else if(conversationUser?.receiver?._id !== user?._id){
                    return{
                        ...conversationUser,
                        userDetails : conversationUser.receiver
                    }
                }else{
                    return{
                        ...conversationUser,
                        userDetails : conversationUser.sender
                    }
                }
            })

            setAllUser(conversationUserData)
        })
    }
},[socketConnection,user])

    const handleLogout = () => {
      dispatch(logout())
      navigate('/email')
      toast.success("Logout SuccessFull")
      localStorage.clear()  
    }

  return (
    <div className="w-full h-full grid grid-cols-[50px,1fr]">
      <div className="bg-slate-200 w-12 h-full py-4 flex flex-col justify-between ">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-300 text-slate-600 ${
                isActive && "bg-slate-300"
              } `
            }
            title="chat"
          >
            <IoChatbubbleEllipsesSharp size={25} />
          </NavLink>
          <div
          title="add friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-300 text-slate-600"
          >
            <FaUserPlus size={25} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="mx-auto "
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-300 text-slate-600" onClick={handleLogout}>
            <span className="-ml-2">
              <RiLogoutBoxRFill size={30} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl text-slate-800 h-16 font-bold p-6">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>
        <div className="h-full overflow-x-hidden overflow-y-scroll">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <GoArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400 pt-3">
                Explore User to Start Conversation
              </p>
            </div>
          )}
          {
            allUser.map((conv, index) => {
              return(
                <NavLink to={"/"+conv?.userDetails?._id} key={conv?._id} className="flex items-center gap-2 p-3 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer">

                  <div>
                    <Avatar width={40} height={40} imageUrl={conv?.userDetails?.profile_pic} name={conv?.userDetails?.name} />
                  </div>
                  <div>
                    <h3 className="text-ellipsis line-clamp-1">{conv?.userDetails?.name}</h3>
                    <div className="text-slate-500 text-xs flex items-center gap-1">
                      <div className="flex items-center gap-1">
                        {
                          conv?.lastMsg?.imageUrl && (
                             <div className="flex items-center gap-1">
                               <span><FaRegImage/></span>
                               {!conv?.lastMsg?.text && <span>Image</span>}
                             </div>
                          )
                        }
                         {
                          conv?.lastMsg?.videoUrl && (
                             <div className="flex items-center gap-1">
                               <span><IoIosVideocam/></span>
                               {!conv?.lastMsg?.text && <span>Video</span>}
                             </div>
                          )
                        }
                        </div>
                      <p className="text-sm text-slate-500 text-ellipsis line-clamp-1 ">{conv?.lastMsg.text}</p>
                    </div>
                  </div>
                  {
                  Boolean(conv?.unseenMsg) && (
                    <p className="text-xs w-5 h-5 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full ">{conv?.unseenMsg}</p>
                  )
                  }
                </NavLink>
              )
            })
          }
        </div>
      </div>

      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />)
      }
    </div>
  );
};

export default Sidebar;
