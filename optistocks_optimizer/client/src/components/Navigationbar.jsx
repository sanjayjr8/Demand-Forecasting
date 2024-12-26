import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";
import ContactForm from "../components/Forms/Contactform";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Navigationbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const location = useLocation();

  const handleClick = () => {
    logout();
  };

  const openContactForm = (e) => {
    e.preventDefault();
    setIsContactFormOpen(true);
  };

  const closeContactForm = () => {
    setIsContactFormOpen(false);
  };

  const handleReload = () => {  
    const section = document.getElementById("features");  
    if (section) {  
        section.scrollIntoView({ behavior: 'smooth' });  
    }  
};  

  const isHomeRoute = location.pathname === "/";

  const buttonStyle = {  
    backgroundColor: "transparent",  
    color: "hsl(160, 100%, 50%)",  
    border: "2px solid hsl(160, 100%, 50%)",  
    padding: "0.8rem 2rem",  
    borderRadius: "30px",  
    fontWeight: "600",  
    fontSize: "1.1rem",  
    cursor: "pointer", // Corrected: Added quotes for cursor value  
    transition: "all 0.3s ease, background-color 0.3s ease", // Combined transitions  
    boxShadow: "0 0 10px rgba(0, 255, 170, 0.1)",  
    margin: "0 10px", // Adds spacing between buttons  
};

  return (
    <>
      <header className="app_header">
        <div className="header sora">
          <div
            className="header_left"
            onClick={handleReload}
            style={{ cursor: "pointer" }}
          >
            <img src={logo} className="left_logo" alt="Logo" />
          
          </div>
          <div
            className="header_right"
            style={{
              display: "flex", // Flexbox for horizontal alignment
              alignItems: "center", // Centers buttons vertically
            }}
          >
            {isHomeRoute && (
              
              <button
              onClick={handleReload}
                style={buttonStyle}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#32cd32")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "green")
                }
              >
                Features
              </button>
            )}
            <button
              style={buttonStyle}
              whileHover={{ scale: 1.05, backgroundColor: "#00ffaa" }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#32cd32")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "green")
              }
              onClick={openContactForm}
            >
              Contact Us
            </button>
            {user && (
              <button
                style={buttonStyle}
                onClick={handleClick}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#32cd32")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "green")
                }
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <ContactForm isOpen={isContactFormOpen} onClose={closeContactForm} />
    </>
  );
}
