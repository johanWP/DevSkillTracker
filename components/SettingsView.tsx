import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for firebaseService to point to the 'src' directory.
import { getSkillsCatalog } from '../src/services/firebaseService';

const SettingsView: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const catalog = await getSkillsCatalog();
        setSkills(catalog);
      } catch (err) {
        setError('Failed to load skills catalog.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="pb-4 mb-6 text-2xl font-bold text-gray-800 border-b">Settings</h2>
      <h3 className="mb-4 text-lg font-semibold text-gray-700">Available Skills Catalog</h3>
      <p className="mb-4 text-sm text-gray-600">
        This is the list of predefined skills available when adding a developer. To add or remove skills, edit the 'skillsCatalog' document in the 'config' collection in Firestore.
      </p>
      
      {isLoading && <p className="text-gray-500">Loading skills...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!isLoading && !error && (
        <div className="p-4 bg-gray-50 border rounded-md">
          <ul className="grid grid-cols-2 gap-2 list-disc list-inside md:grid-cols-3">
            {skills.map(skill => (
              <li key={skill} className="text-gray-800">{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettingsView;