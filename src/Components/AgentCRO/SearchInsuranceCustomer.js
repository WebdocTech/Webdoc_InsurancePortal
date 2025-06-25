import React, { useState, useEffect } from "react";
import {
  Modal,
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Dropdown,
  DropdownButton,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { BASE_URL } from "../../Config"; // Correct path for Config
import { useNavigate } from "react-router-dom"; 

const SearchInsuranceCustomer = () => {
  const [userId, setUserId ] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [serviceDetails, setServiceDetails] = useState(null);
  const navigate = useNavigate(); 
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cnic, setCnic] = useState("");
  const [gender, setGender] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user");
    console.log("user",storedUserId);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // Fetch Customer Data based on Mobile Number
  const fetchCustomerData = async (number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}SearchInsuranceCustomer?mobileNumber=${number}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );
      const data = await response.json();

      if (data.responseCode === "0000") {
        setCustomerData(data);
        setFilteredServices(data.services); 
      }else if (data.responseCode === "0002") {
        setShowModal(true);
      }  else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Service Details based on Service Name
  const fetchServiceDetails = async (serviceName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}CustomerServiceDetails?servicename=${serviceName}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );
      const data = await response.json();

      if (data.responseCode === "0000") {
        setServiceDetails(data.serviceDetails[0]); // Assuming only one service detail is returned
      } else if (data.responseCode === "0002") {
        setShowModal(true);
      } else {
        setError("Unable to retrieve service details.", data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching service details.");
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to fetch customer data on mobile number change
  useEffect(() => {
    if (mobileNumber.length === 11) {
      fetchCustomerData(mobileNumber);
    }
  }, [mobileNumber]);

  // UseEffect to filter services based on search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredServices(customerData?.services || []);
    } else {
      setFilteredServices(
        customerData?.services.filter((service) =>
          service.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
        ) || []
      );
    }
  }, [searchQuery, customerData]);

  const handleServiceSelect = (serviceName) => {
    setSelectedService(serviceName);
    fetchServiceDetails(serviceName); // Fetch service details when service is selected
  };
 // Handle navigation to ClaimRecord view
 const handleNavigateToClaimRecord = () => {
  if (customerData?.customer?.mobileNumber) {
    navigate(`/ClaimRecord/${customerData.customer.mobileNumber}`);
  } else {
    console.error("Customer mobile number not found");
  }
};

 // Handle the form submission
 const handleSubmitCustomerDetails = async () => {
  if (!name || !address || !cnic || !gender) {
    setErrorMessage("All fields are required!");
    return;
  }

  setLoading(true);
  setErrorMessage(null);

  try {
    const response = await fetch(
      `${BASE_URL}CustomerProfileEnter?Name=${name}&Address=${address}&Cnic=${cnic}&MobileNumber=03175777308&Gender=${gender}`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
        },
      }
    );

    const data = await response.json();

    if (data.responseCode === "0000") {
      setShowModal(false); // Close the modal on success
      alert("Customer details submitted successfully.");
    } else {
      setErrorMessage(data.message);
    }
  } catch (err) {
    setErrorMessage("An error occurred while submitting the data.");
  } finally {
    setLoading(false);
  }
};



  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center my-4">
        <Col xs={12} sm={10} md={8} lg={8}>
          <Card>
            <Card.Header className="text-center">
              <h2>Search Customer Record</h2>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="formMobileNumber">
                  <Form.Control
                    type="text"
                    className="col-12"
                    placeholder="Enter Registered Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    maxLength="11"
                  />
                </Form.Group>
                 {/* Button to navigate to ClaimRecord view */}
                 
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {customerData && (
        <Row className="my-4 justify-content-center">
          <Col xs={12} sm={10} md={10} lg={8}>
            <Card>
              <Card.Header>
                <h3 className="text-center">Customer Details</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={12} sm={6}>
                    <Card.Text>
                      <strong>Name:</strong> {customerData.customer.name}
                      <br />
                      <strong>Contact No:</strong> {customerData.customer.mobileNumber}
                      <br />
                      <strong>Gender:</strong> {customerData.customer.gender}
                      <br />
                      <strong>CNIC:</strong> {customerData.customer.cnic}
                      <br />
                      <strong>Issued Date Cnic:</strong> {customerData.customer.IssuedDateCnic}
                      <br />
                      <strong>Address:</strong> {customerData.customer.address}
                    </Card.Text>
                  </Col>

                  <Col xs={12} sm={6}>
                    {customerData.services && customerData.services.length > 0 && (
                      <div>
                        <h5>Available Services</h5>
                        <DropdownButton
                          id="dropdown-custom-services"
                          title={selectedService ? selectedService : "Select Service"}
                          variant="secondary"
                          onSelect={handleServiceSelect}
                          className="w-100"
                          disabled={filteredServices.length === 0}
                        >
                          <Dropdown.ItemText>
                            <InputGroup>
                              <FormControl
                                placeholder="Search service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </InputGroup>
                          </Dropdown.ItemText>

                          {filteredServices.length === 0 ? (
                            <Dropdown.Item disabled>No services available</Dropdown.Item>
                          ) : (
                            filteredServices.map((service, index) => (
                              <Dropdown.Item key={index} eventKey={service.serviceName}>
                                {service.serviceName}
                              </Dropdown.Item>
                            ))
                          )}
                        </DropdownButton>
                        <Button
                          className="col-12 mt-3"
                          variant="primary"
                          onClick={handleNavigateToClaimRecord}
                          disabled={!customerData?.customer?.mobileNumber}
                        >
                          {loading ? "Loading..." : "Claims"}
                        </Button>
                       
                      </div>
                    )}

                    {customerData.services.length <= 0 && (                     
                     <h5>No Services Found</h5>  
                    )}

                  </Col>
                  
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      {serviceDetails && (
        <Row className="my-4 justify-content-center">
          <Col xs={12} sm={10} md={10} lg={8}>
          <Card>
              <Card.Header>
              <h3 className="text-center">{serviceDetails.productName} Service Details</h3>
              </Card.Header>
              <Card.Body>
                <Card.Title></Card.Title>
                
                <Card.Text>
                  <Row className="mb-2">
                  <Col xs={12} sm={6} md={6} lg={4}>                  
                  <strong>Product Name:</strong> {serviceDetails.productName}
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={4}>                  
                  <strong>Company:</strong> {serviceDetails.companyName}
                  </Col>                  
                  <Col xs={12} sm={6} md={6} lg={4}>                  
                  <strong>Price:</strong> PKR {serviceDetails.price}
                  </Col>
                  </Row>
                  <Row className="mb-2">
                  <Col xs={12} sm={6} md={4} lg={4}>                  
                  <strong>Duration:</strong> {serviceDetails.duration}
                  </Col>                 

                  <Col xs={12} sm={6} md={4} lg={4}>
                  <strong>Masking:</strong> {serviceDetails.masking}
                  </Col>
                  </Row>

                  <h5>Features:</h5>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: serviceDetails.features,
                    }}
                  />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

   {/* Modal for entering customer details */}
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Customer Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Display error message if validation fails */}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          
          {/* Name Field */}
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </Form.Group>
          
          {/* Address Field */}
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
            />
          </Form.Group>
          
          {/* CNIC Field */}
          <Form.Group controlId="formCnic">
            <Form.Label>CNIC</Form.Label>
            <Form.Control
              type="text"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              placeholder="Enter your CNIC"
            />
          </Form.Group>
          
          {/* Gender Field */}
          <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmitCustomerDetails}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Modal.Footer>
    </Modal>
    </Container>
  );
};

export default SearchInsuranceCustomer;
