import React, { useState } from 'react';
import axios from 'axios';
import "./LoginPage.scss";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/vitals', formData);
            console.log('Login Response:', response.data);

            // Save token to cookies
            if(response.data.token){
                Cookies.set('token', response.data.token);
                console.log('Token has been successfully saved')

                navigate("/params");
            }

        } catch (error) {
            console.error('Login Error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Login Page</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="login">Login:</label>
                    <input type="text" id="login" name="login" value={formData.login} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="login-button">Log In</button>
            </form>
        </div>
    );
}
