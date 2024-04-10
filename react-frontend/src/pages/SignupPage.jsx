import React, {useState} from 'react';
import axios from 'axios';
import "./SignupPage.scss";

export function SignupPage() {
    const [formData, setFormData] = useState({
        email: '',
        login: '',
        password: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const graphqlQuery = {
            query: `
                mutation CreateUser($email: String!, $login: String!, $password: String!) {
                    createUser(email: $email, login: $login, password: $password) {
                        email
                        login
                    }
                }
            `,
            variables: {
                email: formData.email,
                login: formData.login,
                password: formData.password,
            }
        };

        try {
            const response = await axios.post('http://localhost:4000/graphql', graphqlQuery, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Signup success:', response.data);
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    return (
        <div className="signup-container">
            <h2>Signup Page</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                           required/>
                </div>
                <div className="form-group">
                    <label htmlFor="login">Login:</label>
                    <input type="text" id="login" name="login" value={formData.login} onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password}
                           onChange={handleChange} required/>
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
        </div>
    );
}