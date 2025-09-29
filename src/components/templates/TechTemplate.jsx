import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaCode, FaTerminal, FaServer, FaRocket } from 'react-icons/fa';

const TechTemplate = ({ displayData, themeColors, theme = 'light' }) => {
  if (!displayData) return null;

  return (
    <div className="tech-template w-full max-w-none mx-4 bg-gray-900 text-green-400 font-mono">
      {/* Header Section */}
      <header className="bg-black border border-green-500 rounded-lg p-8 mb-8 shadow-2xl shadow-green-500/20">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <FaTerminal className="text-4xl mr-4 text-green-400" />
              <div>
                <div className="text-green-600 text-sm mb-1">$ whoami</div>
                <h1 className="text-5xl font-bold mb-2 text-green-400 typewriter">
                  {displayData.name}
                </h1>
                <div className="text-green-600 text-sm mb-1">$ cat role.txt</div>
                <h2 className="text-2xl text-green-300 font-light">
                  {displayData.title}
                </h2>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-300 mt-6">
              {displayData.email && (
                <div className="flex items-center bg-gray-800 rounded px-4 py-2 border border-green-700">
                  <span className="text-green-600 mr-2">📧</span>
                  <a href={`mailto:${displayData.email}`} className="hover:text-green-400 transition-colors">
                    {displayData.email}
                  </a>
                </div>
              )}
              {displayData.phone && (
                <div className="flex items-center bg-gray-800 rounded px-4 py-2 border border-green-700">
                  <span className="text-green-600 mr-2">📞</span>
                  {displayData.phone}
                </div>
              )}
              {displayData.location && (
                <div className="flex items-center bg-gray-800 rounded px-4 py-2 border border-green-700">
                  <span className="text-green-600 mr-2">📍</span>
                  {displayData.location}
                </div>
              )}
              <div className="flex gap-4">
                {displayData.linkedin && (
                  <a href={displayData.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="bg-gray-800 rounded p-2 border border-green-700 hover:border-green-500 transition-colors">
                    <FaLinkedin className="text-green-400" />
                  </a>
                )}
                {displayData.github && (
                  <a href={displayData.github} target="_blank" rel="noopener noreferrer"
                     className="bg-gray-800 rounded p-2 border border-green-700 hover:border-green-500 transition-colors">
                    <FaGithub className="text-green-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Photo */}
          {displayData.photoUrl && (
            <div className="ml-8">
              <img
                src={displayData.photoUrl}
                alt={displayData.name}
                className="w-40 h-40 rounded-lg object-cover border-2 border-green-500 shadow-lg shadow-green-500/50 max-w-full max-h-full"
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
            <section className="bg-black border border-green-500 rounded-lg p-6 shadow-lg shadow-green-500/10">
              <div className="flex items-center mb-4">
                <FaCode className="text-2xl text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-green-400">
                  $ cat about.md
                </h3>
              </div>
              <div className="bg-gray-900 rounded p-4 border-l-4 border-green-500">
                <pre className="text-green-300 leading-relaxed whitespace-pre-wrap font-sans">
{displayData.summary}
                </pre>
              </div>
            </section>
          )}

          {/* Work Experience Section */}
          {displayData.workExperience && displayData.workExperience.length > 0 && (
            <section className="bg-black border border-green-500 rounded-lg p-6 shadow-lg shadow-green-500/10">
              <div className="flex items-center mb-6">
                <FaServer className="text-2xl text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-green-400">
                  $ ls -la experience/
                </h3>
              </div>
              <div className="space-y-6">
                {displayData.workExperience.map((exp, index) => (
                  <div key={index} className="bg-gray-900 border border-green-700 rounded p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-green-600 text-sm">// Position</div>
                        <h4 className="text-xl font-bold text-green-400 mb-1">
                          {exp.title}
                        </h4>
                        <div className="text-green-600 text-sm">// Company</div>
                        <p className="text-green-300 font-medium">
                          {exp.company}
                        </p>
                        {exp.location && (
                          <>
                            <div className="text-green-600 text-sm">// Location</div>
                            <p className="text-green-300 text-sm">
                              {exp.location}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div className="bg-green-900 text-green-300 rounded px-3 py-1 border border-green-700">
                          {exp.start} - {exp.end}
                        </div>
                        {exp.contract && (
                          <p className="text-green-600 text-xs mt-1">{exp.contract}</p>
                        )}
                      </div>
                    </div>
                    {exp.description && (
                      <div>
                        <div className="text-green-600 text-sm mb-2">// Description</div>
                        <p className="text-green-300 leading-relaxed bg-gray-800 p-3 rounded border-l-2 border-green-500">
                          {exp.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {displayData.projects && displayData.projects.length > 0 && (
            <section className="bg-black border border-green-500 rounded-lg p-6 shadow-lg shadow-green-500/10">
              <div className="flex items-center mb-6">
                <FaRocket className="text-2xl text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-green-400">
                  $ git log --projects
                </h3>
              </div>
              <div className="space-y-6">
                {displayData.projects.map((project, index) => (
                  <div key={index} className="bg-gray-900 border border-green-700 rounded p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-green-600 text-sm">commit {Math.random().toString(36).substr(2, 8)}</div>
                        <h4 className="text-lg font-bold text-green-400 mb-2">
                          {project.title || project.name}
                        </h4>
                      </div>
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-green-900 text-green-300 px-3 py-1 rounded border border-green-700 hover:border-green-500 transition-colors"
                        >
                          View →
                        </a>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-green-300 leading-relaxed mb-4 bg-gray-800 p-3 rounded">
                        {project.description}
                      </p>
                    )}
                    {project.tech && project.tech.length > 0 && (
                      <div>
                        <div className="text-green-600 text-sm mb-2">// Tech Stack</div>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded border border-green-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
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
            <section className="bg-black border border-green-500 rounded-lg p-6 shadow-lg shadow-green-500/10">
              <div className="flex items-center mb-4">
                <FaCode className="text-xl text-green-400 mr-2" />
                <h3 className="text-xl font-bold text-green-400">
                  ./skills.sh
                </h3>
              </div>
              <div className="bg-gray-900 rounded p-4 border border-green-700">
                <div className="text-green-600 text-sm mb-2"># Available Technologies</div>
                <div className="space-y-2">
                  {displayData.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="text-green-300 py-1 px-2 hover:bg-gray-800 rounded transition-colors"
                    >
                      <span className="text-green-600 mr-2">→</span>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Education Section */}
          {displayData.education && displayData.education.length > 0 && (
            <section className="bg-black border border-green-500 rounded-lg p-6 shadow-lg shadow-green-500/10">
              <div className="flex items-center mb-4">
                <span className="text-xl text-green-400 mr-2">🎓</span>
                <h3 className="text-xl font-bold text-green-400">
                  $ cat education.log
                </h3>
              </div>
              <div className="space-y-4">
                {displayData.education.map((edu, index) => (
                  <div key={index} className="bg-gray-900 border border-green-700 rounded p-4">
                    <div className="text-green-600 text-sm">// Degree</div>
                    <h4 className="text-lg font-bold text-green-400 mb-1">
                      {edu.degree}
                    </h4>
                    <div className="text-green-600 text-sm">// Institution</div>
                    <p className="text-green-300 mb-2">
                      {edu.school}
                    </p>
                    <div className="text-green-600 text-sm">// Duration</div>
                    <div className="bg-green-900 text-green-300 text-sm rounded px-2 py-1 inline-block border border-green-700">
                      {edu.start} - {edu.end}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* System Info */}
          <section className="bg-black border border-green-500 rounded-lg p-6 shadow-lg shadow-green-500/10">
            <div className="flex items-center mb-4">
              <FaTerminal className="text-xl text-green-400 mr-2" />
              <h3 className="text-xl font-bold text-green-400">
                $ system --info
              </h3>
            </div>
            <div className="bg-gray-900 rounded p-4 border border-green-700 text-sm">
              <div className="text-green-600">OS: Developer v2024</div>
              <div className="text-green-600">Shell: /bin/passion</div>
              <div className="text-green-600">Runtime: Coffee.js</div>
              <div className="text-green-600">Uptime: {new Date().getFullYear() - 2010} years</div>
              <div className="text-green-600">Status: Ready to code</div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .typewriter {
          animation: typing 2s steps(20, end);
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
};

export default TechTemplate;
