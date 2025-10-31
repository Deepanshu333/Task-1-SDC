import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { validateProfileForm, sanitizeName, sanitizeString, validatePhone } from '../../utils/validation';
import './Profile.css';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const profileData = userDocSnap.data() as UserProfile;
          setUserProfile(profileData);
          setFormData({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            address: profileData.address || '',
            phoneNumber: profileData.phoneNumber || '',
          });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate form data
    const validation = validateProfileForm(
      formData.firstName,
      formData.lastName,
      formData.address,
      formData.phoneNumber
    );

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setNotification('');
      return;
    }

    setSaving(true);
    setValidationErrors({});
    
    try {
      // Sanitize inputs
      const sanitizedFirstName = sanitizeName(formData.firstName);
      const sanitizedLastName = sanitizeName(formData.lastName);
      const sanitizedAddress = sanitizeString(formData.address);
      const phoneValidation = validatePhone(formData.phoneNumber);
      
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        address: sanitizedAddress,
        phoneNumber: phoneValidation.sanitized || '',
      });
      setNotification('Profile updated successfully!');
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error("Error updating profile: ", error);
      setNotification('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile"><div className="container">Loading...</div></div>;
  }

  if (!user) {
    return (
      <div className="profile">
        <div className="container">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="container">
        <div className="profile__header">
          <h1 className="heading-secondary">My Profile</h1>
        </div>
        <div className="profile__content">
          {notification && (
            <p style={{ 
              padding: '10px', 
              backgroundColor: notification.includes('success') ? '#d4edda' : '#f8d7da',
              color: notification.includes('success') ? '#155724' : '#721c24',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {notification}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="profile__form-group">
              <label htmlFor="firstName" className="profile__label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`profile__input ${validationErrors.firstName ? 'profile__input--error' : ''}`}
              />
              {validationErrors.firstName && (
                <span style={{ color: 'red', fontSize: '0.875rem', display: 'block', marginTop: '4px' }}>
                  {validationErrors.firstName}
                </span>
              )}
            </div>
            <div className="profile__form-group">
              <label htmlFor="lastName" className="profile__label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`profile__input ${validationErrors.lastName ? 'profile__input--error' : ''}`}
              />
              {validationErrors.lastName && (
                <span style={{ color: 'red', fontSize: '0.875rem', display: 'block', marginTop: '4px' }}>
                  {validationErrors.lastName}
                </span>
              )}
            </div>
            <div className="profile__form-group">
              <label htmlFor="email" className="profile__label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userProfile?.email || ''}
                className="profile__input"
                disabled
              />
            </div>
            <div className="profile__form-group">
              <label htmlFor="address" className="profile__label">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`profile__input ${validationErrors.address ? 'profile__input--error' : ''}`}
              />
              {validationErrors.address && (
                <span style={{ color: 'red', fontSize: '0.875rem', display: 'block', marginTop: '4px' }}>
                  {validationErrors.address}
                </span>
              )}
            </div>
            <div className="profile__form-group">
              <label htmlFor="phoneNumber" className="profile__label">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`profile__input ${validationErrors.phoneNumber ? 'profile__input--error' : ''}`}
              />
              {validationErrors.phoneNumber && (
                <span style={{ color: 'red', fontSize: '0.875rem', display: 'block', marginTop: '4px' }}>
                  {validationErrors.phoneNumber}
                </span>
              )}
            </div>
            <button type="submit" className="btn btn-primary profile__submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
