// In-memory mock database with realistic seed data for Amrita Students
const bcrypt = require('bcryptjs');

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Seed passwords
const salt = bcrypt.genSaltSync(10);
const hashedPwd = bcrypt.hashSync('Password@123', salt);

const users = [
  {
    _id: 'u1',
    name: 'Kanparthi Dharani Kumar',
    email: 'dharani@cb.amrita.edu',
    password: hashedPwd,
    role: 'student',
    department: 'CSE',
    batchYear: 2027,
    createdAt: new Date()
  },
  {
    _id: 'u2',
    name: 'Sikha Sen',
    email: 'sikha@cb.amrita.edu',
    password: hashedPwd,
    role: 'admin',
    department: 'CSE',
    batchYear: 2024,
    createdAt: new Date()
  },
  {
    _id: 'u3',
    name: 'Abhiram K',
    email: 'abhiram@cb.amrita.edu',
    password: hashedPwd,
    role: 'senior',
    department: 'ECE',
    batchYear: 2026,
    createdAt: new Date()
  },
  {
    _id: 'u4',
    name: 'Meera Nair',
    email: 'meera@cb.amrita.edu',
    password: hashedPwd,
    role: 'alumni',
    department: 'AIE',
    batchYear: 2025,
    createdAt: new Date()
  }
];

const resources = [
  {
    _id: 'r1',
    title: 'Data Structures and Algorithms - Lecture Notes',
    category: 'notes',
    courseCode: '19CSE201',
    description: 'Comprehensive hand-written notes covering Trees, Graphs, Sorting, and Dynamic Programming. Helpful for semester exams and coding interviews.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'u3', // Abhiram
    status: 'approved',
    ratings: [{ user: 'u1', score: 5 }, { user: 'u4', score: 4 }],
    bookmarks: ['u1'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'r2',
    title: 'Database Management Systems Endsem Question Paper (2025)',
    category: 'exam_paper',
    courseCode: '19CSE301',
    description: 'Actual end-semester question paper from the Spring 2025 session. Contains SQL query and normalization problems.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'u4', // Meera
    status: 'approved',
    ratings: [{ user: 'u1', score: 4 }],
    bookmarks: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'r3',
    title: 'Operating Systems - Threading Assignment Solutions',
    category: 'assignment',
    courseCode: '19CSE212',
    description: 'Solutions for the multi-threading assignment using POSIX threads in C. Includes code snippets and sync solutions.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'u3',
    status: 'approved',
    ratings: [],
    bookmarks: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

const experiences = [
  {
    _id: 'e1',
    author: 'u4', // Meera
    type: 'placement',
    company: 'Orion Innovation',
    role: 'Associate Software Engineer',
    packageOrStipend: '6.5 LPA',
    rounds: [
      { roundName: 'Aptitude & Technical MCQ', description: 'Conducted on Moodle platform. Had 30 quant questions and 20 OOPs/C++ output questions.', tips: 'Focus on time management; do not spend more than 1 minute per MCQ.' },
      { roundName: 'Coding Round', description: '2 programming questions on HackerRank. One was basic array manipulation, and the other was a Dynamic Programming problem (similar to Coin Change).', tips: 'Practice LeetCode Easy and Medium problems, especially Array and DP basics.' },
      { roundName: 'Technical Interview', description: 'Deep dive into my Capstone project, normalization, SQL joins, and quick code writing on string reversal without extra space.', tips: 'Know every line of your project and be confident with basic SQL queries.' },
      { roundName: 'HR Round', description: 'Standard behavioral questions: why Orion, career goals, willing to relocate.', tips: 'Be polite, research the company ahead of time, and display a willing-to-learn attitude.' }
    ],
    preparationTips: 'Study DBMS SQL joins, OOPs concepts (polymorphism, inheritance), and solve past question banks on GeeksforGeeks.',
    difficulty: 'medium',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'e2',
    author: 'u3', // Abhiram
    type: 'internship',
    company: 'Amazon',
    role: 'SDE Intern',
    packageOrStipend: '80,000 / month',
    rounds: [
      { roundName: 'Online Assessment (OA)', description: '2 coding problems (BFS on grid, and hashmap optimization) and a workstyles assessment.', tips: 'Solve Amazon-tagged questions on LeetCode.' },
      { roundName: 'Technical Interview 1', description: 'Questions on Graphs (detect cycle in directed graph) and LRU Cache design. Asked to code with correct syntax on a shared editor.', tips: 'Explain your thought process out loud before writing any code.' },
      { roundName: 'Technical Interview 2', description: 'System design basics (TinyURL) and deep questions on data structures, followed by Amazon Leadership Principles questions.', tips: 'Prepare examples from your college projects that show ownership and customer obsession.' }
    ],
    preparationTips: 'Master trees, graphs, heaps, and dynamic programming. For leadership principles, use the STAR method to describe project contributions.',
    difficulty: 'hard',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  }
];

const projects = [
  {
    _id: 'p1',
    title: 'Smart Attendance System using Facial Recognition',
    description: 'An AI-powered attendance tracking system built for Amrita classrooms. Uses OpenCV, Haar Cascades, and a Flask backend to detect faces and mark attendance on an AUMS-like dashboard.',
    githubLink: 'https://github.com/dharani/smart-attendance',
    demoLink: 'https://smart-attendance.demo.amrita.edu',
    teamMembers: ['Kanparthi Dharani', 'Abhiram K', 'Gautham S'],
    uploadedBy: 'u1',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'p2',
    title: 'Amrita Peer Mentorship Portal',
    description: 'A platform connecting first-year students with senior mentors for academic assistance and extracurricular guidance. Built with React and Node.js.',
    githubLink: 'https://github.com/abhiram/peer-mentorship',
    demoLink: '',
    teamMembers: ['Abhiram K', 'Meera Nair'],
    uploadedBy: 'u3',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
  }
];
const comments = [
  {
    _id: 'c1',
    targetId: 'r1', // DSA Notes
    author: 'u1', // Dharani
    text: 'This is exceptionally well-written! The graph algorithms section helped me clear my DSA midterm easily.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  }
];

const guidance = [
  {
    _id: 'g1',
    title: 'First-Year Survival Guide for CSE Students',
    content: 'Welcome to Amrita! Here are the core survival rules:\n\n1. **Attendance**: Amrita is strict with 75% attendance. Make sure you don\'t fall below it, or AUMS will block your registration.\n2. **Programming Foundation**: Focus heavily on C/C++ in your first year. It forms the foundation for DSA.\n3. **Join Technical Clubs**: Try to clear recruitments for FACE (Computer Science club), bios (Cybersecurity), or amFOSS. They will accelerate your learning.',
    category: 'first_year',
    author: 'u3', // Abhiram
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'g2',
    title: 'Clubs Recruitment & Technical Auditions Prep',
    content: 'Auditions for FACE and other clubs usually take place in Semester 2. They will ask questions on basic coding, problem solving, and check your interest. Don\'t worry if you don\'t know advanced topics; focus on showing curiosity and basic logic.',
    category: 'general_advice',
    author: 'u4', // Meera
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  }
];

// Chainable query simulation class for Mongoose-like population
class MockQuery {
  constructor(promise) {
    this.promise = promise;
    this.populateFields = [];
  }

  populate(field) {
    if (field) {
      this.populateFields.push(field);
    }
    return this;
  }

  async exec() {
    let result = await this.promise;
    if (!result) return null;

    // Deep clone to prevent mutating the original mock store
    let clonedResult = JSON.parse(JSON.stringify(result));

    for (let field of this.populateFields) {
      const refField = field.split(' ')[0];

      const doPopulate = (item) => {
        if (!item || !item[refField]) return;
        const idVal = typeof item[refField] === 'object' ? item[refField]._id : item[refField];
        
        let refCollection;
        if (refField === 'uploadedBy' || refField === 'author' || refField === 'sender' || refField === 'receiver') {
          refCollection = users;
        }

        if (refCollection) {
          const foundRef = refCollection.find(u => u._id === idVal);
          if (foundRef) {
            const { password, ...userWithoutPassword } = foundRef;
            item[refField] = userWithoutPassword;
          }
        }
      };

      if (Array.isArray(clonedResult)) {
        clonedResult.forEach(doPopulate);
      } else {
        doPopulate(clonedResult);
      }
    }

    return clonedResult;
  }

  then(onfulfilled, onrejected) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

// Helper wrapper to simulate DB queries
class MockCollection {
  constructor(data) {
    this.data = data;
  }

  find(query = {}) {
    const promise = Promise.resolve().then(() => {
      return this.data.filter(item => {
        for (let key in query) {
          if (query[key] !== undefined && item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    });
    return new MockQuery(promise);
  }

  findOne(query = {}) {
    const promise = Promise.resolve().then(() => {
      return this.data.find(item => {
        for (let key in query) {
          if (query[key] !== undefined && item[key] !== query[key]) {
            return false;
          }
        }
        return true;
      }) || null;
    });
    return new MockQuery(promise);
  }

  findById(id) {
    const promise = Promise.resolve().then(() => {
      return this.data.find(item => item._id === id) || null;
    });
    return new MockQuery(promise);
  }

  create(newItem) {
    const created = {
      _id: generateId(),
      createdAt: new Date(),
      ...newItem
    };
    this.data.push(created);
    return Promise.resolve(created);
  }

  findByIdAndUpdate(id, updates) {
    const promise = Promise.resolve().then(() => {
      const index = this.data.findIndex(item => item._id === id);
      if (index === -1) return null;
      this.data[index] = { ...this.data[index], ...updates };
      return this.data[index];
    });
    return new MockQuery(promise);
  }

  findByIdAndDelete(id) {
    const promise = Promise.resolve().then(() => {
      const index = this.data.findIndex(item => item._id === id);
      if (index === -1) return null;
      const deleted = this.data.splice(index, 1);
      return deleted[0];
    });
    return new MockQuery(promise);
  }
}

module.exports = {
  Users: new MockCollection(users),
  Resources: new MockCollection(resources),
  Experiences: new MockCollection(experiences),
  Projects: new MockCollection(projects),
  Comments: new MockCollection(comments),
  Guidance: new MockCollection(guidance)
};
