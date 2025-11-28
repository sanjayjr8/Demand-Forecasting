import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/components/Forms/ButtonBar.css";


export default function ButtonBar({ companyId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <div className="buttonbar-wrapper">
      <div className="buttonbar-rail">
        <button
          className={`buttonbar-btn ${
            isActive(`/dashboard/companies/${companyId}/stocks`) ? "active" : ""
          }`}
          onClick={() =>
            navigate(`/dashboard/companies/${companyId}/stocks`)
          }
        >
          Stocks
        </button>

        <button
          className={`buttonbar-btn ${
            isActive(`/dashboard/companies/${companyId}/data`) ? "active" : ""
          }`}
          onClick={() =>
            navigate(`/dashboard/companies/${companyId}/data`)
          }
        >
          Analytics
        </button>

        <button
          className={`buttonbar-btn ${
            isActive(`/dashboard/companies/${companyId}/prediction`) ? "active" : ""
          }`}
          onClick={() =>
            navigate(`/dashboard/companies/${companyId}/prediction`)
          }
        >
          Prediction
        </button>

        <button
          className={`buttonbar-btn ${
            isActive(`/dashboard/companies/${companyId}/chat`) ? "active" : ""
          }`}
          onClick={() =>
            navigate(`/dashboard/companies/${companyId}/chat`)
          }
        >
          Chat
        </button>

        <button
          className="buttonbar-btn forecast"
          onClick={() =>
            window.open(
              "https://optistocks-demand-forecasting.streamlit.app/",
              "_blank"
            )
          }
        >
          Forecast
        </button>
      </div>
    </div>
  );
}
