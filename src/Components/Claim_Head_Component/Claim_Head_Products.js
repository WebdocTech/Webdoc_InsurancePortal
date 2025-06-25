import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { BASE_URL } from "../../Config";
import { useNavigate } from "react-router-dom";

const Claim_Head_Products = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}Products`, {
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

  const uniqueCompanies = [...new Set(packages.map((pkg) => pkg.companyName))];

  // Function to filter the packages based on the search term
  const filteredPackages = packages
    .filter((pkg) => {
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
    })
    .filter((pkg) => {
      if (selectedCompany === "") return true; // If no company selected, show all
      return pkg.companyName === selectedCompany; // Filter by selected company
    });
  const handleDetailsClick = (id) => {
    navigate(`/ProductEdit/${id}`);
  };
  // Columns definition for DataTable
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

        {/* Dropdown to select company */}
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <select
                className="form-control"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">Select a Company</option>
                {uniqueCompanies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>

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

export default Claim_Head_Products;
