const mongoose = require("mongoose");
const User = require("../models/userModel");

class UserRecommendationSystem {
  constructor() {
    this.weights = {
      department: 0.25, 
      skills: 0.5, 
      clubs: 0.25, 
    };
  }


  countMutualConnections(userFriends = [], otherUserFriends = []) {
    if (!Array.isArray(userFriends) || !Array.isArray(otherUserFriends)) {
      return 0;
    }
    const userFriendSet = new Set(userFriends.map((f) => f.toString()));
    return otherUserFriends
      .map((f) => f.toString())
      .filter((f) => userFriendSet.has(f)).length;
  }

 
  calculateSetSimilarity(set1 = [], set2 = []) {
    if (!set1?.length || !set2?.length) return 0;

    const normalizedSet1 = new Set(set1.map((s) => s.toLowerCase()));
    const normalizedSet2 = new Set(set2.map((s) => s.toLowerCase()));

    const intersection = new Set(
      [...normalizedSet1].filter((item) => normalizedSet2.has(item))
    );
    const union = new Set([...normalizedSet1, ...normalizedSet2]);

    const jaccardScore = intersection.size / union.size;
    const matchPercentage =
      intersection.size / Math.min(normalizedSet1.size, normalizedSet2.size);

    return jaccardScore * 0.4 + matchPercentage * 0.6;
  }

  
  calculateSkillSimilarity(skills1 = [], skills2 = []) {
    return this.calculateSetSimilarity(skills1, skills2);
  }

  
  calculateClubSimilarity(clubs1 = [], clubs2 = []) {
    return this.calculateSetSimilarity(clubs1, clubs2);
  }

  async calculateUserSimilarity(user1, user2) {
    const departmentScore = user1.department === user2.department ? 1 : 0;
    const skillsScore = this.calculateSkillSimilarity(
      user1.skills || [],
      user2.skills || []
    );
    const clubsScore = this.calculateClubSimilarity(
      user1.clubs || [],
      user2.clubs || []
    );

    return (
      this.weights.department * departmentScore +
      this.weights.skills * skillsScore +
      this.weights.clubs * clubsScore
    );
  }

  async getRecommendations(userId, limit = 10) {
    try {
      const targetUser = await User.findById(userId).populate("friends", "_id");
      if (!targetUser) throw new Error("User not found");

      const friendIds = (targetUser.friends || []).map((f) => f._id);

     
      const initialMatches = await User.find({
        _id: { $nin: [targetUser._id, ...friendIds] },
        $or: [
          { skills: { $in: targetUser.skills || [] } },
          { clubs: { $in: targetUser.clubs || [] } },
          { department: targetUser.department },
        ],
      })
        .populate("friends", "_id")
        .limit(50); 

      const userScores = await Promise.all(
        initialMatches.map(async (user) => {
          const similarity = await this.calculateUserSimilarity(
            targetUser,
            user
          );
          const skillMatch = this.calculateSkillSimilarity(
            targetUser.skills || [],
            user.skills || []
          );
          const clubMatch = this.calculateClubSimilarity(
            targetUser.clubs || [],
            user.clubs || []
          );

          return {
            user,
            score: similarity,
            skillMatch,
            clubMatch,
            mutualConnections: this.countMutualConnections(
              targetUser.friends.map((f) => f._id),
              user.friends.map((f) => f._id)
            ),
          };
        })
      );

      return userScores
        .sort((a, b) => {
          
          if (b.score !== a.score) return b.score - a.score;
          if (b.mutualConnections !== a.mutualConnections)
            return b.mutualConnections - a.mutualConnections;
          return b.skillMatch - a.skillMatch;
        })
        .slice(0, limit)
        .map(({ user, score, skillMatch, clubMatch, mutualConnections }) => ({
          user: {
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            department: user.department,
            skills: user.skills,
            clubs: user.clubs,
            profilePicture: user.profilePicture,
          },
          similarityScore: score,
          skillMatch: Math.round(skillMatch * 100),
          clubMatch: Math.round(clubMatch * 100),
          mutualConnections,
        }));
    } catch (error) {
      console.error("Error in getRecommendations:", error);
      throw error;
    }
  }

  updateWeights(newWeights) {
    this.weights = { ...this.weights, ...newWeights };
  }
}

module.exports = UserRecommendationSystem;
