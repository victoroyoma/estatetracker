import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card, { CardHeader, CardContent, CardFooter } from '../Card';

describe('Card Component', () => {
  test('renders children correctly', () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Test</div>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('handles click events when onClick is provided', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick}>
        <div>Clickable Card</div>
      </Card>
    );
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('supports keyboard navigation when clickable', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick}>
        <div>Keyboard Card</div>
      </Card>
    );
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies variant styles correctly', () => {
    const { container } = render(
      <Card variant="outlined">
        <div>Outlined Card</div>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('border');
  });

  test('applies padding styles correctly', () => {
    const { container } = render(
      <Card padding="lg">
        <div>Padded Card</div>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('p-8');
  });
});

describe('CardHeader Component', () => {
  test('renders children and actions', () => {
    render(
      <CardHeader actions={<button>Action</button>}>
        <h2>Header Title</h2>
      </CardHeader>
    );
    
    expect(screen.getByText('Header Title')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

describe('CardContent Component', () => {
  test('renders with different padding options', () => {
    const { container } = render(
      <CardContent padding="sm">
        <p>Content</p>
      </CardContent>
    );
    
    expect(container.firstChild).toHaveClass('px-4', 'py-2');
  });
});

describe('CardFooter Component', () => {
  test('renders with muted variant', () => {
    const { container } = render(
      <CardFooter variant="muted">
        <button>Footer Button</button>
      </CardFooter>
    );
    
    expect(container.firstChild).toHaveClass('bg-gray-50');
  });
});
