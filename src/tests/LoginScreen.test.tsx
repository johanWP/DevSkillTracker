// FIX: Import test functions and types directly from @jest/globals to avoid environment configuration issues.
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginScreen from '../components/LoginScreen';
import * as firebaseService from '../services/firebaseService';
// FIX: The `FirebaseError` type is not reliably exported. Mocking error object instead.

// Mock the firebaseService module
jest.mock('../services/firebaseService');

const mockedSignIn = firebaseService.signIn as jest.Mock;

describe('LoginScreen Component', () => {
  beforeEach(() => {
    // Use real timers for async tests
    jest.useRealTimers();
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock signIn to resolve after a short delay to simulate async behavior
    mockedSignIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(undefined), 10)));
    // Suppress console.error for tests expecting errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders the login form correctly', () => {
    render(<LoginScreen authError={null} />);
    
    expect(screen.getByRole('heading', { name: /devskilltracker/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('displays an initial authorization error if one is passed', () => {
    const authError = "You are not authorized.";
    render(<LoginScreen authError={authError} />);
    
    expect(screen.getByText(authError)).toBeInTheDocument();
  });

  it('allows the user to enter email and password', async () => {
    const user = userEvent.setup();
    render(<LoginScreen authError={null} />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'admin@test.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('admin@test.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows a loading spinner and disables the button on submission', async () => {
    const user = userEvent.setup();
    mockedSignIn.mockResolvedValue(undefined); // Mock a successful sign-in
    render(<LoginScreen authError={null} />);
    
    await user.type(screen.getByLabelText(/email address/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    const loginButton = screen.getByRole('button');
    fireEvent.submit(screen.getByTestId('login-form'));
    
    // Check for loading state
    await waitFor(() => expect(loginButton).toBeDisabled());

    // Wait for the mock promise to resolve
    await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
    });
  });

  it('calls the signIn function on form submission', async () => {
    const user = userEvent.setup();
    mockedSignIn.mockResolvedValue(undefined);
    render(<LoginScreen authError={null} />);
    
    await user.type(screen.getByLabelText(/email address/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledTimes(1);
      expect(mockedSignIn).toHaveBeenCalledWith('admin@test.com', 'password123');
    });
  });

  it('displays an error message on failed login', async () => {
    const user = userEvent.setup();
    // Simulate a Firebase error for invalid credentials
    const error = { code: 'auth/invalid-credential', message: 'Invalid credentials' };
    mockedSignIn.mockRejectedValue(error);
    
    render(<LoginScreen authError={null} />);
    
    await user.type(screen.getByLabelText(/email address/i), 'wrong@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Wait for the error message to appear
    const errorMessage = await screen.findByText('Invalid email or password.');
    expect(errorMessage).toBeInTheDocument();

    // Ensure console.error was called for logging
    expect(console.error).toHaveBeenCalledWith(
        "Firebase Auth Error:",
        "auth/invalid-credential",
        "Invalid credentials"
    );
  });
});
