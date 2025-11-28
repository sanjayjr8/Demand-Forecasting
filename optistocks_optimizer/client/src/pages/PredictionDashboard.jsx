import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/static/PredictionDashboard.css";
import ButtonBar from "../components/ButtonBar";
import { useAuthContext } from "./../hooks/useAuthContext";

export default function PredictionDashboard() {
  const { user } = useAuthContext();
  const { companyId } = useParams();

  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(
          `https://optistocks-optimizer.onrender.com/api/dashboard/companies/prediction/${companyId}`,
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

        setPredictions(json);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && companyId) {
      fetchPredictions();
    }
  }, [user, companyId]);

  if (error) {
    return (
      <div className="prediction_error outfit">Error: {error}</div>
    );
  }

  return (
    <>
      <div className="global"></div>
      <main className="app_prediction_dashboard">
        <ButtonBar companyId={companyId} />

        {/* Header */}
        <section className="prediction_header sora">
          <div className="prediction_header_text">
            <h1 className="prediction_title">Prediction Dashboard</h1>
            <p className="prediction_subtitle outfit">
              Recommended purchase quantities for upcoming cycles, based on your
              historical demand patterns and current stock levels.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="prediction_dashboard">
          {loading && (
            <div className="prediction_loading outfit">
              <div className="prediction_skeleton-row" />
              <div className="prediction_skeleton-row" />
              <div className="prediction_skeleton-row" />
            </div>
          )}

          {!loading && predictions && (
            <div className="prediction_tiles">
              {predictions.map((prediction, index) => (
                <article
                  className="prediction_tile"
                  key={`${prediction.stockName}-${index}`}
                >
                  {/* Top row: label + index */}
                  <div className="prediction_tile_header">
                    <span className="prediction_tile_label outfit">
                      Forecasted Purchase
                    </span>
                    <span className="prediction_tag sora">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Product name */}
                  <div className="prediction_product sora">
                    {prediction.stockName}
                  </div>

                  {/* “Future container” timeline */}
                  <div className="prediction_timeline">
                    <div className="timeline_line" />
                    <div className="timeline_dot timeline_dot--current" />
                    <div className="timeline_dot timeline_dot--future" />
                    <div className="timeline_glow" />
                    <span className="timeline_label outfit">
                      Today
                    </span>
                    <span className="timeline_label outfit timeline_label--future">
                      Next cycle
                    </span>
                  </div>

                  {/* Quantity bubble */}
                  <div className="prediction_quantity_block">
                    <div className="prediction_quantity_label outfit">
                      Suggested Purchase Quantity
                    </div>
                    <div className="prediction_quantity_value sora">
                      {prediction.purchaseQuantity}
                    </div>
                    <p className="prediction_hint outfit">
                      Use this as a guideline to prevent stockouts while
                      avoiding over-stocking for this product.
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
