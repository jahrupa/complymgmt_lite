import React, { useState } from 'react';
import '../style/ProfileForm.css';

const ProfileForm = () => {
    const [profileImage, setProfileImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="form-wrapper">
            <form className="profile-form">
                <h2>Edit Profile</h2>

                <div className="image-upload">
                    <label htmlFor="profile-image">
                        <div className="image-preview">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" />
                            ) : (
                                <span>Upload Photo</span>
                            )}
                        </div>
                    </label>
                    <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Email" required />
                <input type="text" placeholder="Location" />
                <textarea placeholder="Bio (max 250 characters)" maxLength="250" />

                <select>
                    <option value="">Select Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                </select>

                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
};

export default ProfileForm;
