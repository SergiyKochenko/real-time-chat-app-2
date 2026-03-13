// AI-generated test for frontend App
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';
import { AuthContext } from '../context/AuthContext';

describe('App routing', () => {
  it('renders login screen when unauthenticated', () => {
    const authContextValue = { authUser: null, setAuthUser: () => {} };

    render(
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
});
