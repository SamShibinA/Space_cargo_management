import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import deleteIcon from "../assets/delete.svg";

const WasteManagement = () => {
  const [waste, setwaste] = useState([]);

  useEffect(() => {
    setwaste([
      {
        id: 1,
        itemId: 212,
        containerId: "Container 1",
        itemname: "Banana",
        ExpDate: "20/03/2025",
        reason: "Expired",
      },
      {
        id: 2,
        itemId: 345,
        containerId: "Container 2",
        itemname: "Bread",
        ExpDate: "23/04/2025",
        reason: "Damaged",
      },
    ]);
  }, []);

  const handleDelete = (id) => {
    setwaste(waste.filter((item) => item.id !== id));
  };

  return (
    <Container maxWidth={false} style={{ padding: "20px" }}>
      <style>
        {`
          .full-width-table {
            width: 100%;
            overflow-x: auto;
          }
          .responsive-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          .responsive-table thead {
            background-color: rgb(54, 105, 215);
            color: white;
          }
          .responsive-table th, .responsive-table td {
            border: 1px solid rgb(208, 218, 227);
            text-align: center;
            padding: 12px;
          }
          .delete-btn {
            background: none;
            border: none;
            cursor: pointer;
          }
          .delete-icon {
            width: 20px;
            height: 20px;
          }
          @media (max-width: 768px) {
            .responsive-table thead {
              display: none;
            }
            .responsive-table tr {
              display: block;
              margin-bottom: 15px;
              border: 1px solid #ddd;
            }
            .responsive-table td {
              display: block;
              text-align: right;
              padding: 8px;
              position: relative;
            }
            .responsive-table td::before {
              content: attr(data-label);
              position: absolute;
              left: 10px;
              text-align: left;
              font-weight: bold;
            }
          }
        `}
      </style>
      <Typography variant="h4" align="center">
        Waste Management
      </Typography>
      <Typography align="center" gutterBottom>
        Track expired/depleted items and manage waste disposal.
      </Typography>
      <h3>Expired Items:</h3>
      <div className="full-width-table">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Id</th>
              <th>Container Id</th>
              <th>Item Name</th>
              <th>Expiry Date</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {waste.map((item, index) => (
              <tr key={index}>
                <td data-label="S.No:">{item.id}</td>
                <td data-label="Item Id:">{item.itemId}</td>
                <td data-label="Container Id:">{item.containerId}</td>
                <td data-label="Item Name:">{item.itemname}</td>
                <td data-label="Expiry Date:">{item.ExpDate}</td>
                <td data-label="Reason:">{item.reason}</td>
                <td data-label="Action:">
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                    <img src={deleteIcon} alt="Delete" className="delete-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default WasteManagement;
