import React, { useState, useEffect } from "react";
import { Card, Spinner, Alert, Row, Col, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Claim_Head_Header from '../Components/Claim_Head_Component/Claim_Head_Header';
import { useParams } from "react-router-dom";

const Claim_Details = () => {
  const { customerMobileNo, claimNo } = useParams();  // Use useParams to get URL parameters
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the parameters from the URL in the API call
        const response = await fetch(`https://WebdocinsuranceportalAPI.webddocsystems.com/Claim_Details?mobileno=${customerMobileNo}&claimNumber=${claimNo}`);
        const result = await response.json();

        if (result.responseCode === "0000") {
          setData(result.response);
        } else {
          setError('Failed to load claim details');
        }
      } catch (error) {
        setError('An error occurred while fetching the data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerMobileNo, claimNo]);  // Run the effect when the parameters change

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <Alert variant="danger">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="fluid">
        <Claim_Head_Header />
      </div>         

      <Card className="mt-5">
        <Card.Header>
          <h3 className="text-center">Claim Details</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Claim No:</strong> {data.claimNo}</p>
              <p><strong>Customer Name:</strong> {data.customerName}</p>
              <p><strong>Customer Mobile No:</strong> {data.customerMobileNo}</p>
              <p><strong>Claim Date:</strong> {new Date(data.claimDate).toLocaleString()}</p>
            </Col>
            <Col md={6}>
              <p><strong>Service Name:</strong> {data.serviceName}</p>
              <p><strong>Claim Status:</strong> {data.claimStatus}</p>
              <p><strong>Intimation Details:</strong></p>
              <ul>
                {data.intimation_Remarks.map((remark, index) => (
                  <li key={index}>{remark} ({new Date(data.intimationDate[index]).toLocaleString()}) 
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
          <hr />
          <h4>Images</h4>
          <Row>
            {data.images.map((image, index) => (
              <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                <Image src={image.imageUrl} thumbnail />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Claim_Details;
