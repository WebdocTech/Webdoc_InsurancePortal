import React, { useEffect, useState } from "react";
import { Container,Button } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { BASE_URL } from "../../Config"; 
import { useNavigate } from "react-router-dom"; 

const Key_Account_Manager_Product = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); 
  
  useEffect(() => {
    axios
      .get(`${BASE_URL}JazzProducts`, {
        headers: {
          Accept: "*/*",
        },
      })
      .then((response) => {
        if (response.data.responseCode === "0000") {
          setPackages(response.data.packages);
        }
      })
      .catch((error) => console.error("Error fetching packages:", error));
  }, []);

  // Function to filter the packages based on the search term
  const filteredPackages = packages.filter((pkg) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      (pkg.id && String(pkg.id).includes(lowercasedSearchTerm)) ||
      (pkg.productName &&
        pkg.productName.toLowerCase().includes(lowercasedSearchTerm)) ||
      (pkg.companyName &&
        pkg.companyName.toLowerCase().includes(lowercasedSearchTerm)) ||
      (pkg.price &&
        String(pkg.price).toLowerCase().includes(lowercasedSearchTerm)) ||
      (pkg.category &&
        String(pkg.category).toLowerCase().includes(lowercasedSearchTerm)) ||
      (pkg.planType &&
        String(pkg.planType).toLowerCase().includes(lowercasedSearchTerm)) ||
      (pkg.coverage &&
        String(pkg.coverage).toLowerCase().includes(lowercasedSearchTerm)) ||
      (pkg.details &&
        String(pkg.details).toLowerCase().includes(lowercasedSearchTerm))
    );
  });
  const handleDetailsClick = (id) => {
    navigate(`/ProductEdit/${id}`);
  };
  

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.productName,
      sortable: true,
    },
    {
      name: "Product Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Company",
      selector: (row) => row.companyName,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category || "-",
      sortable: true,
    },
    {
      name: "Plan Type",
      selector: (row) => row.planType || "-",
      sortable: true,
    },
    {
      name: "Coverage",
      selector: (row) => row.coverage,
      sortable: true,
    },
    {
      name: "Details",
      selector: (row) => row.details || "-",
      cell: (row) => (
        <div dangerouslySetInnerHTML={{ __html: row.details || "-" }} />
      ),
    },
    {
      name: "Action",
      selector: (row) => row.details || "-",
      cell: (row) => (
        <Button
        variant="primary"
        onClick={() => handleDetailsClick(row.id)}
        className="m-2 w-100"
      >
        Edit
      </Button>
      ),
    },
  ];

  return (
    <Container className="mt-4">
      <div className="card m-2">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-12 col-md-7">
              <h3 className="card-title text-center">Available Packages</h3>
            </div>

            <div className="col-12 col-md-2">
              <input
                type="text"
                placeholder="Search ..."
                className="form-control"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-3">
              <button
                type="button"
                className="btn btn-primary w-100 "
                onClick={() => navigate("/ProductCreate")}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <DataTable
            columns={columns}
            data={filteredPackages} // Display filtered data
            pagination
            responsive
            highlightOnHover
            dense
            defaultSortFieldId={1} // Default sort by the first column
            paginationPerPage={10} // Set number of items per page
            paginationRowsPerPageOptions={[5, 10, 15, 20]} // Pagination options
          />
          <div className="d-flex justify-content-between mb-3">
            <CSVLink
              data={filteredPackages} // Download filtered data as CSV
              filename={"packages.csv"}
              className="btn btn-success w-100"
              target="_blank"
            >
              Download CSV
            </CSVLink>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Key_Account_Manager_Product;
