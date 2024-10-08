import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { userAuthentic } from '../../Redux/Slice/user';
import axios from 'axios';
import '../form/style.css';
import { GiJewelCrown, GiLaurelCrown } from "react-icons/gi";
import Cookies from 'js-cookie'; 
import instance from '../../../Instance/axios';
function UserLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userRole = useSelector(state => state.auth.user?.role);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        if (currentHour < 12) {
            setGreeting('Good morning');
        } else if (currentHour < 18) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await instance.post('/api/v1/login', {
                email,
                password,
            }, { withCredentials: true });


            const { data } = response;
            if (data.success) {
                const { user, token } = data;
                dispatch(userAuthentic({ user, token }));
                toast.success(data.msg, { autoClose: 3000, position: "top-center" });
                localStorage.setItem('token', token); // Storing token in localStorage
                localStorage.setItem('user', JSON.stringify(user)); 
                
                // Check user role before redirecting
                handleRedirect(user.role);

                // Clear form fields after successful submission
                setEmail('');
                setPassword('');
            } else {
                toast.error(data.msg, { autoClose: 3000, position: "top-center" });
            }
        } 
        catch (error) {
            console.error("Error during login:", error);
            toast.error(error.response?.data?.message || "An error occurred while logging in.", { autoClose: 3000, position: "top-center" });
        }
    };

    const handleRedirect = (role) => {
        switch (role) {
            case "admin":
                navigate('/admin');
                break;
            case "seller":
                navigate('/seller');
                break;
            case "user":
                navigate('/');
                break;
            default:
                navigate('/');
                break;
        }
    };


    return (
        <div className='login-container'>
          
            <div className='login'>  
                <div className='log-head'>
                    <h2>UNIFIED CART</h2>
                    <p>
                        Elevate Your Shopping Journey with Us
                        <span><GiLaurelCrown className='tag-icon'/></span>
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                <input id='email' type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' autoComplete="email" />
<input id='password' type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' autoComplete="current-password" />
            <button className='btn' type="submit">Log In</button>
                    <div className='bottom'>
                        <p>Don't have an account? </p>
                        <Link className='btn' to="/signup">Sign up</Link>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default UserLogin;
