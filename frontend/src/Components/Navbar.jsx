import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faCog,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-4 py-2 flex justify-between items-center">

      <div className="flex items-center cursor-pointer">

        <h1 className="text-lg font-bold text-[rgb(103,80,164)]">KU-Verse</h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full w-1/3 ">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-full pl-2 text-gray-700"
        />
      </div>
      <div>
        
      </div>

      <div className="flex px-4 text-[rgb(103,80,164)]">
        <FontAwesomeIcon icon={faBell} className="w-6 h-6 cursor-pointer px-4" />
        <FontAwesomeIcon
          icon={faCommentDots}
          className="w-6 h-6 cursor-pointer px-4"
        />
        <FontAwesomeIcon icon={faCog} className="w-6 h-6 cursor-pointer px-4" />
      </div>
    </nav>
  );
};

export default Navbar;
