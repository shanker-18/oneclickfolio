import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ClassicTemplate = ({ displayData, themeColors, theme = 'light' }) => {
  if (!displayData) return null;

  return (
    <div className="classic-template w-full max-w-none">
      {/* Header Section */}
      <header className={`${themeColors.card[theme]} rounded-lg shadow-lg p-8 mb-6 mx-4`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className={`text-4xl font-bold ${themeColors.text.primary[theme]} mb-2`}>
              {displayData.name}
            </h1>
            <h2 className={`text-xl ${themeColors.text.secondary[theme]} mb-4`}>
              {displayData.title}
            </h2>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {displayData.email && (
                <div className={`flex items-center ${themeColors.text.secondary[theme]}`}>
                  <FaEnvelope className="mr-2" />
                  <a href={`mailto:${displayData.email}`} className="hover:underline">
                    {displayData.email}
                  </a>
                </div>
              )}
              {displayData.phone && (
                <div className={`flex items-center ${themeColors.text.secondary[theme]}`}>
                  <FaPhone className="mr-2" />
                  {displayData.phone}
                </div>
              )}
              {displayData.location && (
                <div className={`flex items-center ${themeColors.text.secondary[theme]}`}>
                  <FaMapMarkerAlt className="mr-2" />
                  {displayData.location}
                </div>
              )}
              <div className="flex gap-4">
                {displayData.linkedin && (
                  <a href={displayData.linkedin} target="_blank" rel="noopener noreferrer" 
                     className={`${themeColors.text.secondary[theme]} hover:text-blue-600`}>
                    <FaLinkedin />
                  </a>
                )}
                {displayData.github && (
                  <a href={displayData.github} target="_blank" rel="noopener noreferrer"
                     className={`${themeColors.text.secondary[theme]} hover:text-gray-800`}>
                    <FaGithub />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Photo */}
          {displayData.photoUrl && (
            <img
              src={displayData.photoUrl}
              alt={displayData.name}
              className="w-24 h-24 rounded-lg object-cover ml-6 max-w-full max-h-full"
            />
          )}
        </div>
      </header>

      {/* Summary Section */}
      {displayData.summary && (
        <section className={`${themeColors.card[theme]} rounded-lg shadow-lg p-6 mb-6 mx-4`}>
          <h3 className={`text-2xl font-bold ${themeColors.text.primary[theme]} mb-4 border-b ${themeColors.border[theme]} pb-2`}>
            Professional Summary
          </h3>
          <p className={`${themeColors.text.secondary[theme]} leading-relaxed`}>
            {displayData.summary}
          </p>
        </section>
      )}

      {/* Skills Section */}
      {displayData.skills && displayData.skills.length > 0 && (
        <section className={`${themeColors.card[theme]} rounded-lg shadow-lg p-6 mb-6 mx-4`}>
          <h3 className={`text-2xl font-bold ${themeColors.text.primary[theme]} mb-4 border-b ${themeColors.border[theme]} pb-2`}>
            Core Skills
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {displayData.skills.map((skill, index) => (
              <div key={index} className={`${themeColors.text.secondary[theme]} py-1`}>
                • {skill}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience Section */}
      {displayData.workExperience && displayData.workExperience.length > 0 && (
        <section className={`${themeColors.card[theme]} rounded-lg shadow-lg p-6 mb-6 mx-4`}>
          <h3 className={`text-2xl font-bold ${themeColors.text.primary[theme]} mb-4 border-b ${themeColors.border[theme]} pb-2`}>
            Professional Experience
          </h3>
          <div className="space-y-6">
            {displayData.workExperience.map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className={`text-lg font-semibold ${themeColors.text.primary[theme]}`}>
                      {exp.title}
                    </h4>
                    <p className={`${themeColors.text.secondary[theme]} font-medium`}>
                      {exp.company}
                    </p>
                    {exp.location && (
                      <p className={`text-sm ${themeColors.text.muted[theme]}`}>
                        {exp.location}
                      </p>
                    )}
                  </div>
                  <div className={`text-sm ${themeColors.text.muted[theme]} text-right`}>
                    <p>{exp.start} - {exp.end}</p>
                    {exp.contract && (
                      <p className="text-xs">{exp.contract}</p>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <p className={`${themeColors.text.secondary[theme]} leading-relaxed`}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {displayData.education && displayData.education.length > 0 && (
        <section className={`${themeColors.card[theme]} rounded-lg shadow-lg p-6 mb-6 mx-4`}>
          <h3 className={`text-2xl font-bold ${themeColors.text.primary[theme]} mb-4 border-b ${themeColors.border[theme]} pb-2`}>
            Education
          </h3>
          <div className="space-y-4">
            {displayData.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h4 className={`text-lg font-semibold ${themeColors.text.primary[theme]}`}>
                    {edu.degree}
                  </h4>
                  <p className={`${themeColors.text.secondary[theme]}`}>
                    {edu.school}
                  </p>
                </div>
                <div className={`text-sm ${themeColors.text.muted[theme]} text-right`}>
                  <p>{edu.start} - {edu.end}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {displayData.projects && displayData.projects.length > 0 && (
        <section className={`${themeColors.card[theme]} rounded-lg shadow-lg p-6 mx-4`}>
          <h3 className={`text-2xl font-bold ${themeColors.text.primary[theme]} mb-4 border-b ${themeColors.border[theme]} pb-2`}>
            Notable Projects
          </h3>
          <div className="space-y-4">
            {displayData.projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className={`text-lg font-semibold ${themeColors.text.primary[theme]}`}>
                      {project.title || project.name}
                    </h4>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium mt-1"
                      >
                        <FaExternalLinkAlt className="text-xs" />
                        View Project
                      </a>
                    )}
                  </div>
                </div>
                {project.description && (
                  <p className={`${themeColors.text.secondary[theme]} mt-2`}>
                    {project.description}
                  </p>
                )}
                {project.tech && project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
