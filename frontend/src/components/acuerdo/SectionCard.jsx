function SectionCard({ title, subtitle, help, children }) {
    return (
      <section className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children}
        {help && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm text-yellow-900">
            {help}
          </div>
        )}
      </section>
    );
  }
  