import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders new note button', () => {
  render(<App />);
  expect(screen.getByLabelText(/new note/i)).toBeInTheDocument();
});

test('shows current and archive panels', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /current/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /archive/i })).toBeInTheDocument();
});

test('opens bulk action menu from options button', () => {
  render(<App />);
  fireEvent.click(screen.getByLabelText(/more options/i));
  expect(screen.getByRole('menu')).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /archive/i })).toBeInTheDocument();
});
