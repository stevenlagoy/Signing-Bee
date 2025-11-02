/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders header with site name', () => {
  render(<App />);
  const headerElement = screen.getByText(/^Signing Bee$/i); // Test was failing due to finding two mataches instead of one so I tightened the regex
  expect(headerElement).toBeInTheDocument();
});
