import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import getBackendUrl from "../utils/getBackendUrl";
import '../css/ProfilePage.css'

export default function ProfilePage() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteAccount = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Auth token not found');
      return;
    }

    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/user/delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (response.ok) {
        logout();
        navigate('/');
      } else {
        const data = await response.json();
        console.log(data.message || 'Server connection error, try again later...');
      }
    } catch (error) {
      console.log('Server connection error, try again later...');
    }
  };

  return (
    <div className='profile-page'>
      <button className='profile-page__logout-button' onClick={logout}>Log out</button>
      <button 
        className='profile-page__delete-button' 
        onClick={() => setShowConfirm(true)}
      >
        Delete Account
      </button>

      {showConfirm && (
        <div className="overlay">
          <div className="confirm-popup">
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <button className="confirm-popup__yes" onClick={deleteAccount}>Yes</button>
            <button className="confirm-popup__no" onClick={() => setShowConfirm(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}
