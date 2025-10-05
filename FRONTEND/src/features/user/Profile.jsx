import React, { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import Louder from "../../components/Loaders/Louder";
import ProfileForm from "./components/ProfileForm";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visableForm, setVisableFrom] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  useEffect(() => {
    getProfileInfo();
  }, []);

  const getProfileInfo = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await api.profileApis.getProfileInfo();

      if (response.success) {
        setUserName(response.data.username);
        setEmail(response.data.email);
        setProfileImage(response.data.profileImage);
      } else {
        setUserName("failed");
        setEmail("failed");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setLoading(true);
      const response = await api.profileApis.addProfileImage(file);
      if (response.success) {
        setProfileImage(response.data.imageUrl);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileDeletion = async () => {
    try {
      window.alert("Are you sure you want to delete your Account!");

      await api.profileApis.deleteAccount();
      navigate("/register");
    } catch (error) {
      console.log(error);
    }
  };
  const handleProfileEditing = () => {
    setVisableFrom(true);
  };

  const onCloseForm = () => {
    setVisableFrom(false);
  };

  const onApplyChanges = (username) => {
    setUserName(username);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Profile
          </h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={getProfileInfo}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Louder />
          <p className="mt-4 text-gray-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <ProfileForm
        visable={visableForm}
        onCloseForm={onCloseForm}
        username={username}
        onApplyChanges={onApplyChanges}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group mb-6">
                <div
                  className="relative h-40 w-40 rounded-full overflow-hidden shadow-2xl border-4 border-white cursor-pointer transition-all duration-300 group-hover:scale-105"
                  onClick={triggerFileInput}
                >
                  <img
                    src={profileImage || "/default-avatar.png"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
                    }}
                  />

                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-center">
                      <svg
                        className="w-8 h-8 mx-auto mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Change Photo</span>
                    </div>
                  </div>
                </div>

                {/* Online Status Indicator */}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {username}
              </h1>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">{email}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleProfileEditing}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile Information
              </button>
              <button
                onClick={handleProfileDeletion}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-300  hover:from-red-700 hover:to-red-400 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-red-300">
                  <DeleteIcon />
                </div>
                Delete my Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
