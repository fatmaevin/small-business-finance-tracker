function SummaryCards({ summary }) {
  if (!summary) {
    return <p className="text-gray-500">Loading summary...</p>;
  }

  const cards = [
    {
      title: "Total Income",
      value: `£${summary.total_income}`,
    },
    {
      title: "Total Expense",
      value: `£${summary.total_expense}`,
    },
    {
      title: "Balance",
      value: `£${summary.balance}`,
    },
    {
      title: "Transactions",
      value: summary.transaction_count,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
        >
          <p className="text-sm text-gray-500">{card.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {card.value}
          </p>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;