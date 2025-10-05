import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import api from "../../../api/api";

function ProfileForm({ visable, onCloseForm, usename, onApplyChanges }) {
  const [name, setName] = useState(usename);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (name && name.length > 21) {
      setError("Username cannot be longer than 21 characters.");
      setLoading(false);
      return;
    }

    if (!name && !currentPassword && !newPassword) {
      setError("Please provide at least a new name or password changes");
      setLoading(false);
      return;
    }

    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      setError(
        "Both current and new passwords are required to change password"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await api.profileApis.editProfileInfo(
        name,
        currentPassword,
        newPassword
      );

      if (response.success) {
        onCloseForm();
        onApplyChanges(name);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
        visable ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className={`bg-white rounded-2xl shadow-2xl w-[400px] max-w-[90vw] transform transition-all duration-300 ${
        visable ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
      }`}>
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-2xl">
          <h1 className="text-white text-xl font-bold">Edit Profile</h1>
          <button
            onClick={() => onCloseForm()}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleEditProfile} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Enter your new name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCloseForm}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg transform hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;