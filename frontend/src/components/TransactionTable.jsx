function TransactionTable({
    transactions,
    editingId,
    editAmount,
    setEditAmount,
    editDescription,
    setEditDescription,
    editType,
    setEditType,
    editTransactionDate,
    setEditTransactionDate,
    startEdit,
    cancelEdit,
    handleUpdate,
    handleDelete,
  }) {
    if (transactions.length === 0) {
      return <p>No matching transactions found.</p>;
    }
  
    return (
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {editingId === transaction.id ? (
              <div>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
  
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
  
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
  
                <input
                  type="date"
                  value={editTransactionDate}
                  onChange={(e) => setEditTransactionDate(e.target.value)}
                />
  
                <button onClick={() => handleUpdate(transaction.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>
                  Date:{" "}
                  {new Date(transaction.transaction_date).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
  
                <strong>{transaction.type}</strong> - {transaction.description} -
                £{transaction.amount}
  
                <button onClick={() => startEdit(transaction)}>Edit</button>
                <button onClick={() => handleDelete(transaction.id)}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }
  
  export default TransactionTable;