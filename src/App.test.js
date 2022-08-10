import { render, screen } from '@testing-library/react';
import App from './App';

test('headers ', () => {
  render(<App />);
  const linkElement = screen.getByText(/this/i);
  expect(linkElement).toBeInTheDocument();
});
