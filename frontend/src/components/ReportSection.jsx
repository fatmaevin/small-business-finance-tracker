function ReportSection({ title, children, className = "" }) {
    return (
      <section
        className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 ${className}`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        {children}
      </section>
    );
  }
  
  export default ReportSection;