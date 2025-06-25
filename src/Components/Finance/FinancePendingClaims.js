import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert, Card, Form } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import DataTable from 'react-data-table-component';
import moment from 'moment-timezone';

const FinancePendingClaims = () => {
  const [claimsData, setClaimsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingClaim, setLoadingClaim] = useState(null); // Track which claim is loading

  useEffect(() => {
    // Fetch the claims data from the API
    const fetchClaimsData = async () => {
      try {
        const response = await axios.get('https://WebdocinsuranceportalAPI.webddocsystems.com/Pending_Claims', {
          headers: {
            'accept': '*/*',
          },
        });

        if (response.data.responseCode === "0000") {
          setClaimsData(response.data.claim_Data);
          setFilteredData(response.data.claim_Data);
        } else {
          setError('Failed to fetch claims data');
        }
      } catch (err) {
        setError('Something went wrong while fetching the claims.');
      } finally {
        setLoading(false);
      }
    };

    fetchClaimsData();
  }, []);

  const handlePaidClick = async (claim_Id) => {
    setLoadingClaim(claim_Id); // Set the claim as loading

    try {
      const response = await axios.post(`https://WebdocinsuranceportalAPI.webddocsystems.com/Pay_Claim?ClaimNo=${claim_Id}`, {
        headers: {
          'accept': '*/*',
        },
      });
  
      // Handle success response
      if (response.data.responseCode === "0000") {
        alert(`Claim ID ${claim_Id} has been marked as paid.`);
        
        setClaimsData((prevData) =>
          prevData.map((claim) =>
            claim.claim_Id === claim_Id ? { ...claim, status: 'Paid' } : claim
          )
        );
        setFilteredData((prevData) =>
          prevData.map((claim) =>
            claim.claim_Id === claim_Id ? { ...claim, status: 'Paid' } : claim
          )
        );
      } else {
        alert('Failed to mark the claim as paid. Because ' + response.data.responseMessage);
      }
    } catch (error) {
      alert('Something went wrong while processing the payment. Please contact with IT Department.');
    } finally {
      setLoadingClaim(null); // Reset loading state once API call finishes
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = claimsData.filter((claim) =>
      Object.values(claim).some(value =>
        value?.toString().toLowerCase().includes(term)
      )
    );
    setFilteredData(filtered);
  };

  // Columns for the DataTable
  const columns = [
    {
      name: 'Claim No',
      selector: row => row.claim_No,
      sortable: true,
    },
    {
      name: 'Customer Name',
      selector: row => row.customerName,
      sortable: true,
    },
    {
      name: 'Mobile No',
      selector: row => row.customerMobileNo,
      sortable: true,
    },
    {
      name: 'Bank Name',
      selector: row => row.bankName,
      sortable: true,
    },
    {
      name: 'Customer Service',
      selector: row => row.customerService,
      sortable: true,
    },
    {
      name: 'Paid Amount',
      selector: row => row.paid_Amount,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'Claim Date',
      selector: row => row.claimDate,
      sortable: true,
      format: row => moment(row.claimDate).format('DD MMM YYYY'),
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          className="btn btn-success"
          onClick={() => handlePaidClick(row.claim_Id)}
          disabled={loadingClaim === row.claim_Id} // Disable button when loading
        >
          {loadingClaim === row.claim_Id ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Paid'
          )}
        </button>
      ),
    },
  ];

  // Handle Loading State
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  // Handle Error State
  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  return (
    <div className="container my-4">
      <Card className="mb-4">
        <Card.Header>
          <div className="row">
            <div className="col-md-9">
              <h2 className="text-center">Claims Data</h2>
            </div>
            <div className="col-md-3">
              {/* Search Bar */}
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            responsive
            striped
            sortServer
            persistTableHead
          />
        </Card.Body>
      </Card>

      {/* Export CSV Button */}
      <div className="mt-4">
        <CSVLink
          data={filteredData}
          filename={"claims_data.csv"}
          className="btn btn-success w-100"
          target="_blank"
        >
          Export to CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default FinancePendingClaims;
