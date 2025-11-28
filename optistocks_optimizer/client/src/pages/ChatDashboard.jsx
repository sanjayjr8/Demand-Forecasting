import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/static/ChatDashboard.css";
import ButtonBar from "../components/ButtonBar";
import { useAuthContext } from "./../hooks/useAuthContext";
import { FaCheckCircle } from "react-icons/fa";

export default function ChatDashboard() {
  const { companyId } = useParams();
  const [predictions, setPredictions] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const { user } = useAuthContext();

  const fetchPredictions = async () => {
    try {
      const response = await fetch(
        `https://optistocks-optimizer.onrender.com/api/dashboard/companies/chat/${companyId}`,
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
      setPredictions(json);
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
    }
  };

  const sendMessage = async () => {
    try {
      setIsSending(true);
      const response = await fetch(
        `https://optistocks-optimizer.onrender.com/api/dashboard/companies/chat/${companyId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setIsOrdered(true);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (user && companyId) {
      fetchPredictions();
    }
  }, [user, companyId]);

  const isSendDisabled =
    isSending || isOrdered || !predictions || predictions.length === 0;

  return (
    <>
      <div className="global"></div>
      <main className="app_chat_dashboard">
        <ButtonBar companyId={companyId} />

        {/* Header */}
        <section className="chat_header sora">
          <div className="chat_header_text">
            <h1 className="chat_title">Smart Re-order</h1>
            <p className="chat_subtitle outfit">
              Review the recommended purchase quantities and send a consolidated
              order to your supplier in one click.
            </p>
          </div>

          <div className="chat_header_actions">
            {isOrdered && (
              <div className="chat_status success outfit">
                <FaCheckCircle className="chat_status_icon" />
                <span>Order placed for recommended quantities</span>
              </div>
            )}

            <button
              className="chat_dashboard_button sora"
              onClick={sendMessage}
              disabled={isSendDisabled}
            >
              {isSending
                ? "Sending..."
                : isOrdered
                ? "Sent"
                : "Send Order"}
            </button>
          </div>
        </section>

        {/* Content */}
        <section
          className={`chat_dashboard ${isOrdered ? "fade-out" : ""}`}
        >
          {(!predictions || predictions.length === 0) && (
            <div className="chat_empty outfit">
              No recommended purchases yet. Generate predictions first, then
              you’ll see a summary here.
            </div>
          )}

          <div className="chat_dashboard_blocks">
            {predictions.map((prediction, index) => (
              <article className="chat_dashboard_block" key={index}>
                {/* Top row: stock + index */}
                <div className="chat_dashboard_block_name sora">
                  <div className="block_name_name">
                    {prediction.stockName}
                  </div>
                  <div className="block_name_tag">#{index + 1}</div>
                </div>

                {/* Middle row: “message” style bubble */}
                <div className="chat_line">
                  <div className="chat_avatar_circle" />
                  <div className="chat_message outfit">
                    <span className="prediction_span">
                      Suggested purchase:
                    </span>{" "}
                    <strong>{prediction.purchaseQuantity}</strong> units
                    for this product.
                  </div>
                </div>

                {/* Footer hint */}
                <p className="chat_hint outfit">
                  This quantity comes from your latest demand prediction. You
                  can adjust it with your supplier if needed.
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
