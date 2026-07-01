function TransactionForm({
  amount,
  setAmount,
  description,
  setDescription,
  type,
  setType,
  paymentMethod,
  setPaymentMethod,
  category,
  setCategory,
  paidFromTill,
  setPaidFromTill,
  transactionDate,
  setTransactionDate,
  handleTransaction,
}) {
  const incomeCategories = ["sales", "other income"];

  const expenseCategories = [
    "supplier",
    "rent",
    "utilities",
    "cleaning",
    "wages",
    "maintenance",
    "other",
  ];

  const categoryOptions =
    type === "income"
      ? incomeCategories
      : type === "expense"
      ? expenseCategories
      : [];

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setCategory("");
    setPaidFromTill(false);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setPaidFromTill(false);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Add Transaction
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={type}
            onChange={handleTypeChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select method</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={!type}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {type ? "Select category" : "Select type first"}
            </option>

            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {type === "expense" && paymentMethod === "cash" && (
          <label className="md:col-span-2 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
            <input
              type="checkbox"
              checked={paidFromTill}
              onChange={(e) => setPaidFromTill(e.target.checked)}
              className="h-4 w-4"
            />

            <span className="text-sm text-blue-800">
              Paid from today's till
            </span>
          </label>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            placeholder="Transaction description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (£)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleTransaction}
        className="mt-8 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
      >
        Add Transaction
      </button>
    </section>
  );
}

export default TransactionForm;