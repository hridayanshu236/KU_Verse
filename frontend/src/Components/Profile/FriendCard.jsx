import React from "react";
import { UserMinus, Users } from "lucide-react";

const FriendCard = ({
  friend,
  onNavigate,
  onRemove,
  isCurrentUserProfile,
}) => {

 return (
   <div
     className="group relative bg-white rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:shadow-md cursor-pointer"
     onClick={() => onNavigate(friend._id)}
   >
     <div className="flex items-center space-x-4">
       <img
         src={friend.profilePicture || "https://via.placeholder.com/40"}
         alt={friend.fullName}
         className="w-12 h-12 rounded-full object-cover"
       />
       <div className="flex-1 min-w-0">
         <p className="text-sm font-medium text-gray-900 truncate">
           {friend.fullName}
         </p>
         <p className="text-sm text-gray-500 truncate">
           {friend.department || "No department"}
         </p>
       </div>
       {isCurrentUserProfile && (
         <button
           onClick={(e) => {
             e.stopPropagation();
             onRemove(friend);
           }}
           className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
         >
           <UserMinus className="w-4 h-4" />
         </button>
       )}
     </div>
   </div>
 );
};

export default FriendCard;
