import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, UserCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Posts from "../components/Posts";
import ProfileInfo from "../components/Profile/ProfileInfo";
import EditProfileForm from "../components/Profile/EditProfileForm";
import SkillsAndClubs from "../components/Profile/SkillsAndClubs";
import FriendCard from "../components/Profile/FriendCard";
import ConfirmDialog from "../components/Profile/ConfirmDialog";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ErrorMessage from "../components/Common/ErrorMessage";
import {fetchMutualConnections,fetchMutualFriends} from "../utils/userServices";
import RecommendedConnections from "../components/Profile/RecommendedConnection";
import {
  fetchFriendList,
  fetchUserProfile,
  fetchOtherUserProfile,
  updateUserProfile,
  removeFriend,
  addFriend,
} from "../utils/userServices";
import {
  fetchPosts,
  upvotePost,
  downvotePost,
  commentOnPost,
} from "../utils/postServices";

const Profile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const isCurrentUser = !userId || userId === "undefined";
const [profileMutualConnections, setProfileMutualConnections] = useState(0);
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("NOT_CONNECTED");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [connections, setConnections] = useState(new Set());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId === "undefined") navigate("/profile");
  }, [userId, navigate]);

 const loadData = async () => {
   setLoading(true);
   try {
     const userData = isCurrentUser
       ? await fetchUserProfile()
       : await fetchOtherUserProfile(userId);
     setUser(userData);

     const currentUserFriends = await fetchFriendList();

     if (isCurrentUser) {
       setFriends(currentUserFriends);
       setFilteredFriends(currentUserFriends);
       setConnections(new Set(currentUserFriends.map((friend) => friend._id)));
     } else {
       // For other user's profile
       const userFriends = await fetchFriendList(userId);

       // Get mutual connections for the profile we're viewing
       const mutualCount = await fetchMutualConnections(userId);
       setProfileMutualConnections(mutualCount);

       setFriends(userFriends);
       setFilteredFriends(userFriends);

       const currentUserFriendIds = new Set(
         currentUserFriends.map((friend) => friend._id)
       );
       setConnections(currentUserFriendIds);
       setConnectionStatus(
         currentUserFriendIds.has(userId) ? "CONNECTED" : "NOT_CONNECTED"
       );
     }

     // Fetch posts
     const postList = await fetchPosts({
       type: isCurrentUser ? "myposts" : "friend",
       id: isCurrentUser ? undefined : userId,
     });
     setPosts(postList);
   } catch (error) {
     console.error("Error loading data:", error);
     setError("Failed to load profile data");
   } finally {
     setLoading(false);
   }
 };

  useEffect(() => {
    if (!userId || userId !== "undefined") {
      loadData();
    }
  }, [userId]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredFriends(
      query
        ? friends.filter((friend) =>
            friend.fullName.toLowerCase().includes(query.toLowerCase())
          )
        : friends
    );
  };

  const handleConnect = async () => {
    try {
      await addFriend(userId);
      setConnectionStatus("CONNECTED");
      setConnections((prev) => new Set([...prev, userId]));
      await loadData();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await removeFriend(userId);
      setConnectionStatus("NOT_CONNECTED");
      setConnections((prev) => {
        const newConnections = new Set(prev);
        newConnections.delete(userId);
        return newConnections;
      });
      await loadData();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const handleRemoveFriend = async () => {
    if (selectedFriend) {
      try {
        await removeFriend(selectedFriend._id);
        await loadData();
        setShowConfirmDialog(false);
        setSelectedFriend(null);
      } catch (error) {
        console.error("Failed to remove friend:", error);
      }
    }
  };
  const handleRecommendationConnect = async (userId) => {
    try {
      await addFriend(userId);
      setConnections((prev) => new Set([...prev, userId]));
      await loadData(); 
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };
  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => setIsEditing(false);
  const handleSaveEdit = async () => {
    await loadData();
    setIsEditing(false);
  };

  const handleUpdatePicture = (newPictureUrl) => {
    setUser((prev) => ({
      ...prev,
      profilePicture: newPictureUrl,
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 flex flex-col items-center">
        {isEditing ? (
          <EditProfileForm
            user={user}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        ) : (
          <ProfileInfo
            user={user}
            isCurrentUser={isCurrentUser}
            connectionStatus={connectionStatus}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onEdit={handleEdit}
            onUpdatePicture={handleUpdatePicture}
            mutualConnections={profileMutualConnections}
          />
        )}
        <SkillsAndClubs
          user={user}
          isCurrentUser={isCurrentUser}
          onUpdateUser={async (updatedData) => {
            try {
              setUser((prev) => ({
                ...prev,
                skills: updatedData.skills || prev.skills || [],
                clubs: updatedData.clubs || prev.clubs || [],
              }));

              const updatedUser = await updateUserProfile({
                skills: updatedData.skills || [],
                clubs: updatedData.clubs || [],
              });

              if (updatedUser) {
                setUser((prev) => ({
                  ...prev,
                  skills: updatedUser.skills || prev.skills || [],
                  clubs: updatedUser.clubs || prev.clubs || [],
                }));
              }

              return updatedUser;
            } catch (error) {
              loadData();
              console.error("Failed to update skills and clubs:", error);
              throw error;
            }
          }}
        />
        {isCurrentUser && (
          <>
            <RecommendedConnections
              onConnect={handleRecommendationConnect}
              connections={connections}
            />
          </>
        )}

        {isCurrentUser && (
          <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Connections
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64 pl-9 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {filteredFriends.length === 0 ? (
              <div className="text-center py-8">
                <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No connections found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFriends.map((friend) => (
                  <FriendCard
                    key={friend._id}
                    friend={friend}
                    onNavigate={(id) => navigate(`/profile/${id}`)}
                    onRemove={(friend) => {
                      setSelectedFriend(friend);
                      setShowConfirmDialog(true);
                    }}
                    isCurrentUserProfile={isCurrentUser}
                    mutualConnections={friend.mutualConnections}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="w-full md:w-3/5 lg:w-1/2 bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isCurrentUser ? "Your Posts" : `${user.fullName}'s Posts`}
          </h2>
          {posts.length === 0 ? (
            <p className="text-md text-gray-500">No posts to display.</p>
          ) : (
            <Posts
              posts={posts}
              onUpvote={upvotePost}
              onDownvote={downvotePost}
              onComment={commentOnPost}
            />
          )}
        </div>

        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleRemoveFriend}
          title="Remove Connection"
          message={`Are you sure you want to remove ${selectedFriend?.fullName} from your connections?`}
        />
      </div>
    </div>
  );
};

export default Profile;
