const mongoose = require("mongoose");
const User = require("../models/userModel");

class UserRecommendationSystem {
  constructor() {
    this.weights = {
      department: 0.3,
      skills: 0.7,
    };
  }

  // Add the missing countMutualConnections method
  countMutualConnections(userFriends = [], otherUserFriends = []) {
    if (!Array.isArray(userFriends) || !Array.isArray(otherUserFriends)) {
      return 0;
    }

    const userFriendSet = new Set(userFriends.map((f) => f.toString()));

    return otherUserFriends
      .map((f) => f.toString())
      .filter((f) => userFriendSet.has(f)).length;
  }

  calculateSkillSimilarity(skills1 = [], skills2 = []) {
    if (!skills1?.length || !skills2?.length) return 0;

    const set1 = new Set(skills1.map((s) => s.toLowerCase()));
    const set2 = new Set(skills2.map((s) => s.toLowerCase()));

    const intersection = new Set([...set1].filter((skill) => set2.has(skill)));
    const union = new Set([...set1, ...set2]);

    const jaccardScore = intersection.size / union.size;
    const matchPercentage = intersection.size / Math.min(set1.size, set2.size);

    return jaccardScore * 0.4 + matchPercentage * 0.6;
  }

  async calculateUserSimilarity(user1, user2) {
    const departmentScore = user1.department === user2.department ? 1 : 0;
    const skillsScore = this.calculateSkillSimilarity(
      user1.skills || [],
      user2.skills || []
    );

    return (
      this.weights.department * departmentScore +
      this.weights.skills * skillsScore
    );
  }

  async getRecommendations(userId, limit = 10) {
    try {
      const targetUser = await User.findById(userId).populate("friends", "_id"); // Populate friends to get their IDs

      if (!targetUser) throw new Error("User not found");

      const friendIds = (targetUser.friends || []).map((f) => f._id);

      
      const skillMatches = await User.find({
        _id: { $nin: [targetUser._id, ...friendIds] },
        skills: { $in: targetUser.skills || [] },
      })
        .populate("friends", "_id")
        .limit(30);

      
      const departmentMatches = await User.find({
        _id: {
          $nin: [
            targetUser._id,
            ...friendIds,
            ...skillMatches.map((u) => u._id),
          ],
        },
        department: targetUser.department,
      })
        .populate("friends", "_id")
        .limit(20);

      const potentialConnections = [...skillMatches, ...departmentMatches];

      const userScores = await Promise.all(
        potentialConnections.map(async (user) => {
          const similarity = await this.calculateUserSimilarity(
            targetUser,
            user
          );
          const skillMatch = this.calculateSkillSimilarity(
            targetUser.skills || [],
            user.skills || []
          );

          return {
            user,
            score: similarity,
            skillMatch,
            mutualConnections: this.countMutualConnections(
              targetUser.friends.map((f) => f._id),
              user.friends.map((f) => f._id)
            ),
          };
        })
      );

      return userScores
        .sort((a, b) => b.score - a.score || b.skillMatch - a.skillMatch)
        .slice(0, limit)
        .map(({ user, score, skillMatch, mutualConnections }) => ({
          user: {
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            department: user.department,
            skills: user.skills,
            profilePicture: user.profilePicture,
          },
          similarityScore: score,
          skillMatch: Math.round(skillMatch * 100),
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
