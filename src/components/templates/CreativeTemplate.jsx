import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaPaintBrush, FaStar, FaRocket } from 'react-icons/fa';

const CreativeTemplate = ({ displayData, themeColors, theme = 'light' }) => {
  if (!displayData) return null;

  return (
    <div className="creative-template w-full max-w-none mx-4">
      {/* Header Section */}
      <header className={`bg-gradient-to-br ${themeColors.gradients.header} text-white rounded-2xl p-8 mb-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <FaPaintBrush className="text-3xl mr-4 text-yellow-300" />
              <div>
                <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">
                  {displayData.name}
                </h1>
                <h2 className="text-2xl opacity-90 font-light">
                  {displayData.title}
                </h2>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="flex flex-wrap gap-6 text-white/90 mt-6">
              {displayData.email && (
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <FaEnvelope className="mr-2" />
                  <a href={`mailto:${displayData.email}`} className="hover:text-yellow-300 transition-colors">
                    {displayData.email}
                  </a>
                </div>
              )}
              {displayData.phone && (
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <FaPhone className="mr-2" />
                  {displayData.phone}
                </div>
              )}
              {displayData.location && (
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <FaMapMarkerAlt className="mr-2" />
                  {displayData.location}
                </div>
              )}
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              {displayData.linkedin && (
                <a href={displayData.linkedin} target="_blank" rel="noopener noreferrer" 
                   className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
                  <FaLinkedin size={20} />
                </a>
              )}
              {displayData.github && (
                <a href={displayData.github} target="_blank" rel="noopener noreferrer"
                   className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
                  <FaGithub size={20} />
                </a>
              )}
            </div>
          </div>
          
          {/* Profile Photo */}
          {displayData.photoUrl && (
            <div className="ml-8">
              <img
                src={displayData.photoUrl}
                alt={displayData.name}
                className="w-40 h-40 rounded-2xl object-cover border-4 border-white/30 shadow-2xl max-w-full max-h-full"
              />
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary Section */}
          {displayData.summary && (
            <section className={`${themeColors.card[theme]} rounded-2xl p-8 shadow-lg border-l-4 border-pink-500`}>
              <div className="flex items-center mb-6">
                <FaStar className="text-3xl text-pink-500 mr-4" />
                <h3 className={`text-3xl font-bold ${themeColors.text.primary[theme]}`}>
                  About Me
                </h3>
              </div>
              <p className={`${themeColors.text.secondary[theme]} leading-relaxed text-lg`}>
                {displayData.summary}
              </p>
            </section>
          )}

          {/* Work Experience Section */}
          {displayData.workExperience && displayData.workExperience.length > 0 && (
            <section className={`${themeColors.card[theme]} rounded-2xl p-8 shadow-lg border-l-4 border-blue-500`}>
              <div className="flex items-center mb-8">
                <FaRocket className="text-3xl text-blue-500 mr-4" />
                <h3 className={`text-3xl font-bold ${themeColors.text.primary[theme]}`}>
                  Experience Journey
                </h3>
              </div>
              <div className="space-y-8">
                {displayData.workExperience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className={`bg-gradient-to-r ${themeColors.gradients.skills} rounded-xl p-6 text-white shadow-lg`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold mb-1">
                            {exp.title}
                          </h4>
                          <p className="text-white/90 font-medium">
                            {exp.company}
                          </p>
                          {exp.location && (
                            <p className="text-sm text-white/70">
                              {exp.location}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-white/90">
                          <p className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                            {exp.start} - {exp.end}
                          </p>
                          {exp.contract && (
                            <p className="text-xs mt-1">{exp.contract}</p>
                          )}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-white/90 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {displayData.projects && displayData.projects.length > 0 && (
            <section className={`${themeColors.card[theme]} rounded-2xl p-8 shadow-lg border-l-4 border-orange-500`}>
              <div className="flex items-center mb-8">
                <FaPaintBrush className="text-3xl text-orange-500 mr-4" />
                <h3 className={`text-3xl font-bold ${themeColors.text.primary[theme]}`}>
                  Creative Works
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayData.projects.map((project, index) => (
                  <div key={index} className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-xl p-6 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                    <h4 className={`text-lg font-bold ${themeColors.text.primary[theme]} mb-3`}>
                      {project.title || project.name}
                    </h4>
                    {project.description && (
                      <p className={`${themeColors.text.secondary[theme]} mb-4 leading-relaxed`}>
                        {project.description}
                      </p>
                    )}
                    {project.tech && project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-3 py-1 bg-white/70 text-purple-700 text-xs rounded-full font-medium"
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
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Skills Section */}
          {displayData.skills && displayData.skills.length > 0 && (
            <section className={`${themeColors.card[theme]} rounded-2xl p-6 shadow-lg`}>
              <h3 className={`text-2xl font-bold ${themeColors.text.primary[theme]} mb-6 text-center`}>
                Skills & Expertise
              </h3>
              <div className="space-y-3">
                {displayData.skills.map((skill, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-r ${themeColors.gradients.skills} text-white rounded-full py-3 px-4 text-center font-medium shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {displayData.education && displayData.education.length > 0 && (
            <section className={`${themeColors.card[theme]} rounded-2xl p-6 shadow-lg`}>
              <h3 className={`text-2xl font-bold ${themeColors.text.primary[theme]} mb-6 text-center`}>
                Education
              </h3>
              <div className="space-y-6">
                {displayData.education.map((edu, index) => (
                  <div key={index} className="text-center">
                    <div className={`bg-gradient-to-r ${themeColors.gradients.languages} text-white rounded-xl p-4 shadow-lg`}>
                      <h4 className="text-lg font-bold mb-2">
                        {edu.degree}
                      </h4>
                      <p className="text-white/90 mb-2">
                        {edu.school}
                      </p>
                      <p className="text-sm text-white/80 bg-white/20 rounded-full px-3 py-1 inline-block">
                        {edu.start} - {edu.end}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
