import { useState } from "react";
import Navbar from "../components/Navbar";
import ReportSection from "../components/ReportSection";
import API from "../api/api";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils/formatCurrency";

function Reports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState(null);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates.");
      return;
    }

    if (startDate > endDate) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    try {
      const res = await API.get(
        `/reports?start_date=${startDate}&end_date=${endDate}`
      );

      setReport(res.data);
      toast.success("Report generated successfully.");
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.message);
      toast.error("Report could not be generated.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Accounting Reports
          </h1>
          <p className="text-gray-500 mt-1">
            Select any date range to calculate cash, bank, expenses and net profit.
          </p>
        </div>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            Date Range
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleGenerateReport}
              className="md:self-end bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-3 transition"
            >
              Generate Report
            </button>
          </div>
        </section>

        {!report ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 text-center">
            <p className="text-5xl mb-4">📊</p>
            <h2 className="text-xl font-semibold text-gray-800">
              No report generated yet
            </h2>
            <p className="text-gray-500 mt-2">
              Choose a start date and end date to generate an accounting report.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
                <p className="text-sm text-green-700 font-medium">
                  Total Income
                </p>
                <p className="text-3xl font-bold text-green-800 mt-2">
                  {formatCurrency(report.income.total)}
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
                <p className="text-sm text-red-700 font-medium">
                  Total Expense
                </p>
                <p className="text-3xl font-bold text-red-800 mt-2">
                  {formatCurrency(report.expense.total)}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                <p className="text-sm text-blue-700 font-medium">
                  Net Profit
                </p>
                <p className="text-3xl font-bold text-blue-800 mt-2">
                  {formatCurrency(report.balance.net_profit)}
                </p>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReportSection title="Income">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cash Income</span>
                    <span className="font-semibold">
                      {formatCurrency(report.income.cash)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Income</span>
                    <span className="font-semibold">
                      {formatCurrency(report.income.bank)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-medium text-gray-900">
                      Total Income
                    </span>
                    <span className="font-bold text-green-700">
                      {formatCurrency(report.income.total)}
                    </span>
                  </div>
                </div>
              </ReportSection>

              <ReportSection title="Expenses">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cash Expense</span>
                    <span className="font-semibold">
                      {formatCurrency(report.expense.cash)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Expense</span>
                    <span className="font-semibold">
                      {formatCurrency(report.expense.bank)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-medium text-gray-900">
                      Total Expense
                    </span>
                    <span className="font-bold text-red-700">
                      {formatCurrency(report.expense.total)}
                    </span>
                  </div>
                </div>
              </ReportSection>

              <ReportSection title="Balances">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Till Balance</span>
                    <span className="font-semibold">
                      {formatCurrency(report.balance.till)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Balance</span>
                    <span className="font-semibold">
                      {formatCurrency(report.balance.bank)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-medium text-gray-900">
                      Net Profit
                    </span>
                    <span className="font-bold text-blue-700">
                      {formatCurrency(report.balance.net_profit)}
                    </span>
                  </div>
                </div>
              </ReportSection>

              <ReportSection title="Transaction Summary">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Transactions</span>
                    <span className="font-semibold">
                      {report.transactions.count}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 pt-2">
                    Report period: {report.period.start_date} to{" "}
                    {report.period.end_date}
                  </div>
                </div>
              </ReportSection>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Reports;