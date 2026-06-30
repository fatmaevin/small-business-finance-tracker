function SummaryCards({ summary }) {
    if (!summary) {
      return <p>Loading summary...</p>;
    }
  
    return (
      <div>
        <h2>Summary</h2>
  
        <div>
          <p>Total Income: £{summary.total_income}</p>
          <p>Total Expense: £{summary.total_expense}</p>
          <p>Balance: £{summary.balance}</p>
          <p>Transactions: {summary.transaction_count}</p>
        </div>
      </div>
    );
  }
  
  export default SummaryCards;