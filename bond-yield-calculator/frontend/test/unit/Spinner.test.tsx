import React from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../../src/components/Spinner';

describe('Spinner', () => {
  it('renders with loading role and aria-label', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toBeInTheDocument();
  });

  it('renders a single element', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
