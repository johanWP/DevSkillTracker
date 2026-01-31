
import React, { useState, useEffect } from 'react';
import { getDevelopers } from '../services/firebaseService';
import { Developer } from '../types';

const DeveloperList: React.FC = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const devs = await getDevelopers();
        setDevelopers(devs);
      } catch (err) {
        setError('Failed to fetch developers. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevelopers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <span className="ml-4 text-gray-600">Loading developers...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600 bg-red-100 rounded-md">{error}</div>;
  }

  return (
    <div className="p-2 bg-white rounded-lg shadow-md">
      <h2 className="p-4 text-2xl font-bold text-gray-800 border-b">Developers</h2>
      {developers.length === 0 ? (
        <p className="p-4 text-center text-gray-500">No developers found. Use 'Add Developer' to create one.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Email</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Role</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Project</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Active</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Skills</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {developers.map((dev) => (
                <tr key={dev.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{dev.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{dev.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{dev.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{dev.project}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dev.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {dev.active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {dev.skills.map(skill => skill.name).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeveloperList;
