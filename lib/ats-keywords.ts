export const KeywordCategories = {
  Programming: [
    "Java", "Python", "C++", "JavaScript", "TypeScript", "SQL", "C#", "Ruby", "Go", "Rust", "PHP", "Swift", "Kotlin"
  ],
  Frontend: [
    "HTML", "CSS", "React", "Next.js", "Tailwind CSS", "Vue", "Angular", "Svelte", "Redux", "Webpack", "Vite"
  ],
  Backend: [
    "Node.js", "Express", "REST API", "GraphQL", "Spring Boot", "Django", "Flask", "FastAPI", "NestJS", "Microservices"
  ],
  Database: [
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "DynamoDB", "Cassandra", "Elasticsearch", "Firebase", "Supabase"
  ],
  AIML: [
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "NLP", "LLM", "Pandas", "NumPy"
  ],
  DevOps: [
    "Git", "GitHub", "Docker", "AWS", "Linux", "Kubernetes", "CI/CD", "Jenkins", "Terraform", "GCP", "Azure", "Nginx"
  ]
};

// Flatten keywords into a single array with lowercased values for easier matching
export const allKeywords = Object.values(KeywordCategories)
  .flat()
  .map(kw => kw.toLowerCase());
