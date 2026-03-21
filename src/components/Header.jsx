import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './header.css';

function Navbar(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav>
                <div className="logo">
                    NzenXR
                </div>
                <div className={`navItems ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="link" onClick={closeMenu}>Home</Link>
                    <Link to="/gallery" className="link" onClick={closeMenu}>Gallery</Link> 
                    <Link to="/about" className="link" onClick={closeMenu}>Contacts</Link>
                </div>
                <div className="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </>
    )
}

export default Navbar;