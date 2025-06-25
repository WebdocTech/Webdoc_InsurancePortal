import React, { useState, useEffect, useMemo } from "react";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "react-data-table-component";
import { BASE_URL } from '../../Config';  // Correct path for Config
import { useNavigate } from 'react-router-dom';
import {  Button } from 'react-bootstrap';



const Claim_Report = () => {
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [status, setStatus] = useState("");
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("https://WebdocinsuranceportalAPI.webddocsystems.com/Products")
      .then((response) => response.json())
      .then((data) => {
        if (data.responseCode === "0000") {
          setPackages(
            data.packages
          );
        } else {
          Swal.fire("Error", "Unable to fetch packages", "error");
        }
      })
      .catch(() => Swal.fire("Error", "Error fetching package data", "error"))
      .finally(() => setLoading(false));
  }, []);
  //  console.log(packages);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!startDate && !endDate && !mobileNumber && !serviceName && !status) {
      Swal.fire("Warning", "Please fill in at least one filter field!", "warning");
      return;
    }
    setLoading(true);

    const queryParams = new URLSearchParams({ userId, startDate, endDate, mobileNumber, serviceName, status });
    fetch(`https://WebdocinsuranceportalAPI.webddocsystems.com/Report?${queryParams}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.responseCode === "1111") {
          Swal.fire("Info", data.message, "info");
          setReportData([]);
        } else if (data.responseCode === "0000") {
          setReportData(data.data.sort((a, b) => new Date(a.claimDate) - new Date(b.claimDate)));
        }
      })
      .catch(() => Swal.fire("Error", "Error fetching report data", "error"))
      .finally(() => setLoading(false));
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return reportData;
    return reportData.filter((row) =>
      Object.values(row).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, reportData]);
  const handleDetailsClick = (customerMobileNo, claim_No) => {
    navigate(`/Claim_Details/${customerMobileNo}/${claim_No}`);
  };
  const columns = [
    { name: "Claim Number", selector: (row) => row.claimNumber, sortable: true },
    { name: "Name", selector: (row) => row.name || "N/A", sortable: true },
    { name: "Mobile Number", selector: (row) => row.mobileNumber, sortable: true },
    { name: "Service Name", selector: (row) => row.serviceName, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Claim Date", selector: (row) => row.claimDate, sortable: true },
    { name: "Processing Date", selector: (row) => row.processingDate || "N/A", sortable: true },
    { name: "Approved Date", selector: (row) => row.approvedDate || "N/A", sortable: true },
        {
          name: 'Action',
          cell: (row) => (
            <Button
              variant="primary"
              onClick={() => handleDetailsClick(row.mobileNumber, row.claimNumber)}
              className="m-2"
            >
              Claim Details
            </Button>
          ),
        }
  ];

  return (
    <div className="container-fluid">
      <div className="card m-2">
        <div className="card-header text-center">
          <h3>Apply Filters For Getting Reports</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row mb-3">
            {[{ label: "Start Date", state: startDate, setState: setStartDate },
            { label: "End Date", state: endDate, setState: setEndDate }].map((item, idx) => (
              <div key={idx} className="col-md-2">
                <label>{item.label}</label>
                <input type="date" className="form-control" value={item.state} onChange={(e) => item.setState(e.target.value)} max={today} />
              </div>
            ))}
            <div className="col-md-2">
              <label>Mobile Number</label>
              <input type="text" placeholder="03001111111" className="form-control" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label>Service Name</label>
              <select className="form-control" value={serviceName} onChange={(e) => setServiceName(e.target.value)}>
                <option value="">Select a Service</option>
                {/* Ensure packages are fetched properly */}
                {packages.length > 0 ? (
                  packages.map((pkg, index) => (
                    <option key={index} value={pkg.productName}>
                      {pkg.productName}
                    </option>
                  ))
                ) : (
                  <option disabled>No services available</option>
                )}
              </select>
            </div>

            <div className="col-md-2">
              <label>Status</label>
              <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Select a Status</option>

                {['Hold','Intimation', 'Processing', 'Rejected', 'Approved', 'Paid'].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2 mt-4">
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>{loading ? "Loading..." : "Get Report"}</button>
            </div>
          </form>
        </div>
      </div>

      <div className="card m-2">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-12 col-md-9">
              <h3 className="card-title text-center">Report</h3>
            </div>

            <div className="col-12 col-md-3">
              <input type="text" placeholder="Search ..." className="form-control" onChange={(e) => setSearchTerm(e.target.value)} />

            </div>
          </div>
        </div>
        {reportData.length > 0 && (
          <div className="card m-2">
            <div className="card-body">
              <DataTable columns={columns} data={filteredData} pagination highlightOnHover responsive striped />
              <CSVLink data={reportData} filename="report.csv" className="btn btn-success w-100 mt-3">Download Report as CSV</CSVLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Claim_Report;
