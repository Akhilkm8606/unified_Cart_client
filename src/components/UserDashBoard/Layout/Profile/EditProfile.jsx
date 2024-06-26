import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate()
  const { id } = useParams();

  useEffect(() => {
    // Populate input fields with user details when component mounts
    setName(user.username);
    setEmail(user.email);
    setPhoneNumber(user.phone);
  }, [user]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`http://localhost:5000/updateUser/${id}`, {
        name,
        email,
        phone: phoneNumber
      }, { withCredentials: true });
      setMessage(response.data.message); // Set the message state to the response message
  
      if (response.data.success) {
        toast.success(response.data.message, { // Use response.data.message for success toast
          autoClose: 3000,
          position: "top-center"
        });
        navigate('/MyAccount')
      }
    } catch (error) {
      console.error('Error updating profile:', error); // Log the error
      toast.error(error.response.data.message, { // Use error.response.data.message for error toast
        autoClose: 3000,
        position: "top-center"
      });
    }
  };
  
  
  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          className="input-field"
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className="input-field"
        />

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="input-field"
        />

        <button type="submit" className="submit-btn">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
      <ToastContainer/>
    </div>
  );
}

export default EditProfile;
