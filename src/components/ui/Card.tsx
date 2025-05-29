import Image from 'next/image'
import Link from 'next/link'

interface CardProps {
  title: string
  description: string
  image?: string
  link?: string
  footer?: React.ReactNode
  className?: string
}

export function Card({ title, description, image, link, footer, className = '' }: CardProps) {
  const content = (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  )

  if (link) {
    return (
      <Link href={link} className="block hover:shadow-lg transition-shadow duration-300">
        {content}
      </Link>
    )
  }

  return content
} 