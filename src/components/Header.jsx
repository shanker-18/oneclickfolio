import React from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { getThemeColors } from "../utils/themes";

const Header = ({ 
  displayData, 
  isEditing, 
  editData, 
  handleInputChange, 
  handleEdit, 
  handleSave, 
  handleCancel, 
  toggleTheme, 
  theme: colorMode,
  portfolioData,
  currentTheme
}) => {
  const themeColors = getThemeColors(currentTheme, colorMode);
  
  // Clean professional header styling based on theme mode
  const headerClasses = colorMode === 'light' 
    ? 'relative bg-white text-gray-900 border-b border-gray-200' 
    : 'relative bg-gray-900 text-white border-b border-gray-700';
  
  const buttonClasses = colorMode === 'light'
    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600';

  return (
    <header className={`${headerClasses} p-8 md:p-12 text-center overflow-hidden`}>
      
      {/* Theme Toggle - Top Right */}
      <button
        onClick={toggleTheme}
        className={`absolute top-5 right-5 ${buttonClasses} rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-xl transition-all duration-300 z-10`}
      >
        {colorMode === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Edit Toggle - Top Right */}
      {portfolioData && (
        <button
          onClick={isEditing ? handleSave : handleEdit}
          className={`absolute top-5 right-16 ${buttonClasses} rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-lg transition-all duration-300 z-10`}
        >
          {isEditing ? <FaSave /> : <FaEdit />}
        </button>
      )}

      {isEditing && (
        <button
          onClick={handleCancel}
          className={`absolute top-5 right-28 ${buttonClasses} rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-lg transition-all duration-300 z-10`}
        >
          <FaTimes />
        </button>
      )}

      {isEditing ? (
        <>
          <input
            type="text"
            value={editData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`text-4xl md:text-5xl font-bold mb-2 relative z-10 bg-transparent border-b-2 text-center focus:outline-none ${
              colorMode === 'light' 
                ? "border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500" 
                : "border-gray-600 text-white placeholder-gray-400 focus:border-gray-400"
            }`}
            placeholder="Full Name"
          />
          <input
            type="text"
            value={editData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`text-xl md:text-2xl font-normal mb-6 relative z-10 bg-transparent border-b-2 text-center focus:outline-none mt-4 ${
              colorMode === 'light' 
                ? "border-gray-300 text-gray-700 placeholder-gray-500 focus:border-gray-500" 
                : "border-gray-600 text-gray-300 placeholder-gray-400 focus:border-gray-400"
            }`}
            placeholder="Professional Title"
          />
        </>
      ) : (
        <>
          <h1 className={`text-4xl md:text-5xl font-bold mb-2 relative z-10 ${
            colorMode === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {displayData.name}
          </h1>
          <p className={`text-xl md:text-2xl font-normal mb-6 relative z-10 ${
            colorMode === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {displayData.title}
          </p>
        </>
      )}
    </header>
  );
};

export default Header; 