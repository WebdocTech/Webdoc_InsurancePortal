// File: WHS_Subscription.js

import React, { useState } from "react";
import {
  Button,
  InputGroup,
  Form,
  Alert,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import { BASE_URL } from "../../Config";

const WHS_Subscription = () => {
  const [msisdn, setMsisdn] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMsisdnChange = (e) => {
    setMsisdn(e.target.value);
  };

  const fetchWHSSubscriptions = async () => {
    if (!msisdn) return;

    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${BASE_URL}CheckServiceWHSSubscriptions?msisdn=${msisdn}`;
      console.log("Requesting WHS Subscriptions from:", apiUrl);

      const response = await axios.get(apiUrl);

      if (response.data && Array.isArray(response.data.records)) {
        setSubscriptions(response.data.records);
      } else {
        setSubscriptions([]);
        setError("Invalid data format received from WHS Subscriptions.");
      }
    } catch (err) {
      console.error("Error fetching WHS Subscriptions:", err);
      if (err.response) {
        setError(
          `WHS Fetch failed: ${err.response.status} - ${err.response.data}`
        );
      } else {
        setError("Failed to fetch WHS data: Network issue or server error.");
      }
    } finally {
      setLoading(false);
    }
  };
const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short", // "short" gives "Aug"
    day: "2-digit", // gives "02"
  });
};

const columns = [
  {
   name: "Date",
  selector: (row) => formatDate(row.date),
  },
  {
    name: "Name",
    selector: (row) => row.name ?? "N/A",
    sortable: true,
  },
  {
    name: "MSISDN",
    selector: (row) => row.msisdn ?? "N/A",
    sortable: true,
  },
  {
    name: "DOB",
    selector: (row) => row.dob ?? "N/A",
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row) => (row.amount != null ? row.amount : "-"),
    sortable: true,
  },
  {
    name: "Month/Year",
    selector: (row) => row.monthYear ?? "N/A",
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status ?? "N/A",
    sortable: true,
  },
  
];


  return (
    <div className="container-fluid">
      <div className="m-3">
        <div className="card shadow-sm">
          <div className="card-header">
            <h3 className="card-title text-center">Check WHS Subscriptions</h3>
          </div>

          <div className="card-body">
            {/* MSISDN input form */}
            <InputGroup className="mb-4">
              <Form.Control
                className="col-12 col-md-8 mb-2 m-2"
                type="text"
                placeholder="Enter MSISDN"
                value={msisdn}
                onChange={handleMsisdnChange}
              />
              <Button
                variant="success"
                className="col-12 col-md-2 mb-2 m-2"
                onClick={fetchWHSSubscriptions}
              >
                Fetch Subscriptions
              </Button>
            </InputGroup>

            {/* Error message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Loading spinner */}
            {loading && (
              <div className="spinner-border text-primary" role="status"></div>
            )}

            {/* DataTable */}
            <DataTable
              columns={columns}
              data={subscriptions}
              progressPending={loading}
              pagination
              highlightOnHover
              responsive
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              persistTableHead
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WHS_Subscription;
