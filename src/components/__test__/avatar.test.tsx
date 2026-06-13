import { describe, it, expect } from 'vitest';
import { render, screen } from '@test/utils';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from '../avatar';

describe('Avatar', () => {
  it('should render avatar with fallback when image is not provided', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should support different sizes', () => {
    const { rerender } = render(
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('SM')).toBeInTheDocument();

    rerender(
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('LG')).toBeInTheDocument();

    rerender(
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('XL')).toBeInTheDocument();
  });

  it('should support square and circle formats', () => {
    const { rerender } = render(
      <Avatar format="square">
        <AvatarFallback>SQ</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('SQ')).toBeInTheDocument();

    rerender(
      <Avatar format="circle">
        <AvatarFallback>CIR</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('CIR')).toBeInTheDocument();
  });

  it('should render avatar with badge', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge>3</AvatarBadge>
      </Avatar>
    );

    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
    expect(badge).toBeVisible();
  });

  it('should render avatar group with multiple avatars', () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A1</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>A2</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>A3</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );

    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
    expect(screen.getByText('A3')).toBeInTheDocument();
  });

  it('should render avatar group with count', () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A1</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>A2</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    );

    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  it('should render avatar fallback with accessible text', () => {
    render(
      <Avatar>
        <AvatarFallback>User Name</AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByText('User Name');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toBeVisible();
  });

  it('should render avatar with fallback for accessibility', () => {
    render(
      <Avatar>
        <AvatarFallback aria-label="User avatar">JD</AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByText('JD');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveAttribute('aria-label', 'User avatar');
  });

  it('should support different sizes in avatar group', () => {
    render(
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>L</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    );

    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('should apply custom className to avatar components', () => {
    render(
      <Avatar className="custom-avatar">
        <AvatarFallback className="custom-fallback">AB</AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByText('AB');
    expect(fallback).toHaveClass('custom-fallback');
  });
});
