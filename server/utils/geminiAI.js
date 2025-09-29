import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

class GeminiAIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
    }
    // Strictly use the environment variable; do not hardcode secrets
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    // Use free-tier model
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
  }

  async generateContent(prompt) {
    try {
      console.log('🤖 Generating content with Gemini AI...');

      const attempt = async () => {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('AI request timeout after 60 seconds')), 60000);
        });
        const aiPromise = this.model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, topP: 0.9 }
        });
        return Promise.race([aiPromise, timeoutPromise]);
      };

      // Retry up to 2 times on timeout/errors
      let result;
      for (let i = 0; i < 3; i++) {
        try {
          result = await attempt();
          break;
        } catch (err) {
          console.warn(`⚠️ Gemini attempt ${i + 1} failed:`, err.message);
          if (i === 2) throw err;
        }
      }

      const response = await result.response;

      return {
        response: {
          text: () => response.text()
        }
      };
    } catch (error) {
      console.error('❌ Gemini AI generateContent Error:', error);
      throw error;
    }
  }

  async extractPortfolioData(resumeText, partialData = {}) {
    try {
      console.log('🤖 Processing resume with Gemini AI...');

      const missingFields = Object.keys(partialData).filter(key => !partialData[key] || partialData[key] === '');
      const partialDataString = JSON.stringify(partialData, null, 2);

      // Chunk long resume text to avoid model limits
      const maxCharsPerChunk = 12000; // conservative for gemini-1.5-flash-8b
      const chunks = [];
      const source = String(resumeText || '');
      for (let i = 0; i < source.length; i += maxCharsPerChunk) {
        chunks.push(source.slice(i, i + maxCharsPerChunk));
      }

      const basePrompt = `
        You are an AI assistant that extracts and structures professional portfolio data from resume text.
        
        You will receive one or more chunks of resume text. Merge information across chunks.
        
        Please extract and structure the following information from the resume into a complete JSON object:
        
        {
          "name": "Full name of the person",
          "title": "Professional title or current role",
          "email": "Email address",
          "phone": "Phone number (if available)",
          "address": "Location/Address (if available)",
          "summary": "Professional summary or objective (if available, otherwise create a brief one based on experience)",
          "skills": ["Array of technical skills, programming languages, tools, frameworks, etc."]
          "experience": [
            {
              "title": "Job title",
              "company": "Company name",
              "duration": "Employment duration",
              "description": "Job description and achievements"
            }
          ],
          "education": [
            {
              "degree": "Degree name and field",
              "institution": "Institution name",
              "duration": "Study period",
              "grade": "GPA/Percentage/Grade (if available)"
            }
          ],
          "projects": [
            {
              "title": "Project name",
              "description": "Project description and achievements",
              "technologies": ["Array of technologies used"],
              "url": "Project URL (if available, otherwise empty string)"
            }
          ]
        }
        
        Rules:
        1. Extract all available information from the resume text
        2. If a field is not available, use empty string "" for strings, empty array [] for arrays, or appropriate default
        3. For skills, extract both technical and soft skills mentioned in the resume
        4. For experience, include all work experience, internships, and relevant positions
        5. For projects, include all academic, personal, and professional projects mentioned
        6. Ensure proper JSON formatting
        7. Be comprehensive but accurate - don't hallucinate information not in the resume
        
        Return ONLY the JSON object, no additional text or formatting.
      `;

      let aggregated = {};
      for (let idx = 0; idx < Math.max(1, chunks.length); idx++) {
        const chunk = chunks[idx] ?? source;
        const numbered = chunks.length > 1 ? `(chunk ${idx + 1} of ${chunks.length})` : '';
        const prompt = `${basePrompt}\n\nHere is the resume text ${numbered}:\n${chunk}`;

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Portfolio extraction timeout after 45 seconds')), 45000);
        });
        const aiPromise = this.model.generateContent(prompt);
        const result = await Promise.race([aiPromise, timeoutPromise]);
        const response = await result.response;
        const text = response.text();

        let cleanedText = text.trim();
        if (cleanedText.startsWith('```json')) cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        if (cleanedText.startsWith('```')) cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '');

        try {
          const parsed = JSON.parse(cleanedText);
          aggregated = this.mergePortfolioData(aggregated, parsed);
        } catch (e) {
          console.warn('⚠️ Failed to parse chunk JSON, skipping this chunk.');
        }
      }

      // Merge with partialData at the end
      const portfolioData = this.mergePortfolioData(partialData, aggregated);

      // Ensure required fields are present
      if (!portfolioData.name || portfolioData.name.trim() === '') {
        portfolioData.name = 'Professional Portfolio Owner';
      }

      console.log('✅ Portfolio data generated:', portfolioData);

      return {
        success: true,
        data: portfolioData
      };

    } catch (error) {
      console.error('❌ Gemini AI Error:', error);
      // Return a comprehensive fallback response
      return {
        success: false,
        error: error.message,
        fallbackData: {
          name: "Alex Johnson",
          title: "Software Developer",
          email: "alex.johnson@email.com",
          phone: "+1 (555) 123-4567",
          address: "San Francisco, CA, USA",
          summary: "Experienced software developer with a passion for creating innovative solutions and delivering high-quality applications. Skilled in modern web technologies and agile development practices.",
          skills: [
            "JavaScript", "React", "Node.js", "Python", "SQL",
            "Git", "AWS", "Problem Solving", "Team Collaboration"
          ],
          experience: [
            {
              title: "Software Developer",
              company: "Tech Solutions Inc.",
              duration: "Jan 2022 - Present",
              description: "Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions."
            },
            {
              title: "Junior Developer",
              company: "StartUp Innovations",
              duration: "Jun 2020 - Dec 2021",
              description: "Built responsive web interfaces and implemented RESTful APIs. Participated in code reviews and contributed to improving development processes."
            }
          ],
          education: [
            {
              degree: "Bachelor of Science in Computer Science",
              institution: "University of Technology",
              duration: "2016-2020",
              grade: "3.7/4.0"
            }
          ],
          projects: [
            {
              title: "E-commerce Platform",
              description: "Built a full-stack e-commerce application with user authentication, product catalog, and payment integration.",
              technologies: ["React", "Node.js", "MongoDB", "Stripe API"]
            },
            {
              title: "Task Management App",
              description: "Developed a collaborative task management application with real-time updates and team collaboration features.",
              technologies: ["Vue.js", "Express", "Socket.io", "PostgreSQL"]
            }
          ]
        }
      };
    }
  }

  mergePortfolioData(base, incoming) {
    const result = { ...(base || {}) };
    const addArray = (key) => {
      const a = Array.isArray(base?.[key]) ? base[key] : [];
      const b = Array.isArray(incoming?.[key]) ? incoming[key] : [];
      result[key] = [...a, ...b];
    };

    // Simple fields
    ['name','title','email','phone','address','summary','personaType'].forEach(k => {
      result[k] = incoming?.[k] || result[k] || '';
    });

    // Header
    result.header = { ...(base?.header || {}), ...(incoming?.header || {}) };
    result.header.contacts = { ...(base?.header?.contacts || {}), ...(incoming?.header?.contacts || {}) };
    result.header.skills = Array.from(new Set([...(base?.header?.skills || []), ...(incoming?.header?.skills || [])]));

    // Arrays
    addArray('skills');
    addArray('experience');
    addArray('education');
    addArray('projects');
    addArray('workExperience');

    // extraSections merge by key
    const baseSections = Array.isArray(base?.extraSections) ? base.extraSections : [];
    const incomingSections = Array.isArray(incoming?.extraSections) ? incoming.extraSections : [];
    const map = new Map();
    for (const s of baseSections) map.set(s.key || s.title || Math.random().toString(36).slice(2), s);
    for (const s of incomingSections) {
      const k = s.key || s.title || Math.random().toString(36).slice(2);
      if (map.has(k)) {
        const existing = map.get(k);
        existing.items = [...(existing.items || []), ...(s.items || [])];
        map.set(k, existing);
      } else {
        map.set(k, s);
      }
    }
    result.extraSections = Array.from(map.values());

    return result;
  }
}

// Export instance as default
const geminiAI = new GeminiAIService();
export default geminiAI;
