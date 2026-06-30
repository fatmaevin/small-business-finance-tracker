import { formatCurrency } from "../utils/formatCurrency";

function SummaryCards({ summary }) {
  if (!summary) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">Loading summary...</p>
      </div>
    );
  }

  const isPositiveBalance = summary.balance >= 0;

  const cards = [
    {
      title: "Total Income",
      value: formatCurrency(summary.total_income),
      icon: "💰",
      className: "bg-green-50 border-green-200",
      textClass: "text-green-700",
    },
    {
      title: "Total Expense",
      value: formatCurrency(summary.total_expense),
      icon: "💸",
      className: "bg-red-50 border-red-200",
      textClass: "text-red-700",
    },
    {
      title: "Balance",
      value: formatCurrency(summary.balance),
      icon: "📈",
      className: isPositiveBalance
        ? "bg-blue-50 border-blue-200"
        : "bg-red-50 border-red-200",
      textClass: isPositiveBalance ? "text-blue-700" : "text-red-700",
    },
    {
      title: "Transactions",
      value: summary.transaction_count,
      icon: "🧾",
      className: "bg-purple-50 border-purple-200",
      textClass: "text-purple-700",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.className} border rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{card.title}</p>
            <span className="text-2xl">{card.icon}</span>
          </div>

          <p className={`text-2xl font-bold mt-3 ${card.textClass}`}>
            {card.value}
          </p>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;