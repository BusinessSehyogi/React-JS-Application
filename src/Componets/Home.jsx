import React, { useEffect, useState } from 'react';
import logo from '../Images/logo-no-background name.png';
import { useNavigate } from 'react-router-dom';
import homepagepic from '../Images/businessperson-meeting-clip-art-transprent-png-team-work-11562903613sqceweh3yc.png';
import Signup from './Signup'; // Import the Signup component
import './home.css';

function Home() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [isSignupOpen, setIsSignupOpen] = useState(false); // State to control the signup modal

    useEffect(() => {
        const name = sessionStorage.getItem('Name');
        if (name) {
            setUsername(name);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('Token');
        sessionStorage.removeItem('Name');
        window.location.reload();
    };

    const onLogin = () => {
        navigate('/login');
    };

    const onRegister = () => {
        setIsSignupOpen(true); // Open the signup modal
    };

    const closeModal = () => {
        setIsSignupOpen(false); // Close the signup modal
    };

    return (
        <div className='home'>
            <header className='header'>
                <div className='logo'>
                    <img src={logo} alt="Logo" />
                </div>
                <nav className='nav-links'>
                    <span onClick={() => navigate('/')}>Home</span>
                    <span onClick={() => navigate('/about')}>About</span>
                    <span onClick={() => navigate('/founder')}>Founder</span>
                    <span onClick={() => navigate('/investors')}>Investor</span>
                    <span onClick={() => navigate('/reviews')}>Review</span>
                </nav>
                <div className='auth-buttons'>
                    {username ? (
                        <>
                            <span className='greeting'>{`Hello, ${username}`}</span>
                            <button className='button logout' onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className='button' onClick={onLogin}>Login</button>
                            <button className='button' onClick={onRegister}>Sign Up</button>
                        </>
                    )}
                </div>
            </header>

            <main className='main-content'>
                <div className='content'>
                    <div className='text-box'>
                        <h1>Connecting Businesses, Creating Opportunities</h1>
                        <p>
                            At Business Sehyogi, we empower small businesses by connecting them with investors who share their vision. Together, we can build a brighter future for entrepreneurship.
                        </p>
                        <button className='button get-started'>Get Started</button>
                    </div>
                    <div className='image-box'>
                        <img src={homepagepic} alt="Business Meeting" />
                    </div>
                </div>
                <section className='features'>
                    <h2>Our Features</h2>
                    <div className='feature-list'>
                        <div className='feature-item'>
                            <h3>Connect</h3>
                            <p>Link businesses with potential investors through our platform.</p>
                        </div>
                        <div className='feature-item'>
                            <h3>Invest</h3>
                            <p>Explore diverse investment opportunities tailored for you.</p>
                        </div>
                        <div className='feature-item'>
                            <h3>Grow</h3>
                            <p>Receive expert guidance and support for your business journey.</p>
                        </div>
                    </div>
                </section>
            </main>
            <footer className='footer'>
                <p>&copy; 2024 Business Sehyogi. All rights reserved.</p>
            </footer>

            {/* Signup Modal */}
            {isSignupOpen && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <button className='close-modal' onClick={closeModal}>X</button>
                        <Signup closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
