import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaExternalLinkAlt, FaRocket, FaPalette, FaCode, FaHeart } from "react-icons/fa";
import { getThemeColors } from "../../utils/themes";

interface CreativeTemplateProps {
  displayData: any;
  isEditing: boolean;
  editData: any;
  handleInputChange: (field: string, value: string) => void;
  handleArrayChange: (field: string, index: number, value: any) => void;
  addArrayItem: (field: string) => void;
  removeArrayItem: (field: string, index: number) => void;
  currentTheme: string;
  theme: string;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({
  displayData,
  isEditing,
  editData,
  handleInputChange,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
  currentTheme,
  theme: colorMode
}) => {
  const themeColors = getThemeColors(currentTheme, colorMode);
  
  // Get color classes based on theme
  const getAccentClasses = () => {
    switch (currentTheme) {
      case 'sunset':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-300 dark:border-orange-600',
          hover: 'hover:bg-orange-50 dark:hover:bg-orange-800',
          gradient: 'from-orange-400 to-pink-500'
        };
      case 'ocean':
        return {
          bg: 'bg-cyan-100 dark:bg-cyan-900',
          text: 'text-cyan-600 dark:text-cyan-400',
          border: 'border-cyan-300 dark:border-cyan-600',
          hover: 'hover:bg-cyan-50 dark:hover:bg-cyan-800',
          gradient: 'from-cyan-400 to-blue-500'
        };
      case 'forest':
        return {
          bg: 'bg-green-100 dark:bg-green-900',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-300 dark:border-green-600',
          hover: 'hover:bg-green-50 dark:hover:bg-green-800',
          gradient: 'from-green-400 to-emerald-500'
        };
      case 'lavender':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900',
          text: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-300 dark:border-purple-600',
          hover: 'hover:bg-purple-50 dark:hover:bg-purple-800',
          gradient: 'from-purple-400 to-violet-500'
        };
      default: // modern
        return {
          bg: 'bg-blue-100 dark:bg-blue-900',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-300 dark:border-blue-600',
          hover: 'hover:bg-blue-50 dark:hover:bg-blue-800',
          gradient: 'from-blue-400 to-purple-500'
        };
    }
  };
  
  const accentClasses = getAccentClasses();

  return (
    <div className="creative-template">
      {/* Hero Section with Creative Design */}
      <section className="mb-16 relative overflow-hidden">
        <div className={`${themeColors.background[colorMode]} relative`}>
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 animate-pulse"></div>
            <div className="absolute top-32 right-20 w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 animate-bounce"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-gradient-to-r from-orange-400 to-red-500 animate-bounce"></div>
          </div>
          
          <div className="relative z-10 p-12 text-center">
            <div className="inline-block p-8 rounded-full bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl mb-8">
              <FaPalette className={`text-6xl ${accentClasses.text} mb-4`} />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              {displayData.name || 'Your Name'}
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-8 text-gray-600 dark:text-gray-400">
              {displayData.title || 'Creative Professional'}
            </p>
            
            {/* Contact Cards with Creative Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className={`${themeColors.card[colorMode]} p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform`}>
                <FaPhone className={`${accentClasses.text} text-2xl mb-2 mx-auto`} />
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full text-center text-sm ${themeColors.text.primary[colorMode]} bg-transparent border-b ${accentClasses.border} focus:outline-none`}
                    placeholder="Phone"
                  />
                ) : (
                  <p className={`text-sm ${themeColors.text.primary[colorMode]} truncate`}>
                    {displayData.phone || 'Not provided'}
                  </p>
                )}
              </div>

              <div className={`${themeColors.card[colorMode]} p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform`}>
                <FaEnvelope className={`${accentClasses.text} text-2xl mb-2 mx-auto`} />
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full text-center text-sm ${accentClasses.text} bg-transparent border-b ${accentClasses.border} focus:outline-none`}
                    placeholder="Email"
                  />
                ) : (
                  <a href={`mailto:${displayData.email}`} className={`text-sm ${accentClasses.text} hover:underline truncate block`}>
                    {displayData.email || 'Not provided'}
                  </a>
                )}
              </div>

              <div className={`${themeColors.card[colorMode]} p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform`}>
                <FaGithub className={`${accentClasses.text} text-2xl mb-2 mx-auto`} />
                {isEditing ? (
                  <input
                    type="url"
                    value={editData.github || ''}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className={`w-full text-center text-sm ${accentClasses.text} bg-transparent border-b ${accentClasses.border} focus:outline-none`}
                    placeholder="GitHub"
                  />
                ) : (
                  <a href={displayData.github} target="_blank" rel="noopener noreferrer" className={`text-sm ${accentClasses.text} hover:underline truncate block`}>
                    {displayData.github?.replace('https://github.com/', '') || 'Not provided'}
                  </a>
                )}
              </div>

              <div className={`${themeColors.card[colorMode]} p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 transform`}>
                <FaLinkedin className={`${accentClasses.text} text-2xl mb-2 mx-auto`} />
                {isEditing ? (
                  <input
                    type="url"
                    value={editData.linkedin || ''}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className={`w-full text-center text-sm ${accentClasses.text} bg-transparent border-b ${accentClasses.border} focus:outline-none`}
                    placeholder="LinkedIn"
                  />
                ) : (
                  <a href={displayData.linkedin} target="_blank" rel="noopener noreferrer" className={`text-sm ${accentClasses.text} hover:underline truncate block`}>
                    {displayData.linkedin?.replace('https://www.linkedin.com/in/', '') || 'Not provided'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Creative Layout */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <FaHeart className={`${accentClasses.text} text-2xl`} />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              About Me
            </h2>
            <FaRocket className={`${accentClasses.text} text-2xl`} />
          </div>
        </div>
        
        <div className={`${themeColors.card[colorMode]} p-10 rounded-3xl shadow-2xl relative overflow-hidden`}>
          {/* Decorative border */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 dark:from-pink-800 dark:via-purple-800 dark:to-blue-800 rounded-3xl opacity-20"></div>
          
          <div className="relative z-10">
            {isEditing ? (
              <textarea
                value={editData.summary || ''}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                className={`w-full p-6 border-2 ${accentClasses.border} rounded-2xl ${themeColors.text.primary[colorMode]} bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-lg leading-relaxed`}
                placeholder="Tell your creative story..."
                rows="5"
              />
            ) : (
              <p className={`${themeColors.text.primary[colorMode]} text-xl leading-relaxed text-center font-light`}>
                "{displayData.summary}"
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section with Creative Grid */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <FaCode className={`${accentClasses.text} text-2xl`} />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
            <FaPalette className={`${accentClasses.text} text-2xl`} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technical Skills */}
          <div className={`${themeColors.card[colorMode]} p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Technical Skills
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                {editData.skills?.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${accentClasses.gradient}`}></div>
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                      className={`flex-1 p-3 border-2 ${accentClasses.border} rounded-xl ${themeColors.text.primary[colorMode]} bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Skill"
                    />
                    <button
                      onClick={() => removeArrayItem('skills', index)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('skills')}
                  className={`w-full ${accentClasses.text} text-sm font-medium py-3 border-2 border-dashed ${accentClasses.border} rounded-xl hover:bg-opacity-10 transition-colors`}
                >
                  + Add Skill
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {displayData.skills?.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className={`px-4 py-2 ${accentClasses.bg} ${accentClasses.text} rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Areas of Expertise */}
          <div className={`${themeColors.card[colorMode]} p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Areas of Expertise
            </h3>
            {isEditing ? (
              <div className="space-y-3">
                {editData.expertise?.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${accentClasses.gradient}`}></div>
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayChange('expertise', index, e.target.value)}
                      className={`flex-1 p-3 border-2 ${accentClasses.border} rounded-xl ${themeColors.text.primary[colorMode]} bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Expertise"
                    />
                    <button
                      onClick={() => removeArrayItem('expertise', index)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('expertise')}
                  className={`w-full ${accentClasses.text} text-sm font-medium py-3 border-2 border-dashed ${accentClasses.border} rounded-xl hover:bg-opacity-10 transition-colors`}
                >
                  + Add Expertise
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayData.expertise?.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${accentClasses.gradient} mr-4`}></div>
                    <span className={`${themeColors.text.primary[colorMode]} text-lg`}>{skill}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Education Timeline with Creative Design */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Education Journey
          </h2>
        </div>
        
        <div className="space-y-8">
          {displayData.education?.map((edu: any, index: number) => (
            <div key={index} className={`${themeColors.card[colorMode]} p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
              {/* Decorative gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 rounded-3xl opacity-10"></div>
              
              <div className="relative z-10">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => handleArrayChange('education', index, {...edu, degree: e.target.value})}
                      className={`w-full text-2xl font-bold ${themeColors.text.primary[colorMode]} bg-transparent border-b-2 ${accentClasses.border} focus:outline-none focus:ring-2 focus:ring-purple-500 p-2 rounded`}
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => handleArrayChange('education', index, {...edu, institution: e.target.value})}
                      className={`w-full text-xl ${themeColors.text.primary[colorMode]} bg-transparent border-b-2 ${accentClasses.border} focus:outline-none focus:ring-2 focus:ring-purple-500 p-2 rounded`}
                      placeholder="Institution"
                    />
                    <div className="flex gap-6">
                      <input
                        type="text"
                        value={edu.duration || ''}
                        onChange={(e) => handleArrayChange('education', index, {...edu, duration: e.target.value})}
                        className={`flex-1 text-lg ${themeColors.text.secondary[colorMode]} bg-transparent border-b-2 ${accentClasses.border} focus:outline-none focus:ring-2 focus:ring-purple-500 p-2 rounded`}
                        placeholder="Duration"
                      />
                      <input
                        type="text"
                        value={edu.grade || ''}
                        onChange={(e) => handleArrayChange('education', index, {...edu, grade: e.target.value})}
                        className={`flex-1 text-lg ${themeColors.text.secondary[colorMode]} bg-transparent border-b-2 ${accentClasses.border} focus:outline-none focus:ring-2 focus:ring-purple-500 p-2 rounded`}
                        placeholder="Grade"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {edu.degree}
                    </h3>
                    <p className="text-xl mb-3 font-medium">{edu.institution}</p>
                    <p className={`text-lg ${themeColors.text.secondary[colorMode]} italic`}>
                      {edu.duration} | {edu.grade}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Gallery with Creative Cards */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Creative Projects
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayData.projects?.map((project: any, index: number) => (
            <div key={index} className={`${themeColors.card[colorMode]} rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 transform group`}>
              {/* Project Header with Gradient */}
              <div className={`h-2 bg-gradient-to-r ${accentClasses.gradient}`}></div>
              
              <div className="p-8">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={project.title || ''}
                      onChange={(e) => handleArrayChange('projects', index, {...project, title: e.target.value})}
                      className={`w-full text-xl font-bold ${themeColors.text.primary[colorMode]} bg-transparent border-b-2 ${accentClasses.border} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Project Title"
                    />
                    <textarea
                      value={project.description || ''}
                      onChange={(e) => handleArrayChange('projects', index, {...project, description: e.target.value})}
                      className={`w-full ${themeColors.text.secondary[colorMode]} bg-transparent border-2 ${accentClasses.border} rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
                      placeholder="Project description"
                      rows="4"
                    />
                    <input
                      type="url"
                      value={project.link || ''}
                      onChange={(e) => handleArrayChange('projects', index, {...project, link: e.target.value})}
                      className={`w-full text-sm ${accentClasses.text} bg-transparent border-b-2 ${accentClasses.border} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Project URL"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className={`${themeColors.text.secondary[colorMode]} text-lg mb-6 leading-relaxed`}>
                      {project.description}
                    </p>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center ${accentClasses.text} hover:underline text-lg font-medium group-hover:scale-105 transition-transform`}
                      >
                        View Project <FaExternalLinkAlt className="ml-2" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CreativeTemplate;
