import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './MedicalParamsPage.scss'
import axios from "axios";

export function MedicalParamsPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({bloodType:'', weight:'', height:''});

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const getUserData = async () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const response = await axios.post('http://localhost:4000/api/user/medical', { token: token });
                console.log(response.data)
                setFormData({
                    bloodType: response.data.bloodType,
                    weight: response.data.weight.value,
                    height: response.data.height.value
                });
            } catch(error) {
                console.error('Could not retrieve user data:', error);
            }
        } else {
            navigate('/login');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            // Format data as per schema
            const newData = {
                bloodType: formData.bloodType,
                weight: {
                    value: Number(formData.weight),
                    unit: 'kg'
                },
                height: {
                    value: Number(formData.height),
                    unit: 'cm'
                }
            };
            const response = await axios.patch('http://localhost:4000/api/user/medical', {
                token: token,
                ...newData
            });
        } catch (error) {
            console.error('Could not update user data: ', error);
        }
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if(!token) navigate('/login');
        getUserData();
    }, [navigate]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Blood Type:
                    <select name="bloodType" value={formData.bloodType} onChange={handleChange}>
                        <option value="">Select...</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </label>

                <label>
                    Weight:
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
                </label>

                <label>
                    Height:
                    <input type="number" name="height" value={formData.height} onChange={handleChange} />
                </label>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}