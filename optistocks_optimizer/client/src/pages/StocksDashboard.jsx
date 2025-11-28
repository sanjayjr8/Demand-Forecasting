import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/static/StocksDashboard.css";
import StockForm from "../components/Forms/StocksForm";
import ButtonBar from "../components/ButtonBar";
import { useCompaniesContext } from "./../hooks/useCompaniesContext";
import { useAuthContext } from "./../hooks/useAuthContext";

export default function StocksDashboard() {
  const { companyId } = useParams();
  const [stocks, setStocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { dispatch } = useCompaniesContext();
  const { user } = useAuthContext();

  const fetchStocks = async () => {
    try {
      const response = await fetch(
        `https://optistocks-optimizer.onrender.com/api/dashboard/companies/${companyId}/stocks`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setStocks(json);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
    }
  };

  useEffect(() => {
    if (user && companyId) {
      fetchStocks();
    }
  }, [user, companyId, dispatch]);

  useEffect(() => {
    if (showForm) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showForm]);

  const handleFormClose = () => {
    setShowForm(false);
    fetchStocks();
  };

  return (
    <>
      <div className="global"></div>
      <main className="app_stocks_dashboard">
        <ButtonBar companyId={companyId} />

        {/* header */}
        <div className="stocks_dashboard_heading sora">
          <div className="stocks_dashboard_heading_text">
            <h1 className="stocks-title">Inventory Lanes</h1>
            <p className="stocks-subtitle outfit">
              Each product moves through your supply chain as a container. Track
              its current stock, sales and pricing at a glance.
            </p>
          </div>

          <button
            className="stocks_dashboard_button sora"
            onClick={() => setShowForm(true)}
          >
            + Add Stock
          </button>
        </div>

        {/* container rows */}
        <div className="stocks_dashboard">
          <div className="stocks_dashboard_blocks">
            {stocks.map((stock, index) => (
              <div className="stocks_dashboard_block" key={stock._id || index}>
                <div className="stock-row-header">
                  <span className="stock-row-index">#{index + 1}</span>
                </div>

                <div className="stock-row-layout">
                  {/* SVG Hanging Container */}
                  <svg
                    className="stock-container-svg"
                    viewBox="0 0 260 160"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* vertical crane line */}
                    <line
                      x1="130"
                      y1="0"
                      x2="130"
                      y2="30"
                      className="crane-line"
                    />
                    {/* crane block */}
                    <rect
                      x="122"
                      y="30"
                      width="16"
                      height="18"
                      rx="3"
                      className="crane-block"
                    />

                    {/* side cables */}
                    <path d="M130 48 L80 70" className="crane-cable" />
                    <path d="M130 48 L180 70" className="crane-cable" />

                    {/* container group (swaying) */}
                    <g className="container-sway">
                      <rect
                        x="50"
                        y="70"
                        width="160"
                        height="60"
                        rx="6"
                        className="container-body"
                      />

                      {/* vertical stripes */}
                      {Array.from({ length: 7 }).map((_, i) => (
                        <rect
                          key={i}
                          x={55 + i * 20}
                          y="72"
                          width="10"
                          height="56"
                          className="container-stripe"
                        />
                      ))}

                      {/* label pill with stock name */}
                      <rect
                        x="70"
                        y="85"
                        width="120"
                        height="30"
                        rx="15"
                        className="container-label-rect"
                      />
                      <text
                        x="130"
                        y="104"
                        textAnchor="middle"
                        className="container-label-text"
                      >
                        {stock.name}
                      </text>
                    </g>
                  </svg>

                  {/* Info boxes */}
                  <div className="stock-meta-grid">
                    <div className="stock-meta-box">
                      <div className="stock-meta-label outfit">
                        Total Units
                      </div>
                      <div className="stock-meta-value sora">
                        {stock.totalUnits}
                      </div>
                    </div>
                    <div className="stock-meta-box">
                      <div className="stock-meta-label outfit">Units Sold</div>
                      <div className="stock-meta-value sora">
                        {stock.unitsSold}
                      </div>
                    </div>
                    <div className="stock-meta-box">
                      <div className="stock-meta-label outfit">
                        Price / Unit
                      </div>
                      <div className="stock-meta-value sora">
                        {stock.pricePerUnit}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stocks_dashboard_block_footer outfit">
                  <span className="stocks_pill">Open analytics →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {showForm && <StockForm onClose={handleFormClose} />}
    </>
  );
}
