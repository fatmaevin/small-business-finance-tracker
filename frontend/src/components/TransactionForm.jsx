function TransactionForm({
    amount,
    setAmount,
    description,
    setDescription,
    type,
    setType,
    transactionDate,
    setTransactionDate,
    handleTransaction,
  }) {
    return (
      <div>
        <h2>Add Transaction</h2>
  
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
  
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
  
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
  
        <input
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
        />
  
        <button onClick={handleTransaction}>Add Transaction</button>
      </div>
    );
  }
  
  export default TransactionForm;