function TransactionFilters({ search, setSearch, dateFilter, setDateFilter }) {
    return (
      <div>
        <input
          placeholder="Search by description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
  
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
  
        <button onClick={() => setDateFilter("")}>Clear Date</button>
      </div>
    );
  }
  
  export default TransactionFilters;