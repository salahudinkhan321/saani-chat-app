import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar.js";
import uploadFile from "../helpers/uploadFile.js";
import Divider from "./Divider.js";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice.js";

const EditUserDetails = ({ onClose, user }) => {
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setPending(true);
        const uploadPhoto = await uploadFile(file);
        setData((prev) => ({
          ...prev,
          profile_pic: uploadPhoto?.url,
        }));
        setPending(false);
      } catch (error) {
        toast.error("Error uploading photo");
      }
    }
  };

  const handleUploadPhotoRef = (e) => {
    e.preventDefault();
    uploadPhotoRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URI}/api/update-user`;
      const response = await axios({
        method: "post",
        url: URL,
        data: data,
        withCredentials: true,
      });
      toast.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setUser(response?.data?.data));
        onClose(); // Close the modal on success
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      ...user,
    }));
  }, [user]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile</h2>
        <p className="text-sm">Edit User Details</p>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data?.name}
              onChange={handleChange}
              className="w-full py-1 px-1 focus:outline-primary bottom-0.5"
            />
          </div>

          <div>
            <div>Photo</div>
            <div className="my-1 flex items-center gap-3">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <label htmlFor="profile_pic">
                <button
                  type="button" // Use button type "button" to prevent form submission
                  className="text-semibold"
                  onClick={handleUploadPhotoRef}
                >
                  {pending ? (
                    <span className="opacity-45">Wait for a While.....</span>
                  ) : (
                    "Change Photo"
                  )}
                </button>
                <input
                  className="hidden"
                  type="file"
                  id="profile_pic"
                  ref={uploadPhotoRef}
                  onChange={handleUploadPhoto}
                />
              </label>
            </div>
          </div>
          <Divider />
          <div className="flex gap-2 w-fit ml-auto mt-4">
            <button
              type="button" // Use button type "button" to prevent form submission
              onClick={onClose}
              className="border-primary text-primary px-4 py-1 hover:bg-primary hover:text-white border rounded"
            >
              Cancel
            </button>
            <button
              type="submit" // Use type "submit" for form submission
              className="border-primary bg-primary text-white px-4 py-1 rounded hover:bg-secondary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
