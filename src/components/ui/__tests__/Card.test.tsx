import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('renders title and description', () => {
    render(
      <Card
        title="Test Title"
        description="Test Description"
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders with image when provided', () => {
    render(
      <Card
        title="Test Title"
        description="Test Description"
        image="/test-image.jpg"
      />
    )

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Test Title')
  })

  it('renders as a link when link prop is provided', () => {
    render(
      <Card
        title="Test Title"
        description="Test Description"
        link="/test-link"
      />
    )

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test-link')
  })

  it('renders footer content when provided', () => {
    render(
      <Card
        title="Test Title"
        description="Test Description"
        footer={<button>Test Button</button>}
      />
    )

    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <Card
        title="Test Title"
        description="Test Description"
        className="custom-class"
      />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
}) 