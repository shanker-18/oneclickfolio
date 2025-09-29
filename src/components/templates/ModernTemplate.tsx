import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaExternalLinkAlt, FaStar, FaRocket, FaCode, FaBriefcase, FaGraduationCap, FaAward, FaGlobe, FaHeart, FaCamera, FaEdit } from "react-icons/fa";

const ModernTemplate = ({ displayData, themeColors, theme = 'light', isEditing = false, onPhotoUpload }) => {
  if (!displayData) return null;

  // Ensure onPhotoUpload is always available
  const handlePhotoUpload = onPhotoUpload || (() => {
    console.log('Photo upload function not available');
  });

  return (
    <div className="modern-template w-full px-4 md:px-8 lg:px-12">
      {/* Hero Section */}
      <section className="relative mb-16 overflow-hidden">
        <div className={`bg-gradient-to-br ${themeColors.gradients.header} text-white rounded-3xl p-12 relative w-full`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white rounded-xl rotate-45"></div>
            <div className="absolute bottom-10 left-20 w-12 h-12 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-14 h-14 border-2 border-white rounded-xl rotate-12"></div>
          </div>
          
          <div className="relative z-10 text-center">
            {/* Profile Image Section with Upload Button */}
            <div className="mb-8 relative inline-block">
              {displayData.photoUrl ? (
                <div className="relative">
                  <img
                    src={displayData.photoUrl}
                    alt={displayData.name}
                    className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full object-cover mx-auto border-4 border-white/30 shadow-2xl max-w-full max-h-full"
                  />
                  {/* Upload Button Overlay */}
                  {isEditing && (
                    <button
                      onClick={handlePhotoUpload}
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-2 border-white"
                      title="Change photo"
                    >
                      <FaCamera className="text-white text-sm" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative group">
                  <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-white/20 border-4 border-white/30 shadow-2xl flex items-center justify-center mx-auto">
                    <FaCamera className="text-white/60 text-6xl" />
                  </div>
                  
                  {/* Always Visible Upload Button */}
                  <button
                    onClick={handlePhotoUpload}
                    className="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl border-4 border-white hover:scale-110"
                    title="Upload photo"
                  >
                    <FaEdit className="text-white text-xl" />
                  </button>
                  
                  {/* Center Upload Button - More prominent */}
                  <button
                    onClick={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                    title="Click to upload photo"
                  >
                    <div className="text-center">
                      <FaEdit className="text-white text-2xl mb-2 mx-auto" />
                      <span className="text-white text-sm font-medium">Upload Photo</span>
                    </div>
                  </button>
                </div>
              )}
              
              {/* Upload Text Label - Only show when no image */}
              {!displayData.photoUrl && (
                <div className="text-center mt-4">
                  <p className="text-white/80 text-sm font-medium">Click to upload your profile photo</p>
                </div>
              )}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              {displayData.name}
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 text-white/90">
              {displayData.title}
            </p>
            
            {displayData.location && (
              <div className="flex items-center justify-center text-white/80 mb-8">
                <FaMapMarkerAlt className="mr-2" />
                <span className="text-lg">{displayData.location}</span>
              </div>
            )}
            
            {/* Contact Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {displayData.email && (
                <a
                  href={`mailto:${displayData.email}`}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <FaEnvelope />
                  <span className="hidden md:inline">Email</span>
                </a>
              )}
              {displayData.phone && (
                <a
                  href={`tel:${displayData.phone}`}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <FaPhone />
                  <span className="hidden md:inline">Call</span>
                </a>
              )}
              {displayData.linkedin && (
                <a
                  href={displayData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <FaLinkedin />
                  <span className="hidden md:inline">LinkedIn</span>
                </a>
              )}
              {displayData.github && (
                <a
                  href={displayData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <FaGithub />
                  <span className="hidden md:inline">GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {displayData.summary && (
        <section className="mb-16">
          <div className={`${themeColors.card[theme]} rounded-2xl p-8 shadow-xl border ${themeColors.border[theme]} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-full bg-gradient-to-r ${themeColors.gradients.skills} text-white mr-4`}>
                  <FaHeart className="text-xl" />
                </div>
                <h2 className={`text-3xl font-bold ${themeColors.text.primary[theme]}`}>About Me</h2>
              </div>
              <p className={`${themeColors.text.secondary[theme]} leading-relaxed text-lg font-light`}>
                {displayData.summary}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {displayData.skills && displayData.skills.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${themeColors.gradients.skills} text-white mr-4`}>
                <FaCode className="text-2xl" />
              </div>
              <h2 className={`text-3xl font-bold ${themeColors.text.primary[theme]}`}>Skills & Expertise</h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayData.skills.map((skill, index) => (
              <div
                key={index}
                className={`${themeColors.card[theme]} p-6 rounded-2xl shadow-lg hover:shadow-xl border ${themeColors.border[theme]} transition-all duration-300 hover:-translate-y-2 text-center group cursor-pointer`}
              >
                <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${themeColors.gradients.skills} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <FaStar className="text-white" />
                </div>
                <h3 className={`font-semibold ${themeColors.text.primary[theme]} text-sm`}>{skill}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {displayData.workExperience && displayData.workExperience.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${themeColors.gradients.skills} text-white mr-4`}>
                <FaBriefcase className="text-2xl" />
              </div>
              <h2 className={`text-3xl font-bold ${themeColors.text.primary[theme]}`}>Experience Journey</h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-8">
            {displayData.workExperience.map((exp, index) => (
              <div
                key={index}
                className={`${themeColors.card[theme]} rounded-2xl p-8 shadow-xl border ${themeColors.border[theme]} relative overflow-hidden hover:shadow-2xl transition-all duration-300`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${themeColors.gradients.skills} rounded-l-2xl`}></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-12 translate-x-12 opacity-50"></div>
                
                <div className="relative z-10 pl-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                    <div>
                      <h3 className={`text-2xl font-bold ${themeColors.text.primary[theme]} mb-2`}>{exp.title}</h3>
                      <p className={`text-xl ${themeColors.text.secondary[theme]} font-medium mb-1`}>{exp.company}</p>
                      {exp.location && (
                        <div className="flex items-center text-gray-500">
                          <FaMapMarkerAlt className="mr-1" />
                          <span className="text-sm">{exp.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 lg:mt-0">
                      <span className={`inline-block px-4 py-2 bg-gradient-to-r ${themeColors.gradients.skills} text-white rounded-full text-sm font-medium`}>
                        {exp.start} - {exp.end}
                      </span>
                      {exp.contract && (
                        <p className="text-xs text-gray-500 mt-2 text-center">{exp.contract}</p>
                      )}
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className={`${themeColors.text.secondary[theme]} leading-relaxed text-lg font-light`}>
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {displayData.education && displayData.education.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${themeColors.gradients.languages} text-white mr-4`}>
                <FaGraduationCap className="text-2xl" />
              </div>
              <h2 className={`text-3xl font-bold ${themeColors.text.primary[theme]}`}>Education</h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayData.education.map((edu, index) => (
              <div
                key={index}
                className={`${themeColors.card[theme]} rounded-2xl p-8 shadow-xl border ${themeColors.border[theme]} relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${themeColors.gradients.languages} rounded-t-2xl`}></div>
                <div className="pt-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${themeColors.gradients.languages} text-white`}>
                      <FaGraduationCap className="text-xl" />
                    </div>
                    <span className={`px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium`}>
                      {edu.start} - {edu.end}
                    </span>
                  </div>
                  
                  <h3 className={`text-xl font-bold ${themeColors.text.primary[theme]} mb-2`}>{edu.degree}</h3>
                  <p className={`text-lg ${themeColors.text.secondary[theme]} font-medium`}>{edu.school}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {displayData.projects && displayData.projects.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${themeColors.gradients.skills} text-white mr-4`}>
                <FaRocket className="text-2xl" />
              </div>
              <h2 className={`text-3xl font-bold ${themeColors.text.primary[theme]}`}>Featured Projects</h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayData.projects.map((project, index) => (
              <div
                key={index}
                className={`${themeColors.card[theme]} rounded-2xl shadow-xl border ${themeColors.border[theme]} overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group`}
              >
                <div className={`h-2 bg-gradient-to-r ${themeColors.gradients.skills} group-hover:h-3 transition-all duration-300`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${themeColors.gradients.skills} text-white group-hover:scale-110 transition-transform duration-300`}>
                      <FaCode className="text-lg" />
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <FaExternalLinkAlt className="text-lg" />
                      </a>
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold ${themeColors.text.primary[theme]} mb-3 group-hover:text-blue-600 transition-colors`}>
                    {project.title || project.name}
                  </h3>
                  
                  {project.description && (
                    <p className={`${themeColors.text.secondary[theme]} leading-relaxed mb-4 font-light`}>
                      {project.description}
                    </p>
                  )}
                  
                  {project.tech && project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{project.tech.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;
