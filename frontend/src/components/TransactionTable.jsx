import { formatCurrency } from "../utils/formatCurrency";

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
      return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 text-center">
        <p className="text-5xl mb-4">📄</p>

        <h2 className="text-xl font-semibold text-gray-800">
            No transactions found
        </h2>

  <p className="text-gray-500 mt-2">
    Try changing your filters or add a new transaction.
  </p>
</div>
      );
    }
  
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Description
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Amount
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
  
            <tbody>
              {transactions.map((transaction) => {
                const isIncome = transaction.type === "income";
  
                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {editingId === transaction.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={editTransactionDate}
                            onChange={(e) =>
                              setEditTransactionDate(e.target.value)
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </td>
  
                        <td className="px-4 py-3">
                          <input
                            value={editDescription}
                            onChange={(e) =>
                              setEditDescription(e.target.value)
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </td>
  
                        <td className="px-4 py-3">
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                          >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                          </select>
                        </td>
  
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </td>
  
                        <td className="px-4 py-3 space-x-2">
                          <button
                            onClick={() => handleUpdate(transaction.id)}
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Save
                          </button>
  
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(
                            transaction.transaction_date
                          ).toLocaleDateString("en-GB")}
                        </td>
  
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {transaction.description}
                        </td>
  
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isIncome
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
  
                        <td
                          className={`px-4 py-3 font-semibold ${
                            isIncome ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </td>
  
                        <td className="px-4 py-3 space-x-2">
                          <button
                            onClick={() => startEdit(transaction)}
                            className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100"
                          >
                            Edit
                          </button>
  
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  export default TransactionTable;