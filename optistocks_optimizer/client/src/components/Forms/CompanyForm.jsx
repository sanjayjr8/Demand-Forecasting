import React, { useState } from "react";
import "../../styles/components/Forms/AddForm.css";
import { useCompaniesContext } from "../../hooks/useCompaniesContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const CompanyForm = ({ onClose }) => {
  const { dispatch } = useCompaniesContext();
  const { user } = useAuthContext();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  const [error, setError] = useState(null);

  const handleAddCompany = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const company = {
      name,
      address,
      contactEmail: email,
      contactNumber: contact,
    };

    const response = await fetch(
      "https://optistocks-optimizer.onrender.com/api/dashboard/companies",
      {
        method: "POST",
        body: JSON.stringify(company),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setName("");
      setAddress("");
      setEmail("");
      setContact("");
      setError(null);
      dispatch({ type: "CREATE_COMPANIES", payload: json });
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
          <h2 className="modal-title">Add Company</h2>
          <p className="modal-subtitle outfit">
            Capture your client or business unit details to start tracking
            inventory and demand.
          </p>
        </div>

        <form onSubmit={handleAddCompany} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label outfit">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Resva Online Pvt Ltd"
                className="form-input outfit"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label outfit">Address</label>
              <input
                type="text"
                placeholder="e.g. 204, C-11 PARSN GURUPRASAD APARTMENTS..."
                className="form-input outfit"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                required
              />
            </div>
          </div>

          <div className="form-row two-column">
            <div className="form-group">
              <label className="form-label outfit">Contact Email</label>
              <input
                type="email"
                placeholder="e.g. ops@company.com"
                className="form-input outfit"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label outfit">Phone</label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                className="form-input outfit"
                onChange={(e) => setContact(e.target.value)}
                value={contact}
                required
              />
            </div>
          </div>

          {error && <div className="form-error outfit">Error: {error}</div>}

          <button type="submit" className="primary-btn outfit">
            Save Company
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
