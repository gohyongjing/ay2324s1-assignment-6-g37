import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ChangePasswordPage.module.css";
import { User } from "./types";

// Should only allow change of password if old password matches!
const ChangePasswordPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/auth/current-user")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching current user", error);
      });
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
      alert("Please fill in credentials, and ensure new passwords match.");
      return;
    }

    try {
      const response = await axios.put(`/api/users/${user?.username}`, {
        oldPassword,
        newPassword,
      });
      if (response.status === 200) {
        alert("Password changed successfully");

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        navigate("/profile");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Change password failed:", error);
        alert("User credential is incorrect");
      } else {
        alert("Changing password failed. Try again later.");
        console.error("An unknown error occurred:", error);
      }
    }
  };

  const handleCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    navigate("/profile");
  };

  return (
    <div className={styles.login_container}>
      <h1>Change Password</h1>

      <div className={styles.input_field}>
        <label className={styles.the_label} htmlFor="oldPassword">
          Old Password
        </label>
        <input
          className={styles.input_text}
          id="oldPassword"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>

      <div className={styles.input_field}>
        <label className={styles.the_label} htmlFor="newPassword">
          New Password
        </label>
        <input
          className={styles.input_text}
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className={styles.input_field}>
        <label className={styles.the_label} htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          className={styles.input_text}
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button className={styles.action_button} onClick={handleChangePassword}>
        Save
      </button>
      <button className={styles.action_button} onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default ChangePasswordPage;
