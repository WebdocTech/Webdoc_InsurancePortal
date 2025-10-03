// src/Components/PolicyCheck/Telenor_Charging.js

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import {
  Spinner,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Container,
  Card,
} from "react-bootstrap";
import { Chargingcheck_URL } from "../../Config";

import AgentCRO_Header from "../AgentCRO/AgentCRO_Header";
import Claim_Head_Header from "../Claim_Head_Component/Claim_Head_Header";
import Key_Account_Manager_Header from "../Key_Account_Manager_Header";

const TelenorCharging = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { policy } = location.state || {};

  // Default last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const formatDate = (date) => date.toISOString().split("T")[0];

  // Initialize from/to dates
  const [from, setFrom] = useState(
    location.state?.from || formatDate(thirtyDaysAgo)
  );
  const [to, setTo] = useState(location.state?.to || formatDate(today));

  const [userData, setUserData] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user data from sessionStorage
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);
const calculateDayDifference = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const timeDiff = endDate - startDate;

  // Convert milliseconds to days
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  return dayDiff > 0 ? dayDiff : 0;
};

  // Fetch charging data
  useEffect(() => {
    const fetchChargingData = async () => {
      if (!from || !to || !policy) return;

      setLoading(true);
      setError(null);
      setData([]);

      try {
        const url = `${Chargingcheck_URL}api/ufone/charging/policy`;
        const formData = new URLSearchParams();
        formData.append("policy", policy);
        formData.append("from", from);
        formData.append("to", to);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });

        const json = await response.json();
        if (json.ResponseCode === "0000" && Array.isArray(json.ResponseData)) {
          setData(json.ResponseData);
        } else {
          setError(json.ResponseMessage);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch charging data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChargingData();
  }, [from, to, policy]);

  const renderHeader = () => {
    switch (userData?.userRole) {
      case "AgentCRO":
        return <AgentCRO_Header />;
      case "Claim_Head":
        return <Claim_Head_Header />;
      case "Key_Account_Manager":
        return <Key_Account_Manager_Header />;
      default:
        return null;
    }
  };

  const formatDateDisplay = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
  };

  // 🔸 More robust version to sum ChargeAmount by Service ID (trying multiple possible keys)
  const calculateServiceTotals = () => {
    const totals = {};

    data.forEach((item) => {
      // Try multiple possible keys based on your backend response
      const product_name =
        item.product_name ??
        item.product_name ??
        item.product_name ??
        item["product_name"] ??
        "Unknown";

      const chargeRaw =
        item.ChargeAmount ??
        item.chargeAmount ??
        item.charge_amount ??
        item["Charge Amount"] ??
        0;

      const charge = parseFloat(chargeRaw) || 0;

      if (!totals[product_name]) {
        totals[product_name] = 0;
      }

      totals[product_name] += charge;
    });

    return totals;
  };

  const columns = data.length
    ? Object.keys(data[0]).map((key) => ({
        name: key.replace(/_/g, " ").toUpperCase(),
        selector: (row) => {
          const value = row[key];
          if (typeof value === "string" && /\d{4}-\d{2}-\d{2}T/.test(value)) {
            return formatDateDisplay(value);
          }
          return value ?? "N/A";
        },
        sortable: true,
        wrap: true,
      }))
    : [];

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (!from || !to) {
      setError("Both dates are required.");
      return;
    }
    if (from > to) {
      setError("'From' date cannot be after 'To' date.");
      return;
    }
    navigate("/telenor-charging", {
      state: { policy, from, to },
    });
  };

  if (!userData) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading user information...</p>
      </div>
    );
  }

  return (
    <>
      {renderHeader()}
      <Container fluid className="mt-4">
        <Card className="shadow-sm">
          <Card.Body>
            <h4 className="mb-2 text-primary">
              Charging Details for Policy: <strong>{policy}</strong>
            </h4>
            <p className="text-muted mb-2">
              Showing data from <strong>{from}</strong> to <strong>{to}</strong>
            </p>


            {/* Totals block */}
           {data.length > 0 && (
  <div className="mb-3">
    <h6 className="text-secondary">Total Charging Details</h6>
    <ul className="mb-0">
      <li>
            <strong>{calculateDayDifference(from, to)}</strong> days
          </li>
      {Object.entries(calculateServiceTotals()).map(([serviceId, total]) => (
        <React.Fragment key={serviceId}>
          
          <li>
            <strong>Product Name: {serviceId}</strong>: Rs {total.toFixed(2)}
          </li>
          
        </React.Fragment>
      ))}
    </ul>
  </div>
)}


            <Form onSubmit={handleFilterSubmit}>
              <Row className="mb-3">
                <Col xs={12} md={4}>
                  <Form.Group controlId="fromDate">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      max={to || undefined}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Group controlId="toDate">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      min={from || undefined}
                      max={formatDate(today)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} className="d-flex align-items-end">
                  <Button variant="primary" type="submit" className="w-100">
                    Apply Filter
                  </Button>
                </Col>
              </Row>
            </Form>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
              <div className="text-center my-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Fetching data...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <DataTable
                  columns={columns}
                  data={data}
                  pagination
                  highlightOnHover
                  striped
                  responsive
                  dense
                  noDataComponent="No charging data found."
                />
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default TelenorCharging;
