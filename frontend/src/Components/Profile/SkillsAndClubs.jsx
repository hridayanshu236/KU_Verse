import React, { useState, useEffect } from "react";
import { BookOpen, Briefcase } from "lucide-react";
import TagSection from "./TagSection";
import CustomAlert from "../common/CustomAlert";

const SkillsAndClubs = ({ user, onUpdateUser, isCurrentUser }) => {
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localSkills, setLocalSkills] = useState(user.skills || []);
  const [localClubs, setLocalClubs] = useState(user.clubs || []);

  useEffect(() => {
    setLocalSkills(user.skills || []);
    setLocalClubs(user.clubs || []);
  }, [user]);

  const handleUpdate = async (updatedData) => {
    setIsUpdating(true);
    setError(null);
    try {
      await onUpdateUser(updatedData);
    } catch (error) {
      console.error("Update error:", error);
      setError(
        error.message || "Failed to update profile. Please try again later."
      );
      setLocalSkills(user.skills || []);
      setLocalClubs(user.clubs || []);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddSkill = (skill) => {
    if (localSkills.length >= 20) {
      setError("Maximum of 20 skills allowed");
      return;
    }

    if (!localSkills.includes(skill)) {
      const updatedSkills = [...localSkills, skill];
      setLocalSkills(updatedSkills);
      handleUpdate({
        ...user,
        skills: updatedSkills,
      });
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...localSkills];
    updatedSkills.splice(index, 1);
    setLocalSkills(updatedSkills);
    handleUpdate({
      ...user,
      skills: updatedSkills,
    });
  };

  const handleAddClub = (club) => {
    if (localClubs.length >= 10) {
      setError("Maximum of 10 clubs allowed");
      return;
    }

    if (!localClubs.includes(club)) {
      const updatedClubs = [...localClubs, club];
      setLocalClubs(updatedClubs);
      handleUpdate({
        ...user,
        clubs: updatedClubs,
      });
    }
  };

  const handleRemoveClub = (index) => {
    const updatedClubs = [...localClubs];
    updatedClubs.splice(index, 1);
    setLocalClubs(updatedClubs);
    handleUpdate({
      ...user,
      clubs: updatedClubs,
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 space-y-6 mt-5">
      {error && <CustomAlert>{error}</CustomAlert>}
      {isUpdating && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-blue-600">Updating profile...</span>
        </div>
      )}

      <div className="space-y-8">
        <TagSection
          title="Skills"
          items={localSkills}
          onAdd={handleAddSkill}
          onRemove={handleRemoveSkill}
          icon={Briefcase}
          emptyText="No skills added yet. Add your professional and technical skills."
          error={error}
          isCurrentUser={isCurrentUser}
        />
        <TagSection
          title="Clubs"
          items={localClubs}
          onAdd={handleAddClub}
          onRemove={handleRemoveClub}
          icon={BookOpen}
          emptyText="No clubs added yet. Add the clubs and organizations you're part of."
          error={error}
          isCurrentUser={isCurrentUser}
        />
      </div>
    </div>
  );
};

export default SkillsAndClubs;
