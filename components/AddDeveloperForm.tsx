import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for firebaseService to point to the 'src' directory.
import { getSkillsCatalog, addDeveloper, developerExists } from '../src/services/firebaseService';
// FIX: Corrected import path for types to point to the 'src' directory.
import { Skill } from '../src/types';

const initialFormState = {
  name: '',
  employeeId: '',
  email: '',
  location: '',
  role: '',
  project: '',
  active: true,
};

const AddDeveloperForm: React.FC = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillCatalog, setSkillCatalog] = useState<string[]>([]);
  
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentProficiency, setCurrentProficiency] = useState(3);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      const catalog = await getSkillsCatalog();
      setSkillCatalog(catalog);
      if (catalog.length > 0) {
        setCurrentSkill(catalog[0]);
      }
    };
    fetchSkills();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleAddSkill = () => {
    if (currentSkill && !skills.some(s => s.name === currentSkill)) {
      setSkills(prev => [...prev, { name: currentSkill, proficiency: currentProficiency }]);
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(prev => prev.filter(s => s.name !== skillName));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSkills([]);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email) {
      setError('Name and Email are required fields.');
      return;
    }

    setIsLoading(true);
    const normalizedEmail = formData.email.trim().toLowerCase();

    try {
      const exists = await developerExists(normalizedEmail);
      if (exists) {
        setError('A developer with this email already exists.');
        setIsLoading(false);
        return;
      }
      
      const newDeveloper = { ...formData, email: normalizedEmail, skills };
      await addDeveloper(newDeveloper);
      
      setSuccess(`Developer "${formData.name}" created successfully.`);
      resetForm();
    } catch (err) {
      setError('Failed to create developer. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Add New Developer</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Form Fields */}
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
          <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
          <InputField label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
          <InputField label="Location" name="location" value={formData.location} onChange={handleInputChange} />
          <InputField label="Role" name="role" value={formData.role} onChange={handleInputChange} />
          <InputField label="Project" name="project" value={formData.project} onChange={handleInputChange} />
        </div>
        
        <div className="pt-2">
           <label className="flex items-center space-x-3">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleInputChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-gray-700">Active Developer</span>
            </label>
        </div>

        {/* Skills Section */}
        <div className="p-4 border rounded-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Skills</h3>
            <div className="flex items-end space-x-2">
                <div className="flex-1">
                    <label htmlFor="skill-select" className="block text-sm font-medium text-gray-700">Skill</label>
                    <select id="skill-select" value={currentSkill} onChange={e => setCurrentSkill(e.target.value)} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {skillCatalog.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                    </select>
                </div>
                <div>
                     <label htmlFor="proficiency-select" className="block text-sm font-medium text-gray-700">Proficiency (1-5)</label>
                     <select id="proficiency-select" value={currentProficiency} onChange={e => setCurrentProficiency(Number(e.target.value))} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {[1,2,3,4,5].map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
                </div>
                <button type="button" onClick={handleAddSkill} className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Add Skill</button>
            </div>
            <div className="mt-4 space-y-2">
                {skills.map(skill => (
                    <div key={skill.name} className="flex items-center justify-between p-2 text-sm bg-gray-100 rounded-md">
                        <span>{skill.name} - Proficiency: {skill.proficiency}</span>
                        <button type="button" onClick={() => handleRemoveSkill(skill.name)} className="text-red-500 hover:text-red-700">&times;</button>
                    </div>
                ))}
                {skills.length === 0 && <p className="text-sm text-center text-gray-500">No skills added yet.</p>}
            </div>
        </div>

        {/* Messages and Actions */}
        {error && <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-md">{error}</div>}
        {success && <div className="p-3 text-sm text-center text-green-800 bg-green-100 rounded-md">{success}</div>}

        <div className="flex justify-end pt-4 space-x-4">
          <button type="button" onClick={resetForm} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Reset Form</button>
          <button type="submit" disabled={isLoading} className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300">
            {isLoading ? 'Saving...' : 'Save Developer'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable InputField component
const InputField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean}> = 
({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);

export default AddDeveloperForm;