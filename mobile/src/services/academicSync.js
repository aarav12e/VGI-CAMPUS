// =========================================================================
// ACADEMIC SYNC SERVICE (Syllabus & Timetable State Synchronizer)
// Vidya Knowledge Park (VGI Campus)
// =========================================================================

const syllabusListeners = new Set();
const timetableListeners = new Set();

// ─── INITIAL SYLLABUS DATA (Grouped by Course & Subject) ─────────────────────
let SYLLABUS_STORE = {
  'B.Tech': {
    'BCS501': {
      code: 'BCS501',
      name: 'Database Management Systems',
      credits: 4,
      totalHours: 48,
      completedHours: 36,
      units: [
        {
          id: 'u-dbms-1',
          unitNumber: 1,
          title: 'Introduction & Relational Data Model',
          hours: 10,
          status: 'Completed',
          topics: [
            'Database system architecture & three-schema architecture',
            'Data independence: physical and logical independence',
            'Entity-Relationship (ER) model and Extended ER features',
            'Relational model concepts and constraints',
            'ER-to-Relational schema mapping rules'
          ],
          references: 'Korth, Silberschatz & Sudarshan - Database System Concepts (7th Ed)'
        },
        {
          id: 'u-dbms-2',
          unitNumber: 2,
          title: 'Relational Algebra, Calculus & SQL-99',
          hours: 12,
          status: 'Completed',
          topics: [
            'Relational algebra operations: select, project, join, division',
            'Tuple relational calculus and domain relational calculus',
            'SQL DDL, DML, DCL, and complex nested queries',
            'Aggregation, grouping, HAVING clause, and window functions',
            'Triggers, assertions, and database views'
          ],
          references: 'Elmasri & Navathe - Fundamentals of Database Systems'
        },
        {
          id: 'u-dbms-3',
          unitNumber: 3,
          title: 'Relational Database Design & Normalization',
          hours: 10,
          status: 'Completed',
          topics: [
            'Pitfalls in relational database design & redundancy',
            'Functional dependencies and Armstrong axioms',
            'First, Second, and Third Normal Forms (1NF, 2NF, 3NF)',
            'Boyce-Codd Normal Form (BCNF) decomposition',
            'Lossless-join decomposition and dependency preservation'
          ],
          references: 'Ramakrishnan & Gehrke - Database Management Systems'
        },
        {
          id: 'u-dbms-4',
          unitNumber: 4,
          title: 'Transaction Processing & Concurrency Control',
          hours: 8,
          status: 'In Progress',
          topics: [
            'ACID properties and transaction states',
            'Schedules: serializability, conflict serializability, view serializability',
            'Two-Phase Locking (2PL) protocol: strict and rigorous 2PL',
            'Deadlock prevention, detection, and recovery algorithms',
            'Timestamp-based and optimistic concurrency control'
          ],
          references: 'Korth & Silberschatz - Database System Concepts'
        },
        {
          id: 'u-dbms-5',
          unitNumber: 5,
          title: 'Storage, Indexing & Query Optimization',
          hours: 8,
          status: 'Upcoming',
          topics: [
            'B-Tree and B+ Tree indexing structures',
            'Hashing techniques: static and dynamic extendible hashing',
            'Query processing steps and cost estimation',
            'Heuristic optimization of query execution plans',
            'Crash recovery: Write-Ahead Logging (WAL) and ARIES'
          ],
          references: 'Garcia-Molina, Ullman & Widom - Database Systems: The Complete Book'
        }
      ]
    },
    'BCS502': {
      code: 'BCS502',
      name: 'Operating Systems',
      credits: 3,
      totalHours: 42,
      completedHours: 32,
      units: [
        {
          id: 'u-os-1',
          unitNumber: 1,
          title: 'OS Structures & Process Management',
          hours: 9,
          status: 'Completed',
          topics: [
            'System calls, dual-mode operation, kernel architecture',
            'Process Control Block (PCB), process scheduling queues',
            'CPU Scheduling algorithms: FCFS, SJF, Round Robin, Multilevel Queue',
            'Inter-process communication (IPC) via pipes and shared memory'
          ],
          references: 'Silberschatz, Galvin & Gagne - Operating System Concepts'
        },
        {
          id: 'u-os-2',
          unitNumber: 2,
          title: 'Synchronization & Deadlocks',
          hours: 9,
          status: 'Completed',
          topics: [
            'Critical section problem, Peterson algorithm, hardware test-and-set',
            'Semaphores, mutex locks, classic problems (Dining Philosophers)',
            'Deadlock characterization, Banker algorithm for deadlock avoidance'
          ],
          references: 'Andrew S. Tanenbaum - Modern Operating Systems'
        },
        {
          id: 'u-os-3',
          unitNumber: 3,
          title: 'Memory Management & Virtual Memory',
          hours: 12,
          status: 'In Progress',
          topics: [
            'Paging, segmentation, TLB hardware caching',
            'Demand paging, page fault handling, page replacement (FIFO, LRU, Optimal)',
            'Thrashing and working set model'
          ],
          references: 'William Stallings - Operating Systems: Internals and Design Principles'
        },
        {
          id: 'u-os-4',
          unitNumber: 4,
          title: 'File Systems & I/O Systems',
          hours: 12,
          status: 'Upcoming',
          topics: [
            'Directory structures, file allocation methods: contiguous, linked, indexed',
            'Disk scheduling algorithms (SSTF, SCAN, C-SCAN), RAID levels'
          ],
          references: 'Silberschatz - Operating System Concepts'
        }
      ]
    },
    'BCS504': {
      code: 'BCS504',
      name: 'Machine Learning',
      credits: 4,
      totalHours: 48,
      completedHours: 38,
      units: [
        {
          id: 'u-ml-1',
          unitNumber: 1,
          title: 'Supervised Learning & Regression',
          hours: 10,
          status: 'Completed',
          topics: [
            'Linear regression, Cost function, Gradient Descent optimization',
            'Polynomial regression, Overfitting and Regularization (L1/L2)',
            'Logistic regression for binary and multiclass classification'
          ],
          references: 'Tom Mitchell - Machine Learning'
        },
        {
          id: 'u-ml-2',
          unitNumber: 2,
          title: 'Classification & Tree-based Models',
          hours: 12,
          status: 'Completed',
          topics: [
            'Decision Trees, Entropy, Information Gain, Gini Impurity',
            'Ensemble methods: Random Forests, Bagging, and Boosting (AdaBoost, XGBoost)',
            'Support Vector Machines (SVM) with linear and RBF kernels'
          ],
          references: 'Aurélien Géron - Hands-On Machine Learning with Scikit-Learn'
        },
        {
          id: 'u-ml-3',
          unitNumber: 3,
          title: 'Unsupervised Learning & Clustering',
          hours: 12,
          status: 'In Progress',
          topics: [
            'K-Means clustering and Elbow method',
            'Hierarchical clustering and DBSCAN density-based clustering',
            'Principal Component Analysis (PCA) for dimensionality reduction'
          ],
          references: 'Christopher Bishop - Pattern Recognition and Machine Learning'
        },
        {
          id: 'u-ml-4',
          unitNumber: 4,
          title: 'Neural Networks & Deep Learning Foundations',
          hours: 14,
          status: 'Upcoming',
          topics: [
            'Artificial Neurons, Perceptron, Multilayer Perceptron (MLP)',
            'Backpropagation algorithm and activation functions (ReLU, Sigmoid)',
            'Introduction to CNNs for image classification'
          ],
          references: 'Ian Goodfellow, Yoshua Bengio - Deep Learning'
        }
      ]
    },
    'BCS503': {
      code: 'BCS503',
      name: 'Design & Analysis of Algorithms',
      credits: 4,
      totalHours: 45,
      completedHours: 25,
      units: [
        {
          id: 'u-daa-1',
          unitNumber: 1,
          title: 'Asymptotic Analysis & Divide-and-Conquer',
          hours: 10,
          status: 'Completed',
          topics: [
            'Big-O, Omega, Theta notations and Master Theorem',
            'Merge Sort, Quick Sort analysis, and Strassen matrix multiplication'
          ],
          references: 'Cormen, Leiserson, Rivest & Stein - Introduction to Algorithms (CLRS)'
        },
        {
          id: 'u-daa-2',
          unitNumber: 2,
          title: 'Greedy Algorithms & Dynamic Programming',
          hours: 12,
          status: 'In Progress',
          topics: [
            'Huffman coding, Fractional Knapsack, Prim & Kruskal MST',
            '0/1 Knapsack, Longest Common Subsequence (LCS), Matrix Chain Multiplication'
          ],
          references: 'CLRS - Introduction to Algorithms'
        },
        {
          id: 'u-daa-3',
          unitNumber: 3,
          title: 'Graph Algorithms & NP-Completeness',
          hours: 13,
          status: 'Upcoming',
          topics: [
            'Dijkstra, Bellman-Ford, Floyd-Warshall all-pairs shortest paths',
            'P, NP, NP-Complete, and NP-Hard reductions (3-SAT, Clique)'
          ],
          references: 'Kleinberg & Tardos - Algorithm Design'
        }
      ]
    }
  },
  'BCA': {
    'BCA301': {
      code: 'BCA301',
      name: 'Object Oriented Programming with Java',
      credits: 4,
      totalHours: 44,
      completedHours: 30,
      units: [
        {
          id: 'u-java-1',
          unitNumber: 1,
          title: 'Java Fundamentals & OOP Principles',
          hours: 10,
          status: 'Completed',
          topics: [
            'JVM architecture, Bytecode, Class & Object fundamentals',
            'Constructors, Garbage Collection, method overloading and overriding',
            'Inheritance, Polymorphism, and abstract classes'
          ],
          references: 'Herbert Schildt - Java: The Complete Reference'
        },
        {
          id: 'u-java-2',
          unitNumber: 2,
          title: 'Interfaces, Packages & Exception Handling',
          hours: 12,
          status: 'In Progress',
          topics: [
            'Interfaces and Multiple Inheritance via default methods',
            'Packages, access specifiers, try-catch-finally, custom exceptions'
          ],
          references: 'E. Balagurusamy - Programming with Java'
        },
        {
          id: 'u-java-3',
          unitNumber: 3,
          title: 'Java Collections & Streams',
          hours: 12,
          status: 'Upcoming',
          topics: [
            'ArrayList, LinkedList, HashMap, HashSet, Generics',
            'Lambda expressions, Functional Interfaces, and Stream API'
          ],
          references: 'Joshua Bloch - Effective Java'
        }
      ]
    },
    'BCA302': {
      code: 'BCA302',
      name: 'Web Technology & Node.js',
      credits: 4,
      totalHours: 42,
      completedHours: 28,
      units: [
        {
          id: 'u-web-1',
          unitNumber: 1,
          title: 'HTML5, CSS3 & Responsive Design',
          hours: 10,
          status: 'Completed',
          topics: ['Semantic HTML5, Flexbox, CSS Grid, media queries, mobile-first design'],
          references: 'Jon Duckett - HTML and CSS'
        },
        {
          id: 'u-web-2',
          unitNumber: 2,
          title: 'JavaScript ES6+ & DOM Manipulation',
          hours: 12,
          status: 'In Progress',
          topics: ['Promises, Async/Await, Fetch API, Event loop, DOM event delegation'],
          references: 'Kyle Simpson - You Don’t Know JS'
        },
        {
          id: 'u-web-3',
          unitNumber: 3,
          title: 'Node.js & Express REST APIs',
          hours: 12,
          status: 'Upcoming',
          topics: ['Node.js Event-driven architecture, Express middleware, RESTful API architecture'],
          references: 'Azat Mardan - Express.js Guide'
        }
      ]
    }
  },
  'BBA': {
    'BBA201': {
      code: 'BBA201',
      name: 'Marketing Management',
      credits: 4,
      totalHours: 40,
      completedHours: 26,
      units: [
        {
          id: 'u-mkt-1',
          unitNumber: 1,
          title: 'Marketing Concepts & Consumer Behavior',
          hours: 10,
          status: 'Completed',
          topics: ['4Ps of Marketing, STP (Segmentation, Targeting, Positioning), Consumer buying decision process'],
          references: 'Philip Kotler - Marketing Management'
        },
        {
          id: 'u-mkt-2',
          unitNumber: 2,
          title: 'Product & Pricing Strategies',
          hours: 10,
          status: 'In Progress',
          topics: ['Product Life Cycle (PLC), New product development, Penetration and skimming pricing'],
          references: 'Ramaswamy & Namakumari - Marketing Management'
        }
      ]
    }
  }
};

// ─── INITIAL TIMETABLE DATA (Grouped by Section) ──────────────────────────────
let TIMETABLE_STORE = [
  {
    id: 'tt-1',
    day: 'Friday',
    time: '09:00 AM - 10:00 AM',
    departmentCode: 'CSE',
    course: 'B.Tech',
    section: 'Section A',
    subject: 'Database Management Systems',
    code: 'BCS501',
    faculty: 'Dr. Rajesh Sharma (HOD)',
    facultyId: 'EMP001',
    isHodTeaching: true,
    room: 'Room 302',
    dateScheduled: 'Scheduled a day before (Active)'
  },
  {
    id: 'tt-2',
    day: 'Friday',
    time: '10:00 AM - 11:00 AM',
    departmentCode: 'CSE',
    course: 'B.Tech',
    section: 'Section A',
    subject: 'Operating Systems',
    code: 'BCS502',
    faculty: 'Prof. Amit Kumar',
    facultyId: 'EMP003',
    isHodTeaching: false,
    room: 'Room 302',
    dateScheduled: 'Scheduled a day before (Active)'
  },
  {
    id: 'tt-3',
    day: 'Friday',
    time: '11:15 AM - 12:15 PM',
    departmentCode: 'CSE',
    course: 'B.Tech',
    section: 'Section A',
    subject: 'Machine Learning',
    code: 'BCS504',
    faculty: 'Prof. Priya Verma',
    facultyId: 'EMP002',
    isHodTeaching: false,
    room: 'Lab 3 (GPU Supercomputing)',
    dateScheduled: 'Scheduled a day before (Active)'
  },
  {
    id: 'tt-4',
    day: 'Friday',
    time: '01:00 PM - 02:00 PM',
    departmentCode: 'CSE',
    course: 'B.Tech',
    section: 'Section A',
    subject: 'Algorithms Lab',
    code: 'BCS503P',
    faculty: 'Prof. Priya Verma',
    facultyId: 'EMP002',
    isHodTeaching: false,
    room: 'Computing Lab 2',
    dateScheduled: 'Scheduled a day before (Active)'
  },
  {
    id: 'tt-5',
    day: 'Thursday',
    time: '09:00 AM - 10:00 AM',
    departmentCode: 'CSE',
    course: 'B.Tech',
    section: 'Section A',
    subject: 'Design & Analysis of Algorithms',
    code: 'BCS503',
    faculty: 'Prof. Priya Verma',
    facultyId: 'EMP002',
    isHodTeaching: false,
    room: 'Room 302',
    dateScheduled: 'Regular Daily Schedule'
  },
  {
    id: 'tt-6',
    day: 'Thursday',
    time: '10:00 AM - 11:00 AM',
    departmentCode: 'CSE',
    course: 'B.Tech',
    section: 'Section A',
    subject: 'Database Management Systems',
    code: 'BCS501',
    faculty: 'Dr. Rajesh Sharma (HOD)',
    facultyId: 'EMP001',
    isHodTeaching: true,
    room: 'Room 302',
    dateScheduled: 'Regular Daily Schedule'
  },
  {
    id: 'tt-7',
    day: 'Friday',
    time: '09:00 AM - 10:00 AM',
    departmentCode: 'CA',
    course: 'BCA',
    section: 'Section A',
    subject: 'OOP with Java',
    code: 'BCA301',
    faculty: 'Prof. Priya Verma',
    facultyId: 'EMP002',
    isHodTeaching: false,
    room: 'Room 105',
    dateScheduled: 'Scheduled a day before (Active)'
  },
  {
    id: 'tt-8',
    day: 'Friday',
    time: '10:00 AM - 11:00 AM',
    departmentCode: 'CA',
    course: 'BCA',
    section: 'Section A',
    subject: 'Web Technology & Node.js',
    code: 'BCA302',
    faculty: 'Dr. Sunita Rao (HOD)',
    facultyId: 'EMP-CA-001',
    isHodTeaching: true,
    room: 'Lab 1',
    dateScheduled: 'Scheduled a day before (Active)'
  }
];

// ─── SYLLABUS METHODS ────────────────────────────────────────────────────────
export function getCourseSubjects(course = 'B.Tech') {
  const courseStore = SYLLABUS_STORE[course] || SYLLABUS_STORE['B.Tech'];
  return Object.values(courseStore);
}

export function getSubjectSyllabus(course = 'B.Tech', subjectCode = 'BCS501') {
  const courseStore = SYLLABUS_STORE[course] || SYLLABUS_STORE['B.Tech'];
  return courseStore[subjectCode] || Object.values(courseStore)[0];
}

export function addSyllabusUnit(course = 'B.Tech', subjectCode = 'BCS501', newUnit) {
  if (!SYLLABUS_STORE[course]) {
    SYLLABUS_STORE[course] = {};
  }
  if (!SYLLABUS_STORE[course][subjectCode]) {
    SYLLABUS_STORE[course][subjectCode] = {
      code: subjectCode,
      name: newUnit.subjectName || 'Course Subject',
      credits: 4,
      totalHours: 40,
      completedHours: 0,
      units: []
    };
  }

  const subject = SYLLABUS_STORE[course][subjectCode];
  const unitObj = {
    id: 'u-' + Date.now(),
    unitNumber: newUnit.unitNumber || subject.units.length + 1,
    title: newUnit.title,
    hours: Number(newUnit.hours) || 8,
    status: newUnit.status || 'Upcoming',
    topics: Array.isArray(newUnit.topics)
      ? newUnit.topics
      : String(newUnit.topics).split(',').map(t => t.trim()).filter(Boolean),
    references: newUnit.references || 'Standard Department Textbooks'
  };

  subject.units.push(unitObj);
  subject.totalHours += unitObj.hours;

  notifySyllabus();
  return unitObj;
}

export function deleteSyllabusUnit(course = 'B.Tech', subjectCode = 'BCS501', unitId) {
  if (SYLLABUS_STORE[course] && SYLLABUS_STORE[course][subjectCode]) {
    const subject = SYLLABUS_STORE[course][subjectCode];
    subject.units = subject.units.filter(u => u.id !== unitId);
    notifySyllabus();
  }
}

export function subscribeToSyllabus(callback) {
  syllabusListeners.add(callback);
  return () => syllabusListeners.delete(callback);
}

function notifySyllabus() {
  for (const listener of syllabusListeners) {
    listener();
  }
}

// ─── TIMETABLE METHODS ───────────────────────────────────────────────────────
export function getTimetableForSection(section = 'Section A', day = 'Friday') {
  return TIMETABLE_STORE.filter(
    slot =>
      slot.section.toLowerCase().includes(section.toLowerCase()) &&
      (!day || day === 'All' || slot.day.toLowerCase() === day.toLowerCase())
  );
}

export function getTimetableForTeacher(teacherName = '', day = 'Friday') {
  return TIMETABLE_STORE.filter(slot => {
    const matchesTeacher = !teacherName ||
      slot.faculty.toLowerCase().includes(teacherName.toLowerCase()) ||
      (slot.isHodTeaching && teacherName.toLowerCase().includes('hod'));
    const matchesDay = !day || day === 'All' || slot.day.toLowerCase() === day.toLowerCase();
    return matchesTeacher && matchesDay;
  });
}

export function getAllTimetableSlots() {
  return [...TIMETABLE_STORE];
}

export function scheduleClassSlot(slotData) {
  const newSlot = {
    id: 'tt-' + Date.now(),
    day: slotData.day || 'Friday',
    time: slotData.time || '09:00 AM - 10:00 AM',
    departmentCode: slotData.departmentCode || 'CSE',
    course: slotData.course || 'B.Tech',
    section: slotData.section || 'Section A',
    subject: slotData.subject || 'Advanced Computing',
    code: slotData.code || 'BCS' + Math.floor(500 + Math.random() * 50),
    faculty: slotData.faculty || 'Dr. Rajesh Sharma (HOD)',
    facultyId: slotData.facultyId || 'EMP001',
    isHodTeaching: Boolean(slotData.isHodTeaching),
    room: slotData.room || 'Room 302',
    dateScheduled: `Scheduled ${slotData.scheduledNotice || 'a day before'} by HOD`
  };

  TIMETABLE_STORE = [newSlot, ...TIMETABLE_STORE];
  notifyTimetable();
  return newSlot;
}

export function deleteTimetableSlot(slotId) {
  TIMETABLE_STORE = TIMETABLE_STORE.filter(s => s.id !== slotId);
  notifyTimetable();
}

export function subscribeToTimetable(callback) {
  timetableListeners.add(callback);
  return () => timetableListeners.delete(callback);
}

function notifyTimetable() {
  for (const listener of timetableListeners) {
    listener();
  }
}
