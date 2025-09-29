import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaExternalLinkAlt, FaCrown } from 'react-icons/fa';

const ElegantTemplate = ({ displayData, themeColors, theme = 'light' }) => {
  if (!displayData) return null;

  return (
    <div className="elegant-template w-full max-w-none">
      {/* Elegant Header Section */}
      <section className="mb-16 text-center mx-4">
        <div className={`${themeColors.card[theme]} p-12 rounded-3xl shadow-2xl relative overflow-hidden border ${themeColors.border[theme]}`}>
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 border-2 border-purple-300 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-2 border-purple-300 rounded-full translate-x-12 translate-y-12"></div>
          </div>
          
          <div className="relative z-10">
            {displayData.photoUrl && (
              <img
                src={displayData.photoUrl}
                alt={displayData.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-8 border-4 border-white shadow-xl"
              />
            )}
            
            <h1 className={`text-4xl md:text-5xl font-light mb-6 tracking-wide ${themeColors.text.primary[theme]}`}>
              {displayData.name}
            </h1>
            <p className={`text-xl md:text-2xl font-light mb-8 ${themeColors.text.secondary[theme]} tracking-wide`}>
              {displayData.title}
            </p>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {displayData.phone && (
                <div className="flex items-center justify-center space-x-3">
                  <FaPhone className="text-purple-600 text-lg" />
                  <span className={themeColors.text.primary[theme]}>{displayData.phone}</span>
                </div>
              )}
              
              {displayData.email && (
                <div className="flex items-center justify-center space-x-3">
                  <FaEnvelope className="text-purple-600 text-lg" />
                  <a href={`mailto:${displayData.email}`} className="text-purple-600 hover:underline">
                    {displayData.email}
                  </a>
                </div>
              )}
              
              {displayData.location && (
                <div className="flex items-center justify-center space-x-3">
                  <FaMapMarkerAlt className="text-purple-600 text-lg" />
                  <span className={themeColors.text.primary[theme]}>{displayData.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-6 mt-6">
              {displayData.linkedin && (
                <a href={displayData.linkedin} target="_blank" rel="noopener noreferrer" 
                   className="text-purple-600 hover:text-purple-800 transition-colors">
                  <FaLinkedin size={24} />
                </a>
              )}
              {displayData.github && (
                <a href={displayData.github} target="_blank" rel="noopener noreferrer"
                   className="text-purple-600 hover:text-purple-800 transition-colors">
                  <FaGithub size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {displayData.summary && (
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-purple-600 mb-4 tracking-wide">
              <FaCrown className="inline mr-3" />
              About
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
          </div>
          
          <div className={`${themeColors.cardHover[theme]} p-10 rounded-2xl shadow-xl mx-4 border ${themeColors.border[theme]}`}>
            <p className={`${themeColors.text.primary[theme]} text-lg leading-relaxed text-center italic`}>
              "{displayData.summary}"
            </p>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {displayData.skills && displayData.skills.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-purple-600 mb-4 tracking-wide">
              <FaCrown className="inline mr-3" />
              Expertise
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
          </div>
          
          <div className={`${themeColors.cardHover[theme]} p-8 rounded-2xl shadow-xl mx-4 border ${themeColors.border[theme]}`}>
            <h3 className={`text-2xl font-light mb-6 text-center ${themeColors.text.primary[theme]}`}>Skills & Competencies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  <span className={`${themeColors.text.primary[theme]} text-lg font-light`}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Work Experience Section */}
      {displayData.workExperience && displayData.workExperience.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-purple-600 mb-4 tracking-wide">
              <FaCrown className="inline mr-3" />
              Professional Journey
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
          </div>
          
          <div className="mx-4 space-y-8">
            {displayData.workExperience.map((exp, index) => (
              <div key={index} className={`${themeColors.cardHover[theme]} p-8 rounded-2xl shadow-xl relative border ${themeColors.border[theme]}`}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-purple-600 rounded-l-2xl"></div>
                <div className="pl-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-2xl font-light ${themeColors.text.primary[theme]} mb-2`}>{exp.title}</h3>
                      <p className={`text-xl ${themeColors.text.secondary[theme]} font-light`}>{exp.company}</p>
                      {exp.location && (
                        <p className={`text-lg ${themeColors.text.muted[theme]} italic`}>{exp.location}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-purple-600 font-medium bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full">
                        {exp.start} - {exp.end}
                      </p>
                      {exp.contract && (
                        <p className={`text-sm ${themeColors.text.muted[theme]} mt-1`}>{exp.contract}</p>
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
            <h2 className="text-3xl font-light text-purple-600 mb-4 tracking-wide">
              <FaCrown className="inline mr-3" />
              Education
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
          </div>
          
          <div className="mx-4 space-y-6">
            {displayData.education.map((edu, index) => (
              <div key={index} className={`${themeColors.cardHover[theme]} p-8 rounded-2xl shadow-xl relative border ${themeColors.border[theme]}`}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-purple-600 rounded-l-2xl"></div>
                <div className="pl-8 flex justify-between items-start">
                  <div>
                    <h3 className={`text-2xl font-light ${themeColors.text.primary[theme]} mb-2`}>{edu.degree}</h3>
                    <p className={`text-xl ${themeColors.text.secondary[theme]} font-light`}>{edu.school}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-600 font-medium bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full">
                      {edu.start} - {edu.end}
                    </p>
                  </div>
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
            <h2 className="text-3xl font-light text-purple-600 mb-4 tracking-wide">
              <FaCrown className="inline mr-3" />
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-4">
            {displayData.projects.map((project, index) => (
              <div key={index} className={`${themeColors.cardHover[theme]} rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border ${themeColors.border[theme]}`}>
                <div className="p-8">
                  <h3 className={`text-2xl font-light ${themeColors.text.primary[theme]} mb-4`}>
                    {project.title || project.name}
                  </h3>
                  {project.description && (
                    <p className={`${themeColors.text.secondary[theme]} text-lg mb-6 leading-relaxed font-light`}>
                      {project.description}
                    </p>
                  )}
                  {project.tech && project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium"
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
                      className="inline-flex items-center text-purple-600 hover:underline text-lg font-medium"
                    >
                      Explore Project <FaExternalLinkAlt className="ml-2" />
                    </a>
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

export default ElegantTemplate;
