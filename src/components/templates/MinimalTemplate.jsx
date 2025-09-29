import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';

const MinimalTemplate = ({ displayData, themeColors, theme = 'light' }) => {
  if (!displayData) return null;

  return (
    <div className="minimal-template w-full max-w-none mx-4 font-light">
      {/* Header Section */}
      <header className="text-center mb-12">
        {displayData.photoUrl && (
          <img
            src={displayData.photoUrl}
            alt={displayData.name}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-2 border-gray-200"
          />
        )}
        
        <h1 className={`text-5xl font-thin ${themeColors.text.primary[theme]} mb-2 tracking-wide`}>
          {displayData.name}
        </h1>
        <h2 className={`text-xl ${themeColors.text.secondary[theme]} mb-6 font-light`}>
          {displayData.title}
        </h2>
        
        {/* Contact Information */}
        <div className="flex justify-center gap-8 text-sm">
          {displayData.email && (
            <a href={`mailto:${displayData.email}`} 
               className={`${themeColors.text.secondary[theme]} hover:${themeColors.text.primary[theme]} transition-colors`}>
              {displayData.email}
            </a>
          )}
          {displayData.phone && (
            <span className={themeColors.text.secondary[theme]}>
              {displayData.phone}
            </span>
          )}
          {displayData.location && (
            <span className={themeColors.text.secondary[theme]}>
              {displayData.location}
            </span>
          )}
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-4">
          {displayData.linkedin && (
            <a href={displayData.linkedin} target="_blank" rel="noopener noreferrer" 
               className={`${themeColors.text.secondary[theme]} hover:text-blue-600 transition-colors`}>
              <FaLinkedin size={20} />
            </a>
          )}
          {displayData.github && (
            <a href={displayData.github} target="_blank" rel="noopener noreferrer"
               className={`${themeColors.text.secondary[theme]} hover:text-gray-800 transition-colors`}>
              <FaGithub size={20} />
            </a>
          )}
        </div>
      </header>

      {/* Summary Section */}
      {displayData.summary && (
        <section className="mb-12">
          <div className="text-center">
            <div className={`w-16 h-px bg-gradient-to-r ${themeColors.gradients.header} mx-auto mb-8`}></div>
            <p className={`${themeColors.text.secondary[theme]} leading-relaxed text-lg font-light w-full`}>
              {displayData.summary}
            </p>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {displayData.skills && displayData.skills.length > 0 && (
        <section className="mb-12">
          <h3 className={`text-2xl font-thin ${themeColors.text.primary[theme]} text-center mb-6`}>
            Skills
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {displayData.skills.map((skill, index) => (
              <span 
                key={index}
                className={`px-4 py-2 ${themeColors.text.secondary[theme]} text-sm border border-gray-200 rounded-full`}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience Section */}
      {displayData.workExperience && displayData.workExperience.length > 0 && (
        <section className="mb-12">
          <h3 className={`text-2xl font-thin ${themeColors.text.primary[theme]} text-center mb-8`}>
            Experience
          </h3>
          <div className="space-y-8">
            {displayData.workExperience.map((exp, index) => (
              <div key={index} className="text-center">
                <h4 className={`text-xl font-light ${themeColors.text.primary[theme]} mb-1`}>
                  {exp.title}
                </h4>
                <p className={`${themeColors.text.secondary[theme]} mb-2`}>
                  {exp.company} {exp.location && `• ${exp.location}`}
                </p>
                <p className={`text-sm ${themeColors.text.muted[theme]} mb-4`}>
                  {exp.start} - {exp.end}
                </p>
                {exp.description && (
                  <p className={`${themeColors.text.secondary[theme]} leading-relaxed w-full mx-auto font-light`}>
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
        <section className="mb-12">
          <h3 className={`text-2xl font-thin ${themeColors.text.primary[theme]} text-center mb-8`}>
            Education
          </h3>
          <div className="space-y-6">
            {displayData.education.map((edu, index) => (
              <div key={index} className="text-center">
                <h4 className={`text-lg font-light ${themeColors.text.primary[theme]} mb-1`}>
                  {edu.degree}
                </h4>
                <p className={`${themeColors.text.secondary[theme]} mb-1`}>
                  {edu.school}
                </p>
                <p className={`text-sm ${themeColors.text.muted[theme]}`}>
                  {edu.start} - {edu.end}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {displayData.projects && displayData.projects.length > 0 && (
        <section className="mb-12">
          <h3 className={`text-2xl font-thin ${themeColors.text.primary[theme]} text-center mb-8`}>
            Projects
          </h3>
          <div className="space-y-6">
            {displayData.projects.map((project, index) => (
              <div key={index} className="text-center">
                <h4 className={`text-lg font-light ${themeColors.text.primary[theme]} mb-2`}>
                  {project.title || project.name}
                </h4>
                {project.description && (
                  <p className={`${themeColors.text.secondary[theme]} leading-relaxed w-full mx-auto font-light mb-3`}>
                    {project.description}
                  </p>
                )}
                {project.tech && project.tech.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
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
                    className={`${themeColors.text.secondary[theme]} hover:underline text-sm`}
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
