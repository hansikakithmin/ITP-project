import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';
import axios from 'axios';

export const PaymentsPage = (params) => {
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL;
  const { newPayment, cartItems } = params;
  const itemPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const [cardPayment, setCardPayment] = useState(false);

  const [name, setName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const [payments, setPayments] = useState([]);

  const [isChanged, setIsChanged] = useState('');

  useEffect(() => {
    axios
      .get(`${apiUrl}/payment`)
      .then((response) => {
        console.log(response.data);
        setPayments(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return isChanged;
  }, [apiUrl, isChanged]);

  const handlePaymentOptions = (e) => {
    setPaymentMethod(e.target.value);

    if (e.target.value === 'card') {
      setCardPayment(true);
    } else {
      setCardPayment(false);
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    let paymentForm = document.getElementById('paymentForm');
    let isFormValid = paymentForm.checkValidity();
    paymentForm.reportValidity();

    if (isFormValid) {
      let order = {
        OrderDate: new Date().toISOString(),
        LineItems: JSON.stringify(cartItems),
        TotalAmount: itemPrice,
      };

      axios
        .post(`${apiUrl}/order`, order)
        .then((response) => {
          console.log(response);
          let payment = {
            CustomerName: name,
            PaymentDate: new Date().toISOString(),
            PaymentMethod: paymentMethod,
            Address: address,
            CardNumber: cardNumber,
            TotalAmount: itemPrice,
            OrderId: response.data.OrderId,
          };

          axios
            .post(`${apiUrl}/payment`, payment)
            .then((response) => {
              console.log(response);
              params.setCartItems([]);
              setIsChanged(response.data);
              history.push('/payments');
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelete = (paymentId) => {
    axios
      .delete(`${apiUrl}/payment/${paymentId}`)
      .then((response) => {
        console.log(response);
        setPayments(payments.filter((x) => x.PaymentId !== paymentId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      {newPayment ? (
        <form className="row g-3" id="paymentForm">
          <div className="col-md-6">
            <label htmlFor="username" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              onChange={(e) => setName(e.target.value)}
              required></input>
          </div>
          <div className="col-md-6">
            <label htmlFor="payment-method" className="form-label">
              Payment Method
            </label>
            <select
              id="payment-method"
              className="form-select"
              onChange={(e) => handlePaymentOptions(e)}>
              <option defaultValue>Choose...</option>
              <option value="card">VISA / Mastercard</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              onChange={(e) => setAddress(e.target.value)}
              required></input>
          </div>
          <div className="col-12">
            <label htmlFor="inputCard" className="form-label">
              Card Number
            </label>
            <input
              type="text"
              className="form-control"
              id="inputCard"
              onChange={(e) => setCardNumber(e.target.value)}
              disabled={!cardPayment}></input>
          </div>
          <div className="col-6">Total Price:</div>
          <div className="col-6">
            <strong>Rs. {itemPrice.toFixed(2)}</strong>
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => handlePay(e)}>
              Pay
            </button>
          </div>
        </form>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Payment ID</th>
              <th scope="col">Order ID</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Payment Date</th>
              <th scope="col">Payment Method</th>
              <th scope="col">Total Amount</th>
              <th scope="col" colSpan="3" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{payment.PaymentId}</td>
                <td>{payment.OrderId}</td>
                <td>{payment.CustomerName}</td>
                <td>{new Date(payment.PaymentDate).toLocaleDateString()}</td>
                <td>
                  {payment.PaymentMethod === 'card'
                    ? 'Visa / Mastercard'
                    : 'Cash on Delivery'}
                </td>
                <td>Rs. {payment.TotalAmount} /=</td>
                <td className="text-center">
                  <PDFDownloadLink
                    document={<PaymentReceipt payment={payment} />}
                    className="btn btn-secondary"
                    fileName={`payment-${payment.PaymentId}-receipt.pdf`}>
                    {({ blob, url, loading, error }) =>
                      loading ? 'Loading..' : 'Get Receipt'
                    }
                  </PDFDownloadLink>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(`/payments/update/?id=${payment.PaymentId}`);
                    }}>
                    Update
                  </button>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(payment.PaymentId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const PaymentReceipt = (params) => {
  const { payment } = params;
  return (
    <Document>
      <Page size="A4">
        <View style={styles.section}>
          <Text>Payment ID #{payment.PaymentId}</Text>
          <Text>Order ID #{payment.OrderId}</Text>
          <Text>Customer Name: {payment.CustomerName}</Text>
          <Text>
            Payment Date: {new Date(payment.PaymentDate).toDateString()}
          </Text>
          <Text>
            Payement Method:{' '}
            {payment.PaymentMethod === 'card'
              ? 'Visa / Mastercard'
              : 'Cash on Delivery'}
          </Text>
          <Text>Totol Amount: Rs. {payment.TotalAmount} /=</Text>
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
