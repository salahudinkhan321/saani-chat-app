import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";

const SearchUser = ({onClose}) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("") 

  const handleSearchUser = async() => {
    const URL = `${process.env.REACT_APP_BACKEND_URI}/api/search-user`;
    try {
      setLoading(true)
      const response = await axios.post(URL, {
        search: search
      })
      setLoading(false)
      setSearchUser(response?.data?.data)

    } catch (error) {
      toast.error(error?.response?.data?.message || "Unexpected Error Happen")
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearchUser();
  }, [search])

  console.log(searchUser)
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 z-10">
      <div className="w-full max-w-md mx-auto mt-10">
        <div className="bg-white rounded-lg overflow-hidden h-14 flex">
          <input
            type="text"
            placeholder="Search User Name..."
            className="w-full outline-none p-1 h-full px-2"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-12 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>

        <div className="mt-2 bg-white w-full p-4 rounded overflow-y-scroll">
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">No User Found</p>
          )}
          {loading && (
            <p className="flex justify-center items-center opacity-70">
              Loading...
            </p>
          )}
          {searchUser.length !==0 && !loading &&(
            searchUser.map((user, index) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            )))
          }
        </div>
      </div>

          <div className=" absolute  top-0 right-0 text-2xl p-2 hover:text-primary">
            <button className=" hover:text-white" onClick={onClose}><IoCloseSharp  size={25} />
            </button>
          </div>

    </div>
  );
};

export default SearchUser;
