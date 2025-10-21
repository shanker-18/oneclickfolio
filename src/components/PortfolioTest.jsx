import React from 'react';
import PortfolioDisplay from './PortfolioDisplay';

const PortfolioTest = () => {
  // Sample portfolio data with projects
  const samplePortfolio = {
    _id: 'test-portfolio-id',
    title: 'John Doe - Portfolio',
    isPublished: true,
    header: {
      name: 'John Doe',
      shortAbout: 'Full Stack Developer & UI/UX Designer',
      location: 'San Francisco, CA',
      photoUrl: null,
      contacts: {
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        website: 'https://johndoe.dev',
        linkedin: 'johndoe',
        github: 'johndoe',
        twitter: 'johndoe'
      },
      skills: [
        'JavaScript',
        'React',
        'Node.js',
        'Python',
        'PostgreSQL',
        'Docker',
        'AWS',
        'UI/UX Design'
      ]
    },
    summary: 'Experienced Full Stack Developer with 8+ years of expertise in building scalable web applications and leading development teams. Passionate about creating user-centered solutions and leveraging modern technologies to solve complex business challenges.',
    workExperience: [
      {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        start: 'Jan 2021',
        end: 'Present',
        contract: 'Full-time',
        description: 'Lead development of customer-facing web applications serving 1M+ users. Built microservices architecture using Node.js, React, and PostgreSQL. Mentored junior developers and implemented CI/CD pipelines.'
      },
      {
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        start: 'Jun 2019',
        end: 'Dec 2020',
        contract: 'Contract',
        description: 'Developed responsive web applications using React and TypeScript. Collaborated with design team to implement pixel-perfect UI components and optimize performance.'
      }
    ],
    education: [
      {
        degree: 'Master of Science in Computer Science',
        school: 'Stanford University',
        start: '2015',
        end: '2017'
      },
      {
        degree: 'Bachelor of Science in Software Engineering',
        school: 'UC Berkeley',
        start: '2011',
        end: '2015'
      }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, inventory management, and admin dashboard.',
        technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Stripe API', 'AWS S3', 'Docker'],
        liveUrl: 'https://shop-demo.example.com',
        githubUrl: 'https://github.com/johndoe/ecommerce-platform',
        startDate: 'Jan 2023',
        endDate: 'Jun 2023',
        status: 'completed'
      },
      {
        name: 'Task Management App',
        title: 'TaskMaster Pro', // Alternative name field
        description: 'A collaborative project management tool with real-time updates, drag-and-drop interface, and team collaboration features. Built using React, Socket.io, and MongoDB.',
        technologies: ['React', 'Socket.io', 'MongoDB', 'Express', 'Material-UI', 'JWT'],
        liveUrl: 'https://taskmaster-demo.example.com',
        githubUrl: 'https://github.com/johndoe/taskmaster-pro',
        demoUrl: 'https://demo.taskmaster.example.com',
        duration: '4 months',
        status: 'completed'
      },
      {
        name: 'Weather Analytics Dashboard',
        description: 'Real-time weather data visualization dashboard with interactive charts, forecasting, and geolocation features. Integrated with multiple weather APIs for comprehensive data.',
        technologies: ['Vue.js', 'D3.js', 'Python', 'Flask', 'OpenWeather API', 'Chart.js'],
        githubUrl: 'https://github.com/johndoe/weather-dashboard',
        startDate: 'Sep 2022',
        endDate: 'Nov 2022',
        status: 'completed'
      },
      {
        name: 'Mobile Fitness Tracker',
        description: 'React Native mobile application for tracking workouts, nutrition, and health metrics. Features offline support, data synchronization, and social sharing.',
        technologies: ['React Native', 'Redux', 'SQLite', 'Firebase', 'Health Kit', 'Google Fit'],
        githubUrl: 'https://github.com/johndoe/fitness-tracker',
        startDate: 'Mar 2023',
        status: 'in-progress'
      },
      {
        name: 'AI-Powered Content Generator',
        description: 'A web application that leverages OpenAI GPT models to generate marketing copy, blog posts, and social media content. Includes user authentication and subscription management.',
        technologies: ['Next.js', 'OpenAI API', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
        liveUrl: 'https://contentgen-ai.example.com',
        startDate: 'Aug 2023',
        status: 'in-progress'
      }
    ]
  };

  return (
    <div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Test Mode:</strong> This is a demonstration of the portfolio display with sample project data.
              The projects section will appear after the education section.
            </p>
          </div>
        </div>
      </div>
      <PortfolioDisplay portfolio={samplePortfolio} />
    </div>
  );
};

export default PortfolioTest;