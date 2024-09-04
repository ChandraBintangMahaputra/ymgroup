import React, { useEffect, useState } from 'react';

const CompanyData: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/get-company`)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          setCompanies(result.data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ditolak':
        return 'bg-red-100 text-red-600';
      case 'diterima':
        return 'bg-green-100 text-green-600';
      case 'menunggu jawaban':
        return 'bg-yellow-100 text-yellow-600';
      case 'belum diproses':
        return 'bg-gray-200 text-gray-600';
      default:
        return '';
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Company Data</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
    
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Data Not Found
                </td>
              </tr>
            ) : (
              companies.map((company, index) => (
                <tr key={company.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.company_name}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(company.status)}`}>
                    {company.status}
                  </td>
                
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyData;
