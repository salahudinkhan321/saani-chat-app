import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import uploadFile from "../helpers/uploadFile.js";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [uploadPhoto, setUploadPhoto] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return { ...preve, [name]: value };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);
    setData((preve) => {
      return { ...preve, profile_pic: uploadPhoto?.url };
    });
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    setUploadPhoto("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = `${process.env.REACT_APP_BACKEND_URI}/api/register`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message);
      if (response?.data?.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        navigate("/email");
        console.log(response.data)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Chat App</h3>
        <form className="grid gap-3 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Your Name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your Email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Your Password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Picture:
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="text-sm max-w-sm text-ellipsis line-clamp-1">
                  {uploadPhoto.name ? uploadPhoto?.name : "Upload Photo Here"}
                </p>
                <button
                  className="text-lg ml-2 hover:text-red-500"
                  onClick={handleClearUploadPhoto}
                >
                  {uploadPhoto.name ? <IoClose /> : ""}
                </button>
              </div>
            </label>
            <input
              type="file"
              name="profile_pic"
              id="profile_pic"
              placeholder="Enter Your Profile"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>
          <button className="bg-primary text-lg px-8 py-1 hover:bg-secondary mt-4 text-white font-bold">
            Register Now
          </button>
        </form>
        <p className="text-sm pt-6 text-center">
          Already Have Account ?{" "}
          <Link
            className="text-blue-700 hover:text-primary font-semibold"
            to={"/email"}
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
