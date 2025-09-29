import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaExternalLinkAlt, FaCamera, FaEdit, FaBriefcase, FaGraduationCap, FaCode, FaAward, FaHeart, FaRocket, FaStar } from "react-icons/fa";

const CreativeTemplateNew = ({ displayData, themeColors, theme = 'light', isEditing = false, onPhotoUpload }) => {
  if (!displayData) return null;

  return (
    <div className="creative-template w-full px-4 md:px-8 lg:px-12">
      {/* Creative Hero Section */}
      <section className="relative mb-16 overflow-hidden">
        <div className={`bg-gradient-to-br ${themeColors.gradients.header} text-white rounded-3xl p-8 md:p-12 relative w-full`}>
          {/* Creative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-6 left-6 w-24 h-24 border-2 border-white rounded-full"></div>
            <div className="absolute top-12 right-12 w-20 h-20 border-2 border-white rounded-xl rotate-45"></div>
            <div className="absolute bottom-6 left-12 w-16 h-16 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-12 right-6 w-18 h-18 border-2 border-white rounded-xl rotate-12"></div>
            <div className="absolute top-1/2 left-1/4 w-14 h-14 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 border-2 border-white rounded-xl rotate-45"></div>
          </div>
          
          <div className="relative z-10 text-center">
            {/* Creative Profile Image Section */}
            <div className="mb-8 relative inline-block">
              {displayData.photoUrl ? (
                <div className="relative">
                  <div className="relative">
                    <img
                      src={displayData.photoUrl}
                      alt={displayData.name}
                      className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full object-cover mx-auto border-4 border-white/30 shadow-2xl max-w-full max-h-full"
                    />
                    {/* Creative Decorative Elements */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <FaStar className="text-white text-sm" />
                    </div>
                    <div className="absolute -top-2 -right-6 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <FaRocket className="text-white text-xs" />
                    </div>
                    <div className="absolute -bottom-4 -left-2 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                      <FaHeart className="text-white text-xs" />
                    </div>
                  </div>
                  {/* Upload Button Overlay */}
                  {isEditing && onPhotoUpload && (
                    <button
                      onClick={onPhotoUpload}
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-2 border-white"
                      title="Change photo"
                    >
                      <FaCamera className="text-white text-sm" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-white/20 border-4 border-white/30 shadow-2xl flex items-center justify-center mx-auto">
                    <FaCamera className="text-white/60 text-6xl" />
                  </div>
                  {/* Upload Button - Always visible when no image */}
                  <button
                    onClick={onPhotoUpload}
                    className="absolute -bottom-2 -right-2 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-2 border-white hover:scale-110"
                    title="Upload photo"
                  >
                    <FaEdit className="text-white text-lg" />
                  </button>
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
            
            {/* Creative Contact Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {displayData.email && (
                <a
                  href={`mailto:${displayData.email}`}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:rotate-1"
                >
                  <FaEnvelope />
                  Email
                </a>
              )}
              {displayData.phone && (
                <a
                  href={`tel:${displayData.phone}`}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:rotate-1"
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
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:rotate-1"
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
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:rotate-1"
                >
                  <FaGithub />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {displayData.summary && (
        <section className="mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <FaHeart className="text-white text-xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">About Me</h2>
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
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-4">
                <FaCode className="text-white text-xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Skills & Expertise</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {displayData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-6 py-3 rounded-full font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
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
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                <FaBriefcase className="text-white text-xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Work Experience</h2>
            </div>
            <div className="space-y-8">
              {displayData.workExperience.map((job, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute left-0 top-0 w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"></div>
                  <div className="absolute left-1.5 top-4 w-0.5 h-full bg-gradient-to-b from-indigo-300 to-purple-300"></div>
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-indigo-600 font-semibold text-lg mb-3">
                      {job.company} • {job.duration}
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {job.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {displayData.education && displayData.education.length > 0 && (
        <section className="mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Education</h2>
            </div>
            <div className="space-y-8">
              {displayData.education.map((edu, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute left-0 top-0 w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full"></div>
                  <div className="absolute left-1.5 top-4 w-0.5 h-full bg-gradient-to-b from-blue-300 to-indigo-300"></div>
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {edu.degree}
                    </h3>
                    <p className="text-blue-600 font-semibold text-lg mb-3">
                      {edu.institution} • {edu.year}
                    </p>
                    {edu.description && (
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {displayData.projects && displayData.projects.length > 0 && (
        <section className="mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                <FaAward className="text-white text-xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayData.projects.map((project, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
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
                          className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
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
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-lg"
                    >
                      <FaExternalLinkAlt />
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

export default CreativeTemplateNew;
