import React, { useState, useEffect } from 'react';
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';
import axios from 'axios';

export const OrdersPage = (params) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/order`)
      .then((response) => {
        console.log(response);
        setOrders(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [apiUrl]);

  const handleDelete = (orderId) => {
    axios
      .delete(`${apiUrl}/order/${orderId}`)
      .then((response) => {
        console.log(response);
        setOrders(orders.filter((x) => x.OrderId !== orderId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Order ID</th>
            <th scope="col">Order Date</th>
            <th scope="col">Total Amount</th>
            <th scope="col" colSpan="2" className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{order.OrderId}</td>
              <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
              <td>Rs. {order.TotalAmount}</td>
              <td className="text-center">
                <PDFDownloadLink
                  document={<OrderReceipt order={order} />}
                  className="btn btn-secondary"
                  fileName={`order-${order.OrderId}-summary.pdf`}>
                  {({ blob, url, loading, error }) =>
                    loading ? 'Loading..' : 'Get Summary'
                  }
                </PDFDownloadLink>
              </td>
              <td className="text-center">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(order.OrderId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const OrderReceipt = (params) => {
  const { order } = params;
  return (
    <Document>
      <Page size="A4">
        <View style={styles.section}>
          <Text>Order ID #{order.OrderId}</Text>
          <Text>Order Date: {new Date(order.OrderDate).toDateString()}</Text>
          <Text>Totol Amount: Rs. {order.TotalAmount} /=</Text>
        </View>
        <View style={styles.section}></View>
      </Page>
    </Document>
  );
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});
