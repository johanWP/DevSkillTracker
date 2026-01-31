// FIX: Import test functions and types directly from @jest/globals to avoid environment configuration issues.
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddDeveloperForm from '../components/AddDeveloperForm';
import * as firebaseService from '../services/firebaseService';

// Mock the firebaseService module
jest.mock('../services/firebaseService');

const mockedGetSkillsCatalog = firebaseService.getSkillsCatalog as jest.Mock;
const mockedDeveloperExists = firebaseService.developerExists as jest.Mock;
const mockedAddDeveloper = firebaseService.addDeveloper as jest.Mock;

const mockSkills = ["React", "TypeScript", "Node.js"];

describe('AddDeveloperForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetSkillsCatalog.mockResolvedValue(mockSkills);
    mockedDeveloperExists.mockResolvedValue(false);
    mockedAddDeveloper.mockResolvedValue(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders the form and fetches the skills catalog', async () => {
    render(<AddDeveloperForm />);
    
    expect(screen.getByRole('heading', { name: /add new developer/i })).toBeInTheDocument();
    
    // Wait for skills to be loaded into the select dropdown
    await waitFor(() => {
      expect(mockedGetSkillsCatalog).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByRole('option', { name: 'React' })).toBeInTheDocument();
  });

  it('shows validation error if required fields are empty on submit', async () => {
    render(<AddDeveloperForm />);
    const saveButton = screen.getByRole('button', { name: /save developer/i });
    
    fireEvent.click(saveButton);
    
    expect(await screen.findByText('Name and Email are required fields.')).toBeInTheDocument();
    expect(mockedAddDeveloper).not.toHaveBeenCalled();
  });

  it('allows adding and removing skills', async () => {
    const user = userEvent.setup();
    render(<AddDeveloperForm />);
    await waitFor(() => expect(mockedGetSkillsCatalog).toHaveBeenCalled());

    const skillSelect = screen.getByLabelText('Skill');
    const addSkillButton = screen.getByRole('button', { name: /add skill/i });
    
    // Add TypeScript skill
    await user.selectOptions(skillSelect, 'TypeScript');
    await user.click(addSkillButton);

    expect(screen.getByText(/typescript - proficiency: 3/i)).toBeInTheDocument();

    // Remove TypeScript skill
    const removeButton = screen.getByRole('button', { name: /×/i });
    await user.click(removeButton);

    expect(screen.queryByText(/typescript - proficiency: 3/i)).not.toBeInTheDocument();
  });

  it('shows an error if a developer with the same email already exists', async () => {
    const user = userEvent.setup();
    mockedDeveloperExists.mockResolvedValue(true); // Mock that the developer exists
    
    render(<AddDeveloperForm />);
    await waitFor(() => expect(mockedGetSkillsCatalog).toHaveBeenCalled());

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email address/i), 'jane.doe@test.com');
    
    fireEvent.click(screen.getByRole('button', { name: /save developer/i }));

    expect(await screen.findByText('A developer with this email already exists.')).toBeInTheDocument();
    expect(mockedAddDeveloper).not.toHaveBeenCalled();
  });

  it('successfully submits the form with valid data', async () => {
    const user = userEvent.setup();
    render(<AddDeveloperForm />);
    await waitFor(() => expect(mockedGetSkillsCatalog).toHaveBeenCalled());

    // Fill out the form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john.doe@test.com');
    await user.type(screen.getByLabelText(/role/i), 'Frontend Developer');

    // Add a skill
    await user.selectOptions(screen.getByLabelText('Skill'), 'React');
    await user.selectOptions(screen.getByLabelText('Proficiency (1-5)'), '4');
    await user.click(screen.getByRole('button', { name: /add skill/i }));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save developer/i }));

    await waitFor(() => {
      expect(mockedAddDeveloper).toHaveBeenCalledTimes(1);
      expect(mockedAddDeveloper).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john.doe@test.com',
        role: 'Frontend Developer',
        employeeId: '',
        location: '',
        project: '',
        active: true,
        skills: [{ name: 'React', proficiency: 4 }],
      });
    });

    // Check for success message and form reset
    expect(await screen.findByText('Developer "John Doe" created successfully.')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue('');
  });

  it('logs an error if submission fails', async () => {
    const user = userEvent.setup();
    const submissionError = new Error('Firestore write failed');
    mockedAddDeveloper.mockRejectedValue(submissionError);

    render(<AddDeveloperForm />);
    await waitFor(() => expect(mockedGetSkillsCatalog).toHaveBeenCalled());

    await user.type(screen.getByLabelText(/full name/i), 'Error User');
    await user.type(screen.getByLabelText(/email address/i), 'error@test.com');
    
    fireEvent.click(screen.getByRole('button', { name: /save developer/i }));

    expect(await screen.findByText('Failed to create developer. Please try again.')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith(submissionError);
  });
});
