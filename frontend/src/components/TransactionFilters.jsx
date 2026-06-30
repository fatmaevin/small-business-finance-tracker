function TransactionFilters({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <input
          type="text"
          placeholder="🔍 Search description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => setDateFilter("")}
          className="bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 transition"
        >
          Clear Date
        </button>

      </div>
    </div>
  );
}

export default TransactionFilters;