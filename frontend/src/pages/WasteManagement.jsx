import React, { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import "./waste/waste.css";
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
