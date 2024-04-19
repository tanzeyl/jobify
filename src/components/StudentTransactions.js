import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PieChartComponent from "./PieChartComponent";

function StudentTransactions() {
  document.title = "Jobify - Student Payment History";
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [data, setdata] = useState([]);

  const formatDate = (string) => {
    const date = new Date(string);
    const formattedDate = date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    });
    return formattedDate;
  };

  const getTransactions = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/paymentHistory`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    setTransactions(json.transactions);
    let debit = 0;
    let credit = 0;
    for (let i = 0; i < json.transactions.length; i++) {
      if (json.transactions[i].type === "credit") {
        credit += parseInt(json.transactions[i].amount);
      } else {
        debit += parseInt(json.transactions[i].amount);
      }
    }
    let tempData = [];
    tempData.push({ name: "Credit", value: credit });
    tempData.push({ name: "Debit", value: debit });
    setdata(tempData);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getTransactions();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="tableContainer mt-4">
        <table className="table table-responsive table-bordered table-hover">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item, index) => {
              let date = formatDate(item.timestamp);
              return (
                <tr key={index}>
                  <td>Rs. {item.amount}/-</td>
                  <td>{item.type.toUpperCase()}</td>
                  <td>{item.reason}</td>
                  <td>{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PieChartComponent data={data} />
    </>
  );
}

export default StudentTransactions;
