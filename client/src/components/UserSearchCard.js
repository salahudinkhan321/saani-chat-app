import React from "react";
import Avatar from './Avatar.js'
import { Link } from "react-router-dom";

const UserSearchCard = ({user,onClose}) => {
  return ( 
  <Link to={'/'+user?._id} onClick={onClose} className="flex items-center gap-3 mt-3 p-2 border hover:border-primary cursor-pointer">

    <div>
      <Avatar width={50} height={50} name={user?.name} imageUrl={user?.profile_pic} userId={user._id} />
    </div>

    <div>
        <div className="font-semibold">
          {user?.name}
        </div>
        <p>{user?.email}</p>
    </div>

  </Link>
  )
};

export default UserSearchCard;
