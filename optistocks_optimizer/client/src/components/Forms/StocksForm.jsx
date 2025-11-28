import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/components/Forms/AddForm.css";
import { useCompaniesContext } from "../../hooks/useCompaniesContext";

const StockForm = ({ onClose }) => {
  const { companyId } = useParams();
  const { dispatch } = useCompaniesContext();

  const [name, setName] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [unitsSold, setUnitsSold] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");

  const [error, setError] = useState(null);

  const handleAddStock = async (e) => {
    e.preventDefault();

    const stock = { name, totalUnits, unitsSold, pricePerUnit };

    const response = await fetch(
      `https://optistocks-optimizer.onrender.com/api/dashboard/companies/${companyId}/stocks`,
      {
        method: "POST",
        body: JSON.stringify(stock),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setName("");
      setTotalUnits("");
      setUnitsSold("");
      setPricePerUnit("");
      setError(null);
      dispatch({ type: "CREATE_STOCK", payload: json });
      onClose();
    }
  };

  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={onClose} />

      <div className="modal-content sora">
        <button className="close-button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-header">
          <h2 className="modal-title">Add Stock</h2>
          <p className="modal-subtitle outfit">
            Add a product line to this company so OptiStocks can track units,
            sales and revenue.
          </p>
        </div>

        <form onSubmit={handleAddStock} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label outfit">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Laptop"
                className="form-input outfit"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
          </div>

          <div className="form-row two-column">
            <div className="form-group">
              <label className="form-label outfit">Total Units</label>
              <input
                type="number"
                placeholder="e.g. 100"
                className="form-input outfit"
                onChange={(e) => setTotalUnits(e.target.value)}
                value={totalUnits}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label outfit">Units Sold</label>
              <input
                type="number"
                placeholder="e.g. 24"
                className="form-input outfit"
                onChange={(e) => setUnitsSold(e.target.value)}
                value={unitsSold}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label outfit">Price per Unit</label>
              <input
                type="number"
                placeholder="e.g. 100000"
                className="form-input outfit"
                onChange={(e) => setPricePerUnit(e.target.value)}
                value={pricePerUnit}
                min="0"
                required
              />
            </div>
          </div>

          {error && <div className="form-error outfit">Error: {error}</div>}

          <button type="submit" className="primary-btn outfit">
            Save Stock
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockForm;
