import Image from 'next/image'

export const metadata = {
  title: 'About Us | Vesa Projekt',
  description: 'Learn more about our project and team.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Vesa Projekt started as a vision to create a modern e-commerce platform that combines
            cutting-edge technology with exceptional user experience. Our team of dedicated
            developers and designers worked tirelessly to bring this vision to life.
          </p>
          <p className="text-gray-600 mb-4">
            Built with Next.js, TypeScript, and MongoDB, our platform leverages the latest
            web technologies to provide a fast, secure, and scalable shopping experience.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-800 italic">
              "To provide a seamless and enjoyable shopping experience while maintaining
              the highest standards of quality and customer service."
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Next.js', icon: '/icons/nextjs.svg' },
              { name: 'TypeScript', icon: '/icons/typescript.svg' },
              { name: 'MongoDB', icon: '/icons/mongodb.svg' },
              { name: 'Tailwind CSS', icon: '/icons/tailwind.svg' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="relative w-12 h-12 mb-2">
                  <Image
                    src={tech.icon}
                    alt={tech.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'John Doe',
                role: 'Lead Developer',
                image: '/team/john.jpg',
              },
              {
                name: 'Jane Smith',
                role: 'UI/UX Designer',
                image: '/team/jane.jpg',
              },
              {
                name: 'Mike Johnson',
                role: 'Backend Developer',
                image: '/team/mike.jpg',
              },
            ].map((member) => (
              <div
                key={member.name}
                className="text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            Have questions or want to learn more about our project? Feel free to reach
            out to us through our contact page or social media channels.
          </p>
          <div className="flex justify-center space-x-6">
            {[
              { name: 'Facebook', href: '#', icon: 'facebook.svg' },
              { name: 'Twitter', href: '#', icon: 'twitter.svg' },
              { name: 'Instagram', href: '#', icon: 'instagram.svg' },
              { name: 'LinkedIn', href: '#', icon: 'linkedin.svg' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-gray-400 hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{social.name}</span>
                <div className="relative w-6 h-6">
                  <Image
                    src={`/icons/${social.icon}`}
                    alt={social.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 