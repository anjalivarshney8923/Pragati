import React from 'react';

const Table = ({ columns, data, keyField = "id" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500 text-sm">
                  No data available.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row[keyField]} className="hover:bg-slate-50/50 transition-colors group">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
