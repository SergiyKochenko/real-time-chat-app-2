// AI-generated test for frontend App
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthContext } from '../context/AuthContext';

test('renders login screen when unauthenticated', () => {
  const authContextValue = { authUser: null, setAuthUser: () => {} };

  render(
    <AuthContext.Provider value={authContextValue}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
});
