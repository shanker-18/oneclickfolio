import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaExternalLinkAlt, FaCamera, FaEdit, FaBriefcase, FaGraduationCap, FaCode, FaAward, FaHeart } from "react-icons/fa";

const ProfessionalTemplate = ({ displayData, themeColors, theme = 'light', isEditing = false, onPhotoUpload }) => {
  if (!displayData) return null;

  return (
    <div className="professional-template w-full px-4 md:px-8 lg:px-12">
      {/* Professional Header */}
      <section className="relative mb-16 overflow-hidden">
        <div className={`bg-gradient-to-br ${themeColors.gradients.header} text-white rounded-2xl p-8 md:p-12 relative w-full`}>
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-16 h-16 border border-white rounded-full"></div>
            <div className="absolute top-16 right-16 w-12 h-12 border border-white rounded-lg rotate-45"></div>
            <div className="absolute bottom-8 left-16 w-10 h-10 border border-white rounded-full"></div>
            <div className="absolute bottom-16 right-8 w-14 h-14 border border-white rounded-lg rotate-12"></div>
          </div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Profile Image Section */}
              <div className="lg:col-span-1 flex justify-center lg:justify-start">
                <div className="relative">
                  {displayData.photoUrl ? (
                    <div className="relative">
                      <img
                        src={displayData.photoUrl}
                        alt={displayData.name}
                        className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                      />
                      {/* Upload Button Overlay */}
                      {isEditing && onPhotoUpload && (
                        <button
                          onClick={onPhotoUpload}
                          className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-2 border-white"
                          title="Change photo"
                        >
                          <FaCamera className="text-white text-xs" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-white/20 border-4 border-white/30 shadow-2xl flex items-center justify-center">
                        <FaCamera className="text-white/60 text-4xl" />
                      </div>
                      
                      {/* Center Upload Button - More prominent */}
                      <button
                        onClick={onPhotoUpload}
                        className="absolute inset-0 w-full h-full rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                        title="Click to upload photo"
                      >
                        <div className="text-center">
                          <FaEdit className="text-white text-xl mb-1 mx-auto" />
                          <span className="text-white text-xs font-medium">Upload</span>
                        </div>
                      </button>
                      
                      {/* Corner Upload Button - Always visible */}
                      <button
                        onClick={onPhotoUpload}
                        className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-2 border-white hover:scale-110"
                        title="Upload photo"
                      >
                        <FaEdit className="text-white text-sm" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Title Section */}
              <div className="lg:col-span-2 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                  {displayData.name}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl font-light mb-6 text-white/90">
                  {displayData.title}
                </p>
                
                {displayData.location && (
                  <div className="flex items-center justify-center lg:justify-start text-white/80 mb-6">
                    <FaMapMarkerAlt className="mr-2" />
                    <span className="text-base md:text-lg">{displayData.location}</span>
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {displayData.email && (
                    <a
                      href={`mailto:${displayData.email}`}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <FaEnvelope />
                      Email
                    </a>
                  )}
                  {displayData.phone && (
                    <a
                      href={`tel:${displayData.phone}`}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <FaPhone />
                      Call
                    </a>
                  )}
                  {displayData.linkedin && (
                    <a
                      href={displayData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <FaLinkedin />
                      LinkedIn
                    </a>
                  )}
                  {displayData.github && (
                    <a
                      href={displayData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <FaGithub />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {displayData.summary && (
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <FaHeart className="text-indigo-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              {displayData.summary}
            </p>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {displayData.skills && displayData.skills.length > 0 && (
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <FaCode className="text-indigo-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {displayData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Work Experience */}
      {displayData.workExperience && displayData.workExperience.length > 0 && (
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <FaBriefcase className="text-indigo-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
            </div>
            <div className="space-y-6">
              {displayData.workExperience.map((job, index) => (
                <div key={index} className="border-l-4 border-indigo-200 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {job.title}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-2">
                    {job.company} • {job.duration}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {displayData.education && displayData.education.length > 0 && (
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <FaGraduationCap className="text-indigo-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
            </div>
            <div className="space-y-6">
              {displayData.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-indigo-200 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {edu.degree}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-2">
                    {edu.institution} • {edu.year}
                  </p>
                  {edu.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {displayData.projects && displayData.projects.length > 0 && (
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <FaAward className="text-indigo-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayData.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {project.title || project.name}
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  {project.tech && project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
