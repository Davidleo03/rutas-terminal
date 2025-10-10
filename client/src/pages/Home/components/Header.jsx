import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-orange-600 px-4 py-5 sm:px-6">
      <h2 className="text-xl font-bold text-white text-center">{title}</h2>
      {subtitle && <p className="text-orange-100 text-center mt-1">{subtitle}</p>}
    </div>
  );
};

export default Header;
