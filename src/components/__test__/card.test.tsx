import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@test/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '../card';

describe('Card', () => {
  it('should render card with children content', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('should render all subcomponents together correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Main Content</CardContent>
        <CardFooter>Footer Text</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Text')).toBeInTheDocument();
  });

  it('should render CardHeader with title and description', () => {
    render(
      <CardHeader>
        <CardTitle>Header Title</CardTitle>
        <CardDescription>Header Desc</CardDescription>
      </CardHeader>
    );

    expect(screen.getByText('Header Title')).toBeInTheDocument();
    expect(screen.getByText('Header Desc')).toBeInTheDocument();
  });

  it('should render CardContent independently', () => {
    render(<CardContent>Content Area</CardContent>);
    expect(screen.getByText('Content Area')).toBeInTheDocument();
  });

  it('should render CardFooter with content', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('should support custom content in CardAction', () => {
    render(
      <CardAction>
        <button>Action Button</button>
      </CardAction>
    );
    expect(screen.getByRole('button', { name: /action button/i })).toBeInTheDocument();
  });

  it('should accept any React element as child', () => {
    render(
      <Card>
        <CardContent>
          <div data-testid="custom-element">Custom Element</div>
        </CardContent>
      </Card>
    );

    expect(screen.getByTestId('custom-element')).toBeInTheDocument();
  });

  it('forwards aria-label and onClick to Card root', () => {
    const handle = vi.fn();
    render(
      <Card aria-label="the-card" onClick={handle}>
        Clickable
      </Card>
    );

    const el = screen.getByLabelText('the-card');
    expect(el).toBeInTheDocument();
    fireEvent.click(el);
    expect(handle).toHaveBeenCalled();
  });

  it('forwards data-testid to CardContent', () => {
    render(<CardContent data-testid="card-content-1">Body</CardContent>);
    expect(screen.getByTestId('card-content-1')).toBeInTheDocument();
  });


});
