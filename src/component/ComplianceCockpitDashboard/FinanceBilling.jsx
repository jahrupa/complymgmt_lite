import React from "react";
import "../../style/financeBilling.css";
const financeBillingData = {
  title: "Finance & Billing",
  billingItems: [
    {
      label: "Outsourcing Billed",
      amount: "₹ 1,2 M",
      progress: 70
    },
    {
      label: "Compliance Billed",
      amount: "₹ 900 k",
      progress: 85
    },
    {
      label: "Payroll Billed",
      amount: "₹ 600 k",
      progress: 60
    },
    {
      label: "Outstanding",
      amount: "₹ 150 k",
      progress: 90,
      variant: "warning"
    }
  ],
  overdue: {
    label: "Overdue",
    amount: "₹ 150 k"
  }
};

const FinanceBilling = () => {
  const { title, billingItems, overdue } = financeBillingData;

  return (
    <div className="finance-billing">
      <h2>{title}</h2>
      <div className="billing-grid">
        {billingItems.map((item, index) => (
          <div key={index} className="billing-item">
            <h4 className="billing-label">{item.label}</h4>
            <div className="billing-amount">{item.amount}</div>
            <div className={`billing-progress ${item.variant || ""}`}>
              <div className="billing-fill" style={{ width: `${item.progress}%` }}></div>
            </div>
          </div>
        ))}

        <div className="billing-item overdue">
          <h4 className="billing-label">{overdue.label}</h4>
          <div className="billing-amount">{overdue.amount}</div>
        </div>
      </div>
    </div>
  );
};

export default FinanceBilling;
