// src/components/Navigationbar.jsx
import React, { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";


import logo from "../assets/wide_logo.png";          // ✅ new wide logo
import "../styles/components/Forms/Navigationbar.css";    // ✅ IMPORTANT: CSS import

import ContactForm from "../components/Forms/Contactform";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Navigationbar() {
  const navigate = useNavigate();

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

  const handleScrollToFeatures = () => {
    const section = document.getElementById("features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
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
    fontSize: "1.05rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 0 10px rgba(0, 255, 170, 0.15)",
    margin: "0 0.5rem",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <header className="app_header">
        <div className="header sora">
          <div
  className="header_left"
  onClick={() => navigate("/dashboard/companies")}
  style={{ cursor: "pointer" }}
>
            <img
              src={logo}
              className="left_logo"
              alt="OptiStocks Logo"
              style={{
                height: "110px",     // ✅ hard clamp so it *must* be small
                width: "auto",
                display: "block",
              }}
            />
          </div>

          <div className="header_right">
            {isHomeRoute && (
              <button
                style={buttonStyle}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#00c66f")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
                onClick={handleScrollToFeatures}
              >
                Features
              </button>
            )}

            <button
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#00c66f")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
              onClick={openContactForm}
            >
              Contact Us
            </button>

            {user && (
              <button
                style={buttonStyle}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#00c66f")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
                onClick={handleClick}
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
