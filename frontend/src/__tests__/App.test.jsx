// AI-generated test for frontend App
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders chat app title', () => {
  render(<App />);
  expect(screen.getByText(/chat/i)).toBeInTheDocument();
});
