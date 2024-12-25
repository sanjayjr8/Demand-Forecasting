import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
from pandas.tseries.offsets import DateOffset

# Custom CSS for a professional look
st.markdown("""
    <style>
    /* Overall layout adjustments */
    .main {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 8px;
    }
    
    /* Title styling */
    h1 {
        color: #004d99;
        text-align: center;
        font-family: 'Arial', sans-serif;
    }

    /* Dataframe and Chart styling */
    .css-1aumxhk {
        background-color: white;
        border-radius: 10px;
        padding: 10px;
        margin-top: 20px;
    }
    
    /* Button and number input styling */
    button {
        background-color: #007acc;
        color: white;
        border-radius: 5px;
        font-size: 18px;
        padding: 10px;
        margin-top: 20px;
    }

    .stNumberInput {
        border: 1px solid #007acc;
        border-radius: 5px;
        padding: 5px;
    }

    /* File uploader customization */
    .css-13sdm1d {
        border: 1px solid #007acc;
        border-radius: 10px;
        padding: 10px;
        background-color: #e6f7ff;
    }

    /* Footer credits */
    footer {
        visibility: hidden;
    }

    .footer::before {
        visibility: visible;
        content: 'ARIMA Forecasting Web App | Designed by [Your Name]';
        display: block;
        position: relative;
        color: gray;
        font-size: 12px;
        text-align: center;
        margin-top: 30px;
    }
    </style>
""", unsafe_allow_html=True)

# App title
st.title("ARIMA and Seasonal ARIMA Forecasting")

# File upload section
uploaded_file = st.file_uploader("Upload a CSV file", type=["csv"])
if uploaded_file is not None:
    # Read and process the CSV
    df = pd.read_csv(uploaded_file)
    st.write("Data Preview:")
    st.dataframe(df.head())

    df.columns = ["Month", "Sales"]
    df['Month'] = pd.to_datetime(df['Month'], errors='coerce')
    df.dropna(subset=['Month'], inplace=True)
    df.set_index('Month', inplace=True)

    st.write("Time Series Data:")
    st.line_chart(df['Sales'])

    # ARIMA parameters input
    p = st.number_input("AR(p) Order", min_value=0, max_value=5, value=1)
    d = st.number_input("Differencing (d)", min_value=0, max_value=2, value=1)
    q = st.number_input("MA(q) Order", min_value=0, max_value=5, value=1)
    seasonal_order = (
        st.number_input("Seasonal AR Order", min_value=0, max_value=5, value=1),
        st.number_input("Seasonal Differencing", min_value=0, max_value=2, value=1),
        st.number_input("Seasonal MA Order", min_value=0, max_value=5, value=1),
        12  # Seasonal period
    )

    # Model training and forecasting
    if st.button("Train Model"):
        model = sm.tsa.statespace.SARIMAX(df['Sales'], 
                                          order=(p, d, q), 
                                          seasonal_order=seasonal_order)
        results = model.fit()
        st.write("Model Summary:")
        st.write(results.summary())

        future_dates = [df.index[-1] + DateOffset(months=x) for x in range(1, 25)]
        future_df = pd.DataFrame(index=future_dates, columns=df.columns)

        forecast = results.predict(start=len(df), end=len(df) + 24, dynamic=True)
        df['forecast'] = results.predict(start=0, end=len(df) - 1, dynamic=True)
        future_df['forecast'] = forecast

        combined_df = pd.concat([df[['Sales', 'forecast']], future_df[['forecast']]])

        st.write("Forecasted Data:")
        st.line_chart(combined_df)
