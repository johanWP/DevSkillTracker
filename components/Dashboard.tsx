
import React, { useState } from 'react';
import { User, signOutUser } from '../services/firebaseService';
import DeveloperList from './DeveloperList';
import AddDeveloperForm from './AddDeveloperForm';
import SettingsView from './SettingsView';

interface DashboardProps {
  user: User;
}

type View = 'developers' | 'add-developer' | 'settings';

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeView, setActiveView] = useState<View>('developers');

  const renderView = () => {
    switch (activeView) {
      case 'developers':
        return <DeveloperList />;
      case 'add-developer':
        return <AddDeveloperForm />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DeveloperList />;
    }
  };

  const NavButton: React.FC<{ view: View; label: string }> = ({ view, label }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeView === view
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">DevSkillTracker</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button
            onClick={signOutUser}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Log out
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-56 p-4 bg-white border-r">
          <nav className="flex flex-col space-y-2">
            <NavButton view="developers" label="Developers" />
            <NavButton view="add-developer" label="Add Developer" />
            <NavButton view="settings" label="Settings" />
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
