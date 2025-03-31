import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 text-center text-gray-500 text-sm">
      <p>Built by Uriel Niazov © {currentYear}. All rights reserved.</p>
    </footer>
  );
};

export default Footer;