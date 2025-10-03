import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../Config";
import Swal from 'sweetalert2';
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { useNavigate } from 'react-router-dom';

// Inside your component:
const ChangeinProduct = () => {
  const { productId } = useParams(); // Extract the productId from the URL
  const navigate = useNavigate();
const [product, setProduct] = useState({
    id: '',
    productName: '',
    companyName: '',
    price: '',
    masking: '',
    planType: '',
    coverage: '',
    details: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch product details based on productId
  useEffect(() => {
    if (productId) {
      setLoading(true);
      axios
        .get(`${BASE_URL}ProductbyId?productId=${productId}`)
        .then((response) => {
          if (response.data && response.data.product) {
            const productData = response.data.product;
            const formattedPrice = productData.price.replace('Rs.', '').trim();
            setProduct({
              ...productData,
              price: formattedPrice,
            });
            console.log('Fetched product:', response.data.product);
          } else {
            setError('Product not found.');
          }
        })
        .catch((err) => {
          setError('Error fetching product details.');
          console.error('Error fetching product:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Ensure that the price includes the 'Rs.' prefix
    const payload = {
      ...product,
      price: `Rs.${product.price}`, // Formatting price with Rs.
    };

    try {
      // Constructing URL with query parameters
      const params = new URLSearchParams({
        id: product.id,
        companyName: product.companyName,
        productName: product.productName,
        price: product.price,
        masking: product.masking,
        planType: product.planType,
        coverage: product.coverage,
        details: product.details,
        duration: '1 Day' // Or use product.duration if you have it
      }).toString();

      console.log('Sending data:', params); // Log data for debugging

      const response = await axios.post(`${BASE_URL}ProductEdit?${params}`, {}, {
        headers: {
          'accept': '*/*',
        },
      });

      console.log('Response from backend:', response.data); // Log backend response

      if (response.data) {
        if (response.data.responseCode === '0000') {
          // Success alert
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message || 'Product updated successfully!',
          }).then(() => {
            navigate('/products');
        });
        } else if (response.data.responseCode === '0001') {
          // Custom alert for responseCode 0001
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: response.data.message || 'Warning! There was an issue updating the product.',
          });
        } else {
          // General error alert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message || 'There was an error updating the product.',
          });
        }
      }
    } catch (err) {
      // Catch error for the request
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the product.',
      });
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Container className="mt-4">
      <div className="card shadow-sm">
        <div className="card-header text-center bg-primary text-white">
          <h2>Edit Product</h2>
        </div>
        <div className="card-body">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Product ID - Read-only */}
              <Col md={6} className="mb-3">
                <Form.Group controlId="productId">
                  <Form.Label>Product ID</Form.Label>
                  <Form.Control type="text" value={product.id} readOnly />
                </Form.Group>
              </Col>

              {/* Product Name */}
              <Col md={6} className="mb-3">
                <Form.Group controlId="productName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Product Name"
                    name="productName"
                    value={product.productName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Company Name */}
              <Col md={6} className="mb-3">
                <Form.Group controlId="companyName">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Company Name"
                    name="companyName"
                    value={product.companyName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Price */}
              <Col md={6} className="mb-3">
                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Masking */}
              <Col md={6} className="mb-3">
                <Form.Group controlId="masking">
                  <Form.Label>Masking</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Masking"
                    name="masking"
                    value={product.masking}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Plan Type */}
              <Col md={6} className="mb-3">
                <Form.Group controlId="planType">
                  <Form.Label>Plan Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="planType"
                    value={product.planType}
                    onChange={handleChange}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Monthly">Monthly</option>
                    <option value="6 Month">6 Month</option>
                    <option value="Yearly">Yearly</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              {/* Coverage */}
              <Col md={6} className="mb-3">
                <Form.Group controlId="coverage">
                  <Form.Label>Coverage</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Coverage"
                    name="coverage"
                    value={product.coverage}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Details */}
              <Col md={12} className="mb-3">
  <Form.Group controlId="details">
    <Form.Label>Details/Features</Form.Label>
    <ReactQuill
      value={product.details}
      onChange={(value) => handleChange({ target: { name: "details", value } })}
      modules={{
        toolbar: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline"],
          ["link"],
          [{ align: [] }],
          ["image"],
        ],
      }}
      className="form-control"
      style={{ height: "250px" }}
    />
    
  </Form.Group>
</Col>

            </Row>

            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit" className="w-50" disabled={loading}>
                {loading ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default ChangeinProduct;
