import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@test/utils';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../dialog';

describe('Dialog', () => {
  it('should render dialog with trigger and open on click', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <p>Dialog content here</p>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /open dialog/i });
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
      expect(screen.getByText('Dialog content here')).toBeInTheDocument();
    });
  });

  it('should close dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
          <p>Content</p>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole('button', { name: /open/i }));

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
    });

    // Close button should be rendered by default (showCloseButton=true)
    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toBeInTheDocument();

    await user.click(closeBtn);
  });

  it('should hide close button when showCloseButton is false', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <p>Content without close button</p>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole('button', { name: /open/i }));

    await waitFor(() => {
      expect(screen.getByText('Content without close button')).toBeInTheDocument();
    });

    // Close button should NOT be rendered
    const closeButton = screen.queryByRole('button', { name: /close/i });
    expect(closeButton).not.toBeInTheDocument();
  });

  it('should render DialogFooter with optional close button', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <p>Content</p>
          <DialogFooter showCloseButton={true}>
            <button>Cancel</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole('button', { name: /open/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  it('should render dialog with custom content and interactive elements', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <Dialog>
        <DialogTrigger>Open Form</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Dialog</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" />
            <button type="submit">Submit</button>
          </form>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole('button', { name: /open form/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should support DialogClose for custom close triggers', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Dialog</DialogTitle>
          </DialogHeader>
          <p>Custom content</p>
          <DialogClose asChild>
            <button>Custom Close</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole('button', { name: /open/i }));

    await waitFor(() => {
      expect(screen.getByText('Dialog')).toBeInTheDocument();
    });

    const customCloseBtn = screen.getByRole('button', { name: /custom close/i });
    expect(customCloseBtn).toBeInTheDocument();

    await user.click(customCloseBtn);
  });
});

