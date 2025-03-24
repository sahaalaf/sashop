import React, { useEffect, useState } from 'react';
import axios from 'axios';
import placeholder from '../assets/placeholder.png';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                setError(error.response?.data?.error || "Failed to load user profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>No user data found.</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">User Profile</h2>
                <div className="flex flex-col items-center space-y-4">
                    {/* Profile Picture */}
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500">
                        <img
                            src={user.profilePic ? `http://localhost:5000/${user.profilePic}` : placeholder}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Username */}
                    <div className="text-center">
                        <p className="text-gray-600">Username</p>
                        <p className="text-xl font-semibold text-gray-800">{user.username}</p>
                    </div>
                    {/* Email */}
                    <div className="text-center">
                        <p className="text-gray-600">Email</p>
                        <p className="text-xl font-semibold text-gray-800">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;