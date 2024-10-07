import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 py-4 mt-8">
      <div className="container mx-auto px-4 text-center text-zinc-400">
        <p>&copy; 2025 Imperfect Gamers. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-red-500 transition">Terms of Service</a>
          <a href="#" className="hover:text-red-500 transition">Privacy Policy</a>
          <a href="#" className="hover:text-red-500 transition">Contact Us</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
