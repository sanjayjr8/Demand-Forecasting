import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from pandas.tseries.offsets import DateOffset
import plotly.express as px
from pathlib import Path





# Page configuration
st.set_page_config(
    page_title="OptiStocks ARIMA Forecasting",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------- CSS ----------------
st.markdown(
    """
    
    <style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    section.main > div {
    padding-top: 0 !important;
}

    .stApp {
        background: radial-gradient(circle at top, #070b12 0%, #020308 45%, #000000 100%);
        color: #e6fff8;
        font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    /* HEADER */

    .header-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        background-color: #000000;
        z-index: 1000;
        box-shadow: 0 4px 24px rgba(0,0,0,0.75);
        border-bottom: 1px solid rgba(46, 255, 172, 0.2);
    }

    .header-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0.6rem 1.5rem 0.3rem 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .tagline {
        margin-top: 0.45rem;
        font-size: 0.95rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        font-weight: 600;
        text-align: center;
        background: linear-gradient(90deg, #5bffbf 0%, #37b9ff 50%, #5bffbf 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* MAIN CONTENT SPACING UNDER FIXED HEADER */
    .main-content {
        padding-top: 165px;  /* Reduced gap between tagline and content */
        padding-bottom: 90px; /* space for footer */
        max-width: 1200px;
        margin: 0 auto;
    }

    /* TITLES */

    .workspace-title {
        font-size: 2.3rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        margin-bottom: 0.3rem;
        background: linear-gradient(90deg, #a6fff2, #52ffe2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .workspace-subtitle {
        font-size: 0.98rem;
        color: #9ce6ff;
        max-width: 920px;
        line-height: 1.5;
    }

    .gradient-divider {
        width: 100%;
        height: 4px;
        margin: 1.2rem 0 1.4rem 0;
        border-radius: 999px;
        background: linear-gradient(90deg,
                    rgba(46,255,172,0.0) 0%,
                    rgba(46,255,172,0.75) 25%,
                    rgba(55,185,255,0.75) 75%,
                    rgba(55,185,255,0.0) 100%);
        box-shadow: 0 0 32px rgba(46,255,172,0.45);
    }

    /* CARDS */

    .stCard {
        background: radial-gradient(circle at top left, #151b26 0%, #050810 75%);
        border-radius: 18px;
        padding: 18px 20px 16px 20px;
        margin-bottom: 18px;
        border: 1px solid rgba(46, 255, 172, 0.3);
        box-shadow:
            0 16px 40px rgba(0,0,0,0.8),
            0 0 0 1px rgba(0,0,0,0.8),
            0 0 45px rgba(46,255,172,0.08);
    }

    .stCard h3 {
        font-size: 1.1rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 0.6rem;
        color: #a6fff2;
    }

    /* SECTION LABELS */

    .section-label {
        font-size: 0.9rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #76ffe0;
        margin-bottom: 0.25rem;
    }

    /* BUTTON */

    .stButton > button {
        background: linear-gradient(90deg, #2effac 0%, #37b9ff 100%);
        color: #020308;
        border: none;
        padding: 0.7rem 1.25rem;
        border-radius: 999px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        width: 100%;
        transition: all 0.18s ease-out;
        box-shadow:
            0 12px 30px rgba(0,0,0,0.7),
            0 0 18px rgba(46,255,172,0.5);
    }

    .stButton > button:hover {
        transform: translateY(-1px) scale(1.01);
        box-shadow:
            0 18px 40px rgba(0,0,0,0.85),
            0 0 26px rgba(55,185,255,0.6);
    }

    /* FILE UPLOADER – ensure all text is clearly visible */
    div[data-testid="stFileUploader"] * {
        color: #cffff9 !important;       /* bright aqua text */
        font-weight: 500;
    }

    div[data-testid="stFileUploader"] label {
        font-size: 0.92rem !important;
        letter-spacing: 0.03em;
    }

    /* NUMBER INPUT – make values visible */
    div[data-testid="stNumberInput"] label {
        color: #9fffe8 !important;
        font-size: 0.86rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }

    div[data-testid="stNumberInput"] input {
        color: #e8fff9 !important;       /* bright value text */
        font-weight: 600;
        font-size: 0.95rem;
    }

    div[data-testid="stNumberInput"] input::placeholder {
        color: #7cf4cf !important;
    }

    /* PLOT BACKGROUND & LEGEND TEXT */
    .js-plotly-plot .plotly .main-svg {
        font-family: "Inter", sans-serif;
    }
    .legendtext {
        fill: #bffff4 !important;
    }

    /* MODEL RESULTS – high contrast text */

    .model-results-box {
        margin-top: 1.6rem;
        padding: 18px 20px;
        border-radius: 18px;
        background: radial-gradient(circle at top left,
                    rgba(46,255,172,0.06) 0%,
                    rgba(0,0,0,0.96) 60%);
        border: 1px solid rgba(46,255,172,0.35);
        box-shadow:
            0 16px 40px rgba(0,0,0,0.85),
            0 0 32px rgba(46,255,172,0.25);
    }

    .model-results-box h3 {
        font-size: 1.1rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        margin-bottom: 0.8rem;
        color: #a6fff2;
    }

    .model-results-box, .model-results-box * {
        color: #e9fdf7 !important;   /* bright readable text */
    }

    .model-results-box pre {
        font-size: 0.82rem;
        line-height: 1.5;
        white-space: pre-wrap;
    }

    /* === FILE UPLOADER: TRANSPARENT OUTLINED STYLE === */
div[data-testid="stFileUploader"] section {
    background: transparent !important;        /* removes white fill */
    border: 1.8px solid rgba(46, 255, 172, 0.8) !important;
    border-radius: 14px;
    box-shadow: 0 0 18px rgba(46,255,172,0.25);
}

/* Text inside uploader */
div[data-testid="stFileUploader"] * {
    color: #cffff9 !important;                   /* readable aqua */
    font-weight: 500;
}

/* Drag & drop hint text */
div[data-testid="stFileUploader"] span {
    color: #baffef !important;
}

/* Browse files button text */
div[data-testid="stFileUploader"] button {
    background-color: transparent !important;
    color: #a6fff2 !important;
    border: 1px solid rgba(55,185,255,0.8);
    border-radius: 10px;
}

/* Hover state */
div[data-testid="stFileUploader"] section:hover {
    border-color: rgba(55,185,255,1) !important;
    box-shadow: 0 0 28px rgba(55,185,255,0.45);
}

/* ===== NUMBER INPUT – TRANSPARENT + VISIBLE TEXT ===== */

/* Main number input box */
div[data-testid="stNumberInput"] input {
    background: transparent !important;
    color: #e8fffb !important;          /* bright readable text */
    font-weight: 600;
    font-size: 16px;
    caret-color: #2ee6a6;               /* cursor color */
}

/* Number input container */
div[data-testid="stNumberInput"] div {
    background: transparent !important;
}

/* + / - buttons */
div[data-testid="stNumberInput"] button {
    background: transparent !important;
    color: #9afbe5 !important;
    border-left: 1px solid rgba(46,255,172,0.3);
}

/* Placeholder / hint text (like 'Press Enter to apply') */
div[data-testid="stNumberInput"] input::placeholder {
    color: rgba(180, 255, 245, 0.55) !important;
}

/* Focus state */
div[data-testid="stNumberInput"] input:focus {
    outline: none !important;
    box-shadow: 0 0 12px rgba(46,255,172,0.45);
}

/* ===== DATA PREVIEW TABLE – FULL OVERRIDE ===== */

/* Outer container (st.dataframe / st.table) */
div[data-testid="stDataFrame"],
div[data-testid="stTable"] {
    background: transparent !important;
    color: #e8fffb !important;          /* bright readable text */
    font-weight: 600;
    font-size: 16px;
    caret-color: #2ee6a6; 
    border: 1px solid rgba(46,255,172,0.4) !important;
}

/* Generic child wrappers of the dataframe */
div[data-testid="stDataFrame"] > div,
div[data-testid="stTable"] > div {
    background: transparent !important;
}

/* For newer Streamlit versions: grid wrapper */
div[data-testid="stDataFrame"] [role="grid"],
div[data-testid="stTable"] [role="grid"] {
    background: transparent !important;
    color: #cffff6 !important;
}

/* All cells inside the grid (both header & body) */
div[data-testid="stDataFrame"] [role="grid"] * ,
div[data-testid="stTable"] [role="grid"] * {
    background-color: transparent !important;
    color: #cffff6 !important;
    border-color: rgba(46,255,172,0.18) !important;
}

/* Fallback for classic <table> rendering (older versions) */
div[data-testid="stDataFrame"] table,
div[data-testid="stTable"] table {
    background: transparent !important;
    border-collapse: collapse !important;
}

/* Header cells (classic table mode) */
div[data-testid="stDataFrame"] thead th,
div[data-testid="stTable"] thead th {
    background: transparent !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    border-bottom: 1px solid rgba(46,255,172,0.5) !important;

    /* gradient text */
    background-image: linear-gradient(90deg, #2ee6a6, #4cc9ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Body cells (classic table mode) */
div[data-testid="stDataFrame"] tbody td,
div[data-testid="stTable"] tbody td {
    background: transparent !important;
    color: #cffff6 !important;
    font-weight: 500 !important;
    border-bottom: 1px solid rgba(46,255,172,0.18) !important;
}

/* Row hover highlight */
div[data-testid="stDataFrame"] tbody tr:hover,
div[data-testid="stTable"] tbody tr:hover,
div[data-testid="stDataFrame"] [role="row"]:hover,
div[data-testid="stTable"] [role="row"]:hover {
    background: rgba(46,255,172,0.06) !important;
}

/* Scrollbars inside the dataframe */
div[data-testid="stDataFrame"] *::-webkit-scrollbar,
div[data-testid="stTable"] *::-webkit-scrollbar {
    height: 8px;
}
div[data-testid="stDataFrame"] *::-webkit-scrollbar-thumb,
div[data-testid="stTable"] *::-webkit-scrollbar-thumb {
    background: rgba(46,255,172,0.6);
    border-radius: 10px;
}
div[data-testid="stDataFrame"] *::-webkit-scrollbar-track,
div[data-testid="stTable"] *::-webkit-scrollbar-track {
    background: transparent;
}
/* === MODEL RESULTS – make summary text bright and readable === */
div[data-testid="stText"] pre {
    color: #e8fffb !important;      /* bright aqua text */
    font-size: 14px !important;
    line-height: 1.5 !important;
    font-weight: 500 !important;
    text-shadow: 0 0 6px rgba(46, 255, 172, 0.35); /* subtle glow */
}

/* Optional: card-style container around the summary */
div[data-testid="stText"] {
    background: radial-gradient(circle at top left,
                                rgba(46,255,172,0.12),
                                rgba(3,10,25,0.95)) !important;
    border-radius: 20px !important;
    padding: 20px 24px !important;
    border: 1px solid rgba(46,255,172,0.4) !important;
}


    /* FOOTER */

    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: linear-gradient(90deg, #000000 0%, #02040b 40%, #000000 100%);
        color: #8bfce4;
        text-align: center;
        padding: 10px 10px 8px 10px;
        border-top: 1px solid rgba(46, 255, 172, 0.25);
        z-index: 1000;
        font-size: 0.78rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }

    .footer-icons a {
        margin: 0 8px;
        text-decoration: none;
        color: #ffffff;
        transition: transform 0.18s ease-out, color 0.18s ease-out;
    }

    .footer-icons a:hover {
        color: #2effac;
        transform: translateY(-1px) scale(1.05);
    }

    .footer-icons img {
        width: 18px;
        height: 18px;
        vertical-align: middle;
        filter: drop-shadow(0 0 6px rgba(0,0,0,0.7));
    }
    
    .tagline {
    margin-top: 8px !important;
    margin-bottom: 14px !important;
}
/* Remove Streamlit top padding */
section.main > div {
    padding-top: 0 !important;
}

/* Tighten tagline */
.tagline {
    margin: 6px 0 10px 0 !important;
}

/* Tighten section headers */
h2 {
    margin-top: 12px !important;
    margin-bottom: 10px !important;
}


    @media screen and (max-width: 768px) {
        .main-content {
            padding-top: 155px;
        }
        .workspace-title {
            font-size: 1.9rem;
        }
    }
    </style>
    """,
    unsafe_allow_html=True
)



# ---------------- Header ----------------
st.markdown('<div class="header-container"><div class="header-inner">', unsafe_allow_html=True)
BASE_DIR = Path(__file__).parent
logo_path = BASE_DIR / "About.jpg"
st.image(str(logo_path), width="stretch")
st.markdown(
    '<div class="tagline">ADVANCED TIME SERIES FORECASTING WITH ARIMA &amp; SARIMA</div>',
    unsafe_allow_html=True
)
st.markdown('</div></div>', unsafe_allow_html=True)

# ---------------- Main Content ----------------
st.markdown('<div class="main-content">', unsafe_allow_html=True)

st.markdown('<div class="workspace-title">Demand Forecasting Workspace</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="workspace-subtitle">'
    'Upload your historical sales data, tune ARIMA / SARIMA parameters and generate forward-looking '
    'demand forecasts to support smarter inventory decisions.'
    '</div>',
    unsafe_allow_html=True
)
st.markdown('<div class="gradient-divider"></div>', unsafe_allow_html=True)

# Columns
col1, col2 = st.columns([2, 3])

with col1:
    st.markdown('<div class="stCard">', unsafe_allow_html=True)
    st.markdown('<div class="section-label">Data Input</div>', unsafe_allow_html=True)
    uploaded_file = st.file_uploader("Upload your time series data (CSV)", type=["csv"])
    st.markdown('</div>', unsafe_allow_html=True)

    if uploaded_file is not None:
        st.markdown('<div class="stCard">', unsafe_allow_html=True)
        st.markdown('<div class="section-label">Model Parameters</div>', unsafe_allow_html=True)

        p = st.number_input("AR(p) Order", min_value=0, max_value=5, value=1)
        d = st.number_input("Differencing (d)", min_value=0, max_value=2, value=1)
        q = st.number_input("MA(q) Order", min_value=0, max_value=5, value=1)
        seasonal_p = st.number_input("Seasonal AR Order (P)", min_value=0, max_value=5, value=1)
        seasonal_d = st.number_input("Seasonal Differencing (D)", min_value=0, max_value=2, value=1)
        seasonal_q = st.number_input("Seasonal MA Order (Q)", min_value=0, max_value=5, value=1)
        seasonal_m = st.number_input("Seasonal Period (M)", min_value=1, max_value=12, value=12)
        seasonal_order = (int(seasonal_p), int(seasonal_d), int(seasonal_q), int(seasonal_m))

        if st.button("Generate Forecast"):
            st.session_state["run_forecast"] = True
        st.markdown('</div>', unsafe_allow_html=True)
    else:
        st.session_state["run_forecast"] = False

with col2:
    if uploaded_file is not None:
        df = pd.read_csv(uploaded_file)
        try:
            df.columns = ["Month", "Sales"]
            df["Month"] = pd.to_datetime(df["Month"], errors="coerce")
            df.dropna(subset=["Month"], inplace=True)
            df.set_index("Month", inplace=True)

            st.markdown('<div class="stCard">', unsafe_allow_html=True)
            st.markdown('<div class="section-label">Data Preview</div>', unsafe_allow_html=True)
            st.dataframe(df.head(), use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

            st.markdown('<div class="stCard">', unsafe_allow_html=True)
            st.markdown('<div class="section-label">Time Series Visualization</div>', unsafe_allow_html=True)
            fig = px.line(
                df,
                x=df.index,
                y="Sales",
                title="Time Series Visualization",
                labels={"Sales": "Sales", "Month": "Time"},
            )
            fig.update_layout(
                plot_bgcolor="rgba(0,0,0,0)",
                paper_bgcolor="rgba(0,0,0,0)",
                font=dict(color="#ccfff6"),
                title_font=dict(color="#9fffe8", size=16),
            )
            fig.update_traces(mode="lines+markers")
            st.plotly_chart(fig, use_container_width=True)
            st.markdown("</div>", unsafe_allow_html=True)

            # Run forecast only when requested
            if st.session_state.get("run_forecast"):
                with st.spinner("Training model and generating forecast..."):
                    model = sm.tsa.statespace.SARIMAX(
                        df["Sales"],
                        order=(int(p), int(d), int(q)),
                        seasonal_order=seasonal_order,
                    )
                    results = model.fit()

                    # MODEL RESULTS (high-contrast box)
                    st.markdown('<div class="model-results-box">', unsafe_allow_html=True)
                    st.markdown("<h3>Model Results</h3>", unsafe_allow_html=True)
                    st.text(results.summary())
                    st.markdown("</div>", unsafe_allow_html=True)

                    # Forecast
                    future_dates = [df.index[-1] + DateOffset(months=x) for x in range(1, 25)]
                    future_df = pd.DataFrame(index=future_dates, columns=df.columns)
                    forecast = results.predict(start=len(df), end=len(df) + 24, dynamic=True)

                    df["forecast"] = results.predict(start=0, end=len(df) - 1, dynamic=True)
                    future_df["forecast"] = forecast
                    combined_df = pd.concat([df[["Sales", "forecast"]], future_df[["forecast"]]])

                    st.markdown('<div class="stCard">', unsafe_allow_html=True)
                    st.markdown('<div class="section-label">Forecast Results</div>', unsafe_allow_html=True)
                    fig_forecast = px.line(
                        combined_df,
                        title="Forecast Results",
                        labels={"value": "Value", "index": "Time"},
                    )
                    fig_forecast.update_layout(
                        plot_bgcolor="rgba(0,0,0,0)",
                        paper_bgcolor="rgba(0,0,0,0)",
                        font=dict(color="#ccfff6"),
                        title_font=dict(color="#9fffe8", size=16),
                    )
                    fig_forecast.update_traces(mode="lines+markers")
                    st.plotly_chart(fig_forecast, use_container_width=True)
                    st.markdown("</div>", unsafe_allow_html=True)

        except Exception as e:
            st.error(f"Error: {e}")

st.markdown("</div>", unsafe_allow_html=True)

# ---------------- Footer ----------------
st.markdown(
    """
    <div class="footer">
        <div>Powered by OptiStocks &nbsp;|&nbsp; © 2024</div>
        <div class="footer-icons">
            <a href="https://github.com/sanjayjr8" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" />
            </a>
            <a href="https://www.linkedin.com/in/sanjayj08/" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" />
            </a>
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)
