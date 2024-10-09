import axios from "axios";
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, setOnlineUser, setSocketConnection, setUser } from "../redux/userSlice.js";
import Sidebar from "../components/Sidebar.js";
import {io} from 'socket.io-client'


const Home = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("User: ",user)
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URI}/api/user-details`;
      const response = await axios({
        method: "get",
        url: URL,
        withCredentials: true,
      });
      dispatch(setUser(response.data.data));
      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
      console.log("Current User Details", response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {

    const socketConnection = io(process.env.REACT_APP_BACKEND_URI, {
      auth: {
        token: localStorage.getItem('token')
      }
    })
    dispatch(setSocketConnection(socketConnection))

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data))
    })


    return () => {
      socketConnection.disconnect()
    }

  }, [])


  const basePath = location.pathname === "/";

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <p className="text-lg text-slate-500 mt-2 ">
            Select User For Conversation
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
