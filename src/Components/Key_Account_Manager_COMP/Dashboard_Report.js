import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert,Button } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import DataTable from 'react-data-table-component';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom';

const JazzDashboard_Report = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchReportData = () => {
    axios.get('https://WebdocinsuranceportalAPI.webddocsystems.com/JazzDashboard_Report', {
      headers: {
        'accept': '*/*',
      },
    })
    .then((response) => {
      if (response.data.responseCode === "0000") {
        setReportData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        setError(response.data.message);
      }
    })
    .catch((error) => {
      setError('Something went wrong while fetching the report.');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchReportData();
    const intervalId = setInterval(fetchReportData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const getClaimAge = (claimDate) => {
    const claimDateInPST = moment.tz(claimDate, "Asia/Karachi");
    const currentDate = moment.tz("Asia/Karachi");
    return currentDate.diff(claimDateInPST, 'days');
  };

  const sortedData = reportData.sort((a, b) => {
    return getClaimAge(b.claimDate) - getClaimAge(a.claimDate);
  });

  const highlightedData = sortedData.map((row) => {
    const ageInDays = getClaimAge(row.claimDate);
    const redIntensity = Math.min(255, ageInDays * 50);
    const backgroundColor = `rgb(${redIntensity}, 0, 0)`;

    return {
      ...row,
      backgroundColor,
      ageInDays,
    };
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }
  const handleDetailsClick = (customerMobileNo, claim_No) => {
    navigate(`/Claim_Details/${customerMobileNo}/${claim_No}`);
  };
  const columns = [
    {
      name: 'Claim Number',
      selector: row => row.claimNumber,
      sortable: true,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Mobile Number',
      selector: row => row.mobileNumber,
      sortable: true,
    },
    {
      name: 'Service Name',
      selector: row => row.serviceName,
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
    },
    {
      name: 'Processing Date',
      selector: row => row.processingDate,
      sortable: true,
    },
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
      <h2 className="text-center my-4">Dashboard</h2>
      <div className="m-3">
       
        <div className="card shadow-sm">
          <div className="card-header">
            <div className="row align-items-center">
              <div className="col-12 col-md-8 mb-2 mb-md-0">
                <h3 className="card-title text-center">Claims that have been open for more than 4 days and are still unresolved.</h3>
              </div>

              <div className="col-12 col-md-4">
                <input
                  type="text"
                  placeholder="Search ..."
                  className="form-control"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    setFilteredData(
                      highlightedData.filter((row) =>
                        Object.values(row).some((value) =>
                          value?.toString().toLowerCase().includes(searchTerm)
                        )
                      )
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="card-body">
            <DataTable
              columns={columns}
              data={highlightedData}
              pagination
              highlightOnHover
              responsive
              striped
              persistTableHead
              conditionalRowStyles={[
                {
                  when: row => row.ageInDays > 6,
                  style: (row) => ({
                    backgroundColor: row.backgroundColor,
                    color: 'white',
                    fontWeight: 'bold',
                    transition: 'background-color 0.5s ease',
                  })
                }
              ]}
            />
             
          <CSVLink
            data={reportData}
            filename={"dashboard_report.csv"}
            className="btn btn-success w-100"
            target="_blank"
          >
            Export to CSV
          </CSVLink>       

          </div>
        </div>
      </div>
    </div>
  );
};

export default JazzDashboard_Report;
