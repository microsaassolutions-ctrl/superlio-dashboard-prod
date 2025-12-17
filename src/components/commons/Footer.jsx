import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-blue-50 py-5">
            <div className="container mx-auto px-4 text-center text-gray-600">
            <p>© {new Date().getFullYear()}. All rights reserved.</p>
            </div>
    </footer>
  )
}

export default Footer