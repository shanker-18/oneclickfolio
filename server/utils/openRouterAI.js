import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

class OpenRouterAIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    
    if (!this.apiKey) {
      console.warn('⚠️ OPENROUTER_API_KEY not found in environment variables');
    }
    
    // Using GPT-4 Turbo for better accuracy with resume parsing
    this.model = "openai/gpt-4-turbo";
    
    console.log('🤖 OpenRouter AI Service initialized');
    console.log('📡 Base URL:', this.baseURL);
    console.log('🎯 Model:', this.model);
  }

  async generateContent(prompt) {
    try {
      console.log('🤖 Generating content with OpenRouter AI...');
      console.log('🔑 Using API Key:', this.apiKey ? 'Present' : 'Missing');

      const attempt = async () => {
        const response = await axios.post(`${this.baseURL}/chat/completions`, {
          model: this.model,
          messages: [
            {
              role: "system",
              content: "You are an expert resume parser and professional portfolio creator. You excel at extracting comprehensive information from resume text and structuring it into proper JSON format. Always return valid JSON without any markdown formatting or extra text."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 4000,
          top_p: 0.9
        }, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5000',
            'X-Title': 'Resume Portfolio Generator'
          },
          timeout: 60000 // 60 seconds timeout
        });

        return response.data;
      };

      // Retry up to 3 times on timeout/errors
      let result;
      for (let i = 0; i < 3; i++) {
        try {
          result = await attempt();
          break;
        } catch (err) {
          console.warn(`⚠️ OpenRouter attempt ${i + 1} failed:`, err.response?.data || err.message);
          if (i === 2) throw err;
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }

      const content = result.choices[0]?.message?.content || '';
      
      console.log('✅ OpenRouter AI response received');
      console.log('📊 Response length:', content.length);
      console.log('🔍 Response preview:', content.substring(0, 200) + '...');

      return {
        response: {
          text: () => content
        }
      };
    } catch (error) {
      console.error('❌ OpenRouter AI generateContent Error:', error.response?.data || error.message);
      
      // Provide more specific error messages
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenRouter API key. Please check your credentials.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 402) {
        throw new Error('Insufficient credits. Please check your OpenRouter account balance.');
      } else {
        throw error;
      }
    }
  }

  async extractPortfolioData(resumeText, partialData = {}) {
    try {
      console.log('🤖 Processing resume with OpenRouter AI...');
      console.log('📄 Resume text length:', resumeText.length);

      const missingFields = Object.keys(partialData).filter(key => !partialData[key] || partialData[key] === '');
      const partialDataString = JSON.stringify(partialData, null, 2);
      
      const prompt = `
        You are an AI assistant that extracts and structures professional portfolio data from resume text.
        
        Here is the resume text:
        ${resumeText}
        
        Please extract and structure the following information from the resume into a complete JSON object:
        
        {
          "name": "Full name of the person",
          "title": "Professional title or current role",
          "email": "Email address",
          "phone": "Phone number (if available)",
          "address": "Location/Address (if available)",
          "summary": "Professional summary or objective (if available, otherwise create a brief one based on experience)",
          "skills": ["Array of technical skills, programming languages, tools, frameworks, etc."],
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
        8. Return ONLY the JSON object, no additional text or formatting
        9. Do not wrap the response in markdown code blocks
        
        Return ONLY the JSON object:
      `;

      const result = await this.generateContent(prompt);
      const text = result.response.text();

      // Log the AI output for debugging
      console.log('--- OpenRouter AI Raw Output Start ---');
      console.log(text);
      console.log('--- OpenRouter AI Raw Output End ---');

      // Clean up the response to ensure it's valid JSON
      let cleanedText = text.trim();
      
      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      }
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }
      
      // Remove any leading/trailing non-JSON text
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
      }

      console.log('🧹 Cleaned JSON text preview:', cleanedText.substring(0, 200) + '...');

      let llmFields;
      try {
        llmFields = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError.message);
        console.error('🔍 Cleaned text that failed to parse:', cleanedText);
        throw new Error('Failed to parse AI response as JSON. Response may be malformed.');
      }

      // Merge LLM output with partialData
      const portfolioData = { ...partialData, ...llmFields };

      // Ensure required fields are present
      if (!portfolioData.name || portfolioData.name.trim() === '') {
        portfolioData.name = 'Professional Portfolio Owner';
      }

      console.log('✅ Portfolio data generated successfully');
      console.log('👤 Name:', portfolioData.name);
      console.log('📧 Email:', portfolioData.email);
      console.log('🔧 Skills count:', Array.isArray(portfolioData.skills) ? portfolioData.skills.length : 0);
      console.log('💼 Experience count:', Array.isArray(portfolioData.experience) ? portfolioData.experience.length : 0);

      return {
        success: true,
        data: portfolioData
      };

    } catch (error) {
      console.error('❌ OpenRouter AI Error:', error.message);
      
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
              technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
              url: ""
            },
            {
              title: "Task Management App",
              description: "Developed a collaborative task management application with real-time updates and team collaboration features.",
              technologies: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
              url: ""
            }
          ]
        }
      };
    }
  }

  // Method to test the connection
  async testConnection() {
    try {
      console.log('🧪 Testing OpenRouter connection...');
      
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: [
          {
            role: "user",
            content: "Hello, please respond with 'Connection successful' if you can read this."
          }
        ],
        max_tokens: 10
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Resume Portfolio Generator'
        },
        timeout: 10000
      });

      const content = response.data.choices[0]?.message?.content || '';
      console.log('✅ OpenRouter connection test successful');
      console.log('📝 Response:', content);
      
      return { success: true, message: content };
    } catch (error) {
      console.error('❌ OpenRouter connection test failed:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }
}

// Export instance as default
const openRouterAI = new OpenRouterAIService();
export default openRouterAI;