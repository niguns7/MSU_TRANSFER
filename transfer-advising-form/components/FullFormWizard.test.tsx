import React from 'react';
import { render, screen } from '@testing-library/react';
import FullFormWizard from './FullFormWizard';

test('renders FullFormWizard component', () => {
    render(<FullFormWizard />);
    const linkElement = screen.getByText(/Full Form Wizard/i);
    expect(linkElement).toBeInTheDocument();
});