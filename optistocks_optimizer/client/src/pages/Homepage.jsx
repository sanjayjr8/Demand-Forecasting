import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from "../assets/logo1.png";
import linkedin from "../assets/linkedin.svg";
import "../styles/static/Homepage.css";

export default function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize AOS with custom settings
    AOS.init({
      duration: 800,
      offset: 100,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  const handleGetStartedClick = () => {
    navigate("/auth/signup");
  };

  // Animation variants for features
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="app_container">
      {/*<motion.header 
        className="header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="header_logo"
        >
         <img src={logo} alt="OptiStocks Logo" className="logo_image" />
        </motion.div>
        
        <div className="header_buttons">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#00ffaa" }}
            whileTap={{ scale: 0.95 }}
            className="contact_button"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="nav_button"
            onClick={handleGetStartedClick}
          >
            Get Started
          </motion.button>
        </div>
      </motion.header> 
      */}

      <main className="hero_section">
        <div className="hero_content">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero_title"
          >
            Revolutionize Your <br /> 
            <span className="gradient_text">Inventory Management</span> <br /> 
            with OptiStocks
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero_description"
          >
            The ultimate solution for seamless Inventory management and
            demand forecasting. Say goodbye to stockouts and overstocking,
            and embrace a smarter way to manage your inventory with OptiStocks
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="cta_button" onClick={handleGetStartedClick}>
              Start Optimizing Now
            </button>
          </motion.div>
        </div>

        <div className="hero_animation">
          {/* Replace with your preferred animation */}
          <lottie-player
            src="https://assets2.lottiefiles.com/packages/lf20_qp1q7mct.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
      </main>
      

      <section className="features_section" id="features">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="features_container"
        >
          <motion.div 
            className="section_header"
            variants={itemVariants}
          >
            <h2 className="section_title">What We Bring to the Table?</h2>
            <p className="section_description">
            An all-inclusive stock management solution crafted to simplify your processes and increase operational effectiveness.
            </p>
          </motion.div>

          <div className="features_grid">
            {[
              {  
                "title": "Real-Time Inventory Monitoring",  
                "content": "Keep track of your inventory levels as they change. Our system offers precise and immediate updates on stock availability, ensuring you’re always stocked with necessary items."  
              },  
              {  
                "title": "Streamlined Order Processing",  
                "content": "Enhance your order management with our automated systems. From creating purchase orders to processing sales orders, our application simplifies the workflow, minimizing manual tasks and reducing the risk of errors."  
              },  
              {  
                "title": "Comprehensive Analytics and Reporting",  
                "content": "Unlock crucial insights into your business with our powerful reporting features. Examine sales patterns, track inventory status, and make informed decisions to enhance your inventory management."  
              },  
              {  
                "title": "Demand Forecasting",  
                "content": "Utilize our sophisticated forecasting tools to predict customer demand accurately. By analyzing historical data and trends, you can ensure optimal inventory levels and improve customer satisfaction."  
              },  
              {  
                "title": "SARIMA Models for Sales Forecasting",  
                "content": "Leverage SARIMA (Seasonal Autoregressive Integrated Moving Average) models to enhance your sales predictions. This advanced statistical approach helps you account for seasonality and trends, leading to more accurate forecasting and better inventory planning."  
              },  
              {  
                "title": "Proactive Inventory Management",  
                "content": "Our application empowers you to proactively manage your stock by providing insights into future trends. Anticipate changes in demand and adjust your inventory strategy accordingly to avoid stockouts and overstock situations."  
              } 
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="blocks_block"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(0, 255, 170, 0.2)"
                }}
              >
                <h3 className="block_heading">{feature.title}</h3>
                <p className="block_content">{feature.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <footer className="footer">
        <div className="footer_content">
          <div className="footer_brand">
            <img src={logo} className="footer_logo" alt="OptiStocks Logo" />
          </div>
          
          <div className="footer_links">
            <h3 className="footer_title">Find Us</h3>
            <ul className="social_links">
              <li>
                <a
                  href="https://www.linkedin.com/in/shaurya--jha/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social_link"
                >
                  SANJAY J
                  <img src={linkedin} className="linkedin_icon" alt="LinkedIn" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer_bottom">
          <p>© 2024 OptiStocks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}