import React, { useState, useEffect } from 'react';
import '../css_files/Finance.css';

const Finance = () => {
  const [duePayments, setDuePayments] = useState([
    { id: 1, type: 'AMENITY FEE', amount: 150000, dueDate: '31/05/2025' },
    { id: 2, type: 'CULTURAL FEE', amount: 2500, dueDate: '24/04/2025' }
  ]);

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Initialize payment history when component mounts
    const initialHistory = [
      {
        id: 1,
        type: 'AMENITY FEE',
        amount: 150000,
        mode: 'Online',
        reference: '346442229',
        date: 'Jun 5 2024 7:34AM'
      }
      // Add more initial history items
    ];
    setPaymentHistory(initialHistory);
  }, []);

  const handlePayment = (payment) => {
    console.log('Pay Now clicked', payment);
    setCurrentPayment(payment);
    setIsPaymentModalOpen(true);
    console.log('Modal should be open now');
  };

  const confirmPayment = () => {
    if (!currentPayment) return;

    // Generate reference number
    const reference = Math.floor(Math.random() * 900000000) + 100000000;
    const date = new Date().toLocaleString('en-IN');

    // Add to payment history
    setPaymentHistory(prev => [
      {
        id: Date.now(),
        type: currentPayment.type,
        amount: currentPayment.amount,
        mode: 'Online',
        reference,
        date
      },
      ...prev
    ]);

    // Remove from due payments
    setDuePayments(prev => prev.filter(p => p.id !== currentPayment.id));

    // Show success notification
    setNotification({ message: 'Payment successful!', type: 'success' });

    // Reset state
    setIsPaymentModalOpen(false);
    setCurrentPayment(null);

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  const printReceipt = (ref, feeType, amount) => {
    const content = `
      <div style="font-family: Arial; max-width: 400px; padding: 20px;">
        <h2 style="text-align:center; color:#2ecc71;">Payment Receipt</h2><hr>
        <p><strong>Reference:</strong> ${ref}</p>
        <p><strong>Fee Type:</strong> ${feeType}</p>
        <p><strong>Amount:</strong> ₹${amount.toLocaleString()}</p>
        <p><strong>Method:</strong> Online</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p><hr>
        <p style="text-align:center; font-size:12px;">This is a computer generated receipt.</p>
      </div>
    `;

    const win = window.open('', '_blank');
    if (!win) {
      setNotification({ message: 'Pop-up blocked!', type: 'info' });
      return;
    }

    win.document.write(`<html><head><title>Receipt</title></head><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  const closeModal = () => {
    setIsPaymentModalOpen(false);
    setCurrentPayment(null);
  };

  const getTotalAmount = () => {
    return duePayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  return (
    <div className="Financial-container">
      <h1 className="page-title">Financial Record</h1>

      {/* Due List Section */}
      <div className="section">
        <div className="section-header due-header">
          <span className="icon">📋</span>
          DUE LIST
        </div>
        <div className="table-container">
          <table className="data-table" id="dueTable">
            <thead>
              <tr>
                <th className="sortable" data-column="feeType">Fee Type</th>
                <th className="sortable" data-column="amount">Amount</th>
                <th className="sortable" data-column="dueDate">Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {duePayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.type}</td>
                  <td>₹{payment.amount.toLocaleString()}</td>
                  <td>{payment.dueDate}</td>
                  <td>
                    <button 
                      className="pay-now-btn" 
                      onClick={() => handlePayment(payment)}
                    >
                      Pay Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-amount">
            Total Amount: ₹<span id="totalAmount">{getTotalAmount().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="section">
        <div className="section-header payment-header">
          <span className="icon">💳</span>
          PAYMENT HISTORY
        </div>
        <div className="table-container">
          <table className="data-table" id="historyTable">
            <thead>
              <tr>
                <th>Fee Type</th>
                <th className="sortable" data-column="amount">Amount <span className="sort-icon">▲</span></th>
                <th>Mode of Payment</th>
                <th>Reference</th>
                <th>Dated On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.type}</td>
                  <td>₹{payment.amount.toLocaleString()}</td>
                  <td>{payment.mode}</td>
                  <td>{payment.reference}</td>
                  <td>{payment.date}</td>
                  <td>
                    <button 
                      className="print-btn" 
                      onClick={() => printReceipt(payment.reference, payment.type, payment.amount)}
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <div className={`modal ${isPaymentModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <h2>Payment Confirmation</h2>
          {currentPayment && (
            <div id="paymentDetails">
              <p><strong>Fee Type:</strong> {currentPayment.type}</p>
              <p><strong>Amount:</strong> ₹{currentPayment.amount.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> Online</p>
            </div>
          )}
          <div className="modal-buttons">
            <button className="confirm-btn" onClick={confirmPayment}>Confirm Payment</button>
            <button className="cancel-btn" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div 
          className={`notification ${notification.type}`}
          style={{
            position: 'fixed', 
            top: '20px', 
            right: '20px',
            padding: '15px 20px',
            borderRadius: '5px',
            color: 'white',
            backgroundColor: notification.type === 'success' ? '#2ecc71' : '#e74c3c',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Finance;