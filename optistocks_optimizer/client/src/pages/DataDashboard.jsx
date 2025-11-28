import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/static/DataDashboard.css";
import ButtonBar from "../components/ButtonBar";
import { useAuthContext } from "./../hooks/useAuthContext";

export default function DataDashboard() {
  const { user } = useAuthContext();
  const { companyId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://optistocks-optimizer.onrender.com/api/dashboard/companies/data/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const json = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setData(json);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && companyId) {
      fetchData();
    }
  }, [user, companyId]);

  if (error) {
    return <div className="data_error outfit">Error: {error}</div>;
  }

  return (
    <>
      <div className="global"></div>
      <main className="app_data_dashboard">
        <ButtonBar companyId={companyId} />

        <section className="data_dashboard_header sora">
          <div className="data_dashboard_heading_text">
            <h1 className="data_title">Analytics Dashboard</h1>
            <p className="data_subtitle outfit">
              High-level view of your inventory performance – top movers,
              laggards, overall revenue and how efficiently stock is turning.
            </p>
          </div>
        </section>

        <section className="data_dashboard">
          {loading && (
            <div className="data_loading outfit">
              <div className="data_skeleton-row" />
              <div className="data_skeleton-row" />
              <div className="data_skeleton-row" />
              <div className="data_skeleton-row" />
            </div>
          )}

          {!loading && data && (
            <div className="data_dashboard_blocks">
              {/* Top selling product */}
              <div className="data_tile data_tile--primary">
                <div className="data_tile_header">
                  <span className="data_tile_label outfit">
                    Top Selling Product
                  </span>
                  <span className="data_badge data_badge--success outfit">
                    High demand
                  </span>
                </div>
                <div className="data_tile_value sora">
                  {data.topSellingProduct.name}
                </div>
                <div className="data_tile_metrics">
                  <div className="data_metric">
                    <span className="data_metric_label outfit">
                      Units Sold
                    </span>
                    <span className="data_metric_value sora">
                      {data.topSellingProduct.unitsSold}
                    </span>
                  </div>
                  <div className="data_metric">
                    <span className="data_metric_label outfit">Revenue</span>
                    <span className="data_metric_value sora">
                      ₹
                      {data.topSellingProduct.unitsSold *
                        data.topSellingProduct.pricePerUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Least selling product */}
              <div className="data_tile data_tile--secondary">
                <div className="data_tile_header">
                  <span className="data_tile_label outfit">
                    Least Selling Product
                  </span>
                  <span className="data_badge data_badge--warning outfit">
                    Needs attention
                  </span>
                </div>
                <div className="data_tile_value sora">
                  {data.leastSellingProduct.name}
                </div>
                <div className="data_tile_metrics">
                  <div className="data_metric">
                    <span className="data_metric_label outfit">
                      Units Sold
                    </span>
                    <span className="data_metric_value sora">
                      {data.leastSellingProduct.unitsSold}
                    </span>
                  </div>
                  <div className="data_metric">
                    <span className="data_metric_label outfit">Revenue</span>
                    <span className="data_metric_value sora">
                      ₹
                      {data.leastSellingProduct.unitsSold *
                        data.leastSellingProduct.pricePerUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total net revenue */}
              <div className="data_tile">
                <div className="data_tile_header">
                  <span className="data_tile_label outfit">
                    Total Net Revenue
                  </span>
                </div>
                <div className="data_tile_value sora">
                  ₹ {data.totalNetRevenue}
                </div>
                <p className="data_tile_hint outfit">
                  Sum of all products’ sales based on current stock records.
                </p>
              </div>

              {/* Inventory turnover */}
              <div className="data_tile">
                <div className="data_tile_header">
                  <span className="data_tile_label outfit">
                    Inventory Turnover
                  </span>
                  <span className="data_badge data_badge--neutral outfit">
                    cycles / period
                  </span>
                </div>
                <div className="data_tile_value sora">
                  {data.inventoryTurnover}
                </div>
                <p className="data_tile_hint outfit">
                  Higher is better – it indicates faster movement of inventory
                  through your pipeline.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
