import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {LoginPage} from './pages/LoginPage';
import {SignupPage} from './pages/SignupPage';
import {MedicalParamsPage} from "./pages/MedicalParamsPage.jsx";

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link> | <Link to="/params">Parameters</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/params" element={<MedicalParamsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;