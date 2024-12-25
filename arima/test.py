import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
from pandas.tseries.offsets import DateOffset

# Page configuration
st.set_page_config(
    page_title="OptiStocks ARIMA Forecasting",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    /* Reset and base styles */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    /* Main app container */
    .stApp {
        background-color: #0e1117;
        color: #ffffff;
        min-height: 100vh;
        padding: 200px 0 80px 0;  /* Space for header and footer */
    }

    /* Fixed Header */
    .header-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        background-color: #000000;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .logo-container {
        width: 100%;
        height: 150px;
        overflow: hidden;
    }

    .logo-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .tagline-container {
        width: 100%;
        padding: 15px 0;
        background: linear-gradient(to right, #000000, #1a1a1a);
        border-top: 1px solid #333;
        border-bottom: 1px solid #333;
    }

    .tagline {
        font-family: 'Segoe UI', sans-serif;
        font-size: 1.5rem;
        text-align: center;
        background: linear-gradient(90deg, #4299e1 0%, #667eea 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
        padding: 0;
    }

    /* Main Content Area */
    .main-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    /* Cards */
    .stCard {
        background-color: #1a202c;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        border: 1px solid #2d3748;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Section Headers */
    .section-header {
        color: #4299e1;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #4299e1;
    }

    /* File Uploader */
    .uploadedFile {
        background-color: #2d3748;
        border-radius: 8px;
        padding: 15px;
        border: 1px dashed #4299e1;
    }

    /* Data Display */
    .dataframe {
        background-color: #2d3748 !important;
        color: white !important;
        border-radius: 8px;
        margin-top: 10px;
    }

    /* Charts */
    .stChart {
        background-color: #1a202c;
        border-radius: 8px;
        padding: 15px;
        border: 1px solid #2d3748;
    }

    /* Inputs */
    .stNumberInput input {
        background-color: #2d3748;
        color: white;
        border: 1px solid #4299e1;
        border-radius: 5px;
        padding: 8px;
    }

    /* Buttons */
    .stButton > button {
        background: linear-gradient(90deg, #4299e1 0%, #667eea 100%);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: 600;
        width: 100%;
        transition: all 0.3s ease;
    }

    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
    }

    /* Fixed Footer */
    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #1a202c;
        color: #4299e1;
        text-align: center;
        padding: 15px;
        border-top: 1px solid #2d3748;
        z-index: 1000;
    }
            
    .footer-icons a {
            margin: 0 10px;
            text-decoration: none;
            color: #ffffff;
            transition: color 0.3s ease;
        }

        .footer-icons a:hover {
            color: #007acc; /* LinkedIn/GitHub hover color */
        }

        .footer-icons img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
        }

    /* Hide Streamlit Elements */
    #MainMenu {visibility: hidden;}
    header {visibility: hidden;}
    footer {visibility: hidden;}
    [data-testid="stToolbar"] {visibility: hidden;}

    /* Responsive Design */
    @media screen and (max-width: 768px) {
        .stApp {
            padding-top: 150px;
        }

        .logo-container {
            height: 100px;
        }

        .tagline {
            font-size: 1.2rem;
        }
    }
    </style>
""", unsafe_allow_html=True)

# Fixed Header
import streamlit as st  

# Create a container for the header  
st.markdown('<div class="header-container">', unsafe_allow_html=True)  

# Create a wrapper for the logo  
st.markdown('<div class="logo-wrapper">', unsafe_allow_html=True)  

# Add the logo image  
st.image("About.jpg", caption="Company Logo", use_container_width=True)  # Ensure About.jpg is in the same directory as your script  

# Close the logo wrapper  
st.markdown("</div>", unsafe_allow_html=True)  

# Add the tagline  
st.markdown('<h1 class="tagline">Advanced Time Series Forecasting with ARIMA & SARIMA</h1>', unsafe_allow_html=True)  

# Close the header container  
st.markdown("</div>", unsafe_allow_html=True)
# Main Content Container
st.markdown('<div class="main-content">', unsafe_allow_html=True)

# Create two columns for layout
col1, col2 = st.columns([2, 3])

with col1:
    # Data Input Card
    st.markdown('<div class="stCard">', unsafe_allow_html=True)
    st.markdown('<h3 class="section-header">Data Input</h3>', unsafe_allow_html=True)
    st.markdown('<h4 style="color: white;">Upload your time series data (CSV)</h2>', unsafe_allow_html=True)
    uploaded_file = st.file_uploader("", type=["csv"])
    st.markdown('</div>', unsafe_allow_html=True)

    if uploaded_file is not None:
        # Model Parameters Card
        st.markdown('<div class="stCard">', unsafe_allow_html=True)
        st.markdown('<h3 class="section-header">Model Parameters</h3>', unsafe_allow_html=True)
        
        # ARIMA Parameters
        p = st.number_input("AR(p) Order", min_value=0, max_value=5, value=1,
                           help="Autoregressive order - Number of lag observations")
        d = st.number_input("Differencing (d)", min_value=0, max_value=2, value=1,
                           help="Differencing degree - Number of times to difference data")
        q = st.number_input("MA(q) Order", min_value=0, max_value=5, value=1,
                           help="Moving average order - Size of moving average window")
        
        # Seasonal Components
        st.markdown('<h4 style="color: #4299e1; margin-top: 20px;">Seasonal Components</h4>', 
                   unsafe_allow_html=True)
        
        seasonal_order = (
            st.number_input("Seasonal AR Order", min_value=0, max_value=5, value=1),
            st.number_input("Seasonal Differencing", min_value=0, max_value=2, value=1),
            st.number_input("Seasonal MA Order", min_value=0, max_value=5, value=1),
            
        )
        st.markdown('</div>', unsafe_allow_html=True)

with col2:
    if uploaded_file is not None:
        # Read and process the CSV
        df = pd.read_csv(uploaded_file)
        
        # Data Preview Card
        st.markdown('<div class="stCard">', unsafe_allow_html=True)
        st.markdown('<h3 class="section-header">Data Preview</h3>', unsafe_allow_html=True)
        st.dataframe(df.head(), use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

        # Process data
        df.columns = ["Month", "Sales"]
        df['Month'] = pd.to_datetime(df['Month'], errors='coerce')
        df.dropna(subset=['Month'], inplace=True)
        df.set_index('Month', inplace=True)

        # Time Series Visualization Card
        st.markdown('<div class="stCard">', unsafe_allow_html=True)
        st.markdown('<h3 class="section-header">Time Series Visualization</h3>', unsafe_allow_html=True)
        st.line_chart(df['Sales'])
        st.markdown('</div>', unsafe_allow_html=True)

        # Model Training and Forecasting
        if st.button("Generate Forecast", key="forecast_button"):
            with st.spinner('Training model and generating forecast...'):
                # Train SARIMA model
                model = sm.tsa.statespace.SARIMAX(df['Sales'],
                                                order=(p, d, q),
                                                seasonal_order=seasonal_order)
                results = model.fit()

                # Model Results Card
                st.markdown('<div class="stCard">', unsafe_allow_html=True)
                st.markdown('<h3 class="section-header">Model Results</h3>', unsafe_allow_html=True)
                st.write(results.summary())
                st.markdown('</div>', unsafe_allow_html=True)

                # Generate forecast
                future_dates = [df.index[-1] + DateOffset(months=x) for x in range(1, 25)]
                future_df = pd.DataFrame(index=future_dates, columns=df.columns)
                
                forecast = results.predict(start=len(df), end=len(df) + 24, dynamic=True)
                df['forecast'] = results.predict(start=0, end=len(df) - 1, dynamic=True)
                future_df['forecast'] = forecast
                
                combined_df = pd.concat([df[['Sales', 'forecast']], future_df[['forecast']]])

                # Forecast Results Card
                st.markdown('<div class="stCard">', unsafe_allow_html=True)
                st.markdown('<h3 class="section-header">Forecast Results</h3>', unsafe_allow_html=True)
                st.line_chart(combined_df)
                st.markdown('</div>', unsafe_allow_html=True)

# Close main content
st.markdown('</div>', unsafe_allow_html=True)

# Fixed Footer
st.markdown("""
     <div class="footer">
        <div>Powered by OptiStocks | © 2024</div>
        <div class="footer-icons">
            <a href="https://github.com/your-github-profile" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub">
            </a>
            <a href="https://linkedin.com/in/your-linkedin-profile" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn">
            </a>
        </div>
    </div>
""", unsafe_allow_html=True)