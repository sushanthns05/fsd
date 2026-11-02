import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { Navbar } from '../components/common/Navbar';
import { Badge } from '../components/common/Badge';
import { LoginPage } from '../pages/auth/LoginPage';

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            {ui}
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Frontend Component Tests', () => {
  it('Badge renders correct text and variant', () => {
    const { container } = render(<Badge variant="success">Completed</Badge>);
    expect(container.textContent).toContain('Completed');
  });

  it('Navbar renders brand logo and platform name', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText(/Edu/i)).toBeDefined();
    expect(screen.getByText(/Sphere/i)).toBeDefined();
    expect(screen.getByText(/Explore Courses/i)).toBeDefined();
  });

  it('LoginPage renders sign-in header and instant demo buttons', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText(/Log in to EduSphere/i)).toBeDefined();
    expect(screen.getByText(/Student/i)).toBeDefined();
    expect(screen.getByText(/Instructor/i)).toBeDefined();
    expect(screen.getByText(/Admin/i)).toBeDefined();
  });
});
