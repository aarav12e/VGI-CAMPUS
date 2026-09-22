import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting VGI CAMPUS Database Seeding...');

  // Clean old records
  await prisma.auditLog.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.studyMaterial.deleteMany();
  await prisma.syllabusUnit.deleteMany();
  await prisma.timetableEntry.deleteMany();
  await prisma.teachingAssignment.deleteMany();
  await prisma.resultItem.deleteMany();
  await prisma.result.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.hostelComplaint.deleteMany();
  await prisma.hostelRoom.deleteMany();
  await prisma.messMenu.deleteMany();
  await prisma.libraryTransaction.deleteMany();
  await prisma.libraryBook.deleteMany();
  await prisma.studentFee.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.section.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.program.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  const commonPassword = await bcrypt.hash('Password@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  // 1. Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@vgi.ac.in',
      passwordHash: adminPassword,
      role: 'ADMIN',
      fullName: 'VGI Administrator',
      phone: '+91 98765 43210'
    }
  });

  // 2. Departments
  const deptCSE = await prisma.department.create({
    data: {
      code: 'CSE',
      name: 'Department of Computer Science & Engineering',
      description: 'Hub for computing, artificial intelligence, and software engineering'
    }
  });

  const deptECE = await prisma.department.create({
    data: {
      code: 'ECE',
      name: 'Department of Electronics & Communication',
      description: 'Hardware, IoT, and telecommunications'
    }
  });

  // 3. Programs
  const progDataScience = await prisma.program.create({
    data: {
      code: 'BTECH-DS',
      name: 'B.Tech Data Science',
      durationYears: 4,
      departmentId: deptCSE.id
    }
  });

  const progCSE = await prisma.program.create({
    data: {
      code: 'BTECH-CSE',
      name: 'B.Tech Computer Science & Engineering',
      durationYears: 4,
      departmentId: deptCSE.id
    }
  });

  // 4. Academic Year
  const academicYear = await prisma.academicYear.create({
    data: {
      name: '2026-2027',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2027-06-30'),
      isCurrent: true
    }
  });

  // 5. Batches
  const batch2024 = await prisma.batch.create({
    data: {
      name: '2024-2028',
      programId: progDataScience.id,
      startYear: 2024,
      endYear: 2028
    }
  });

  // 6. Semesters
  const semester5 = await prisma.semester.create({
    data: {
      number: 5,
      batchId: batch2024.id,
      academicYearId: academicYear.id,
      isCurrent: true
    }
  });

  // 7. Sections
  const sectionA = await prisma.section.create({
    data: {
      name: 'Section A',
      semesterId: semester5.id,
      capacity: 60
    }
  });

  const sectionB = await prisma.section.create({
    data: {
      name: 'Section B',
      semesterId: semester5.id,
      capacity: 60
    }
  });

  // 8. Subjects
  const subDBMS = await prisma.subject.create({
    data: {
      code: 'BCS501',
      name: 'Database Management Systems',
      credits: 4,
      type: 'THEORY',
      programId: progDataScience.id,
      semesterNumber: 5
    }
  });

  const subDAA = await prisma.subject.create({
    data: {
      code: 'BCS502',
      name: 'Design and Analysis of Algorithms',
      credits: 4,
      type: 'THEORY',
      programId: progDataScience.id,
      semesterNumber: 5
    }
  });

  const subOS = await prisma.subject.create({
    data: {
      code: 'BCS503',
      name: 'Operating Systems',
      credits: 4,
      type: 'THEORY',
      programId: progDataScience.id,
      semesterNumber: 5
    }
  });

  const subML = await prisma.subject.create({
    data: {
      code: 'BCS504',
      name: 'Machine Learning Foundations',
      credits: 3,
      type: 'THEORY',
      programId: progDataScience.id,
      semesterNumber: 5
    }
  });

  // 9. Teachers
  const userTeacher1 = await prisma.user.create({
    data: {
      email: 'rajesh.sharma@vgi.ac.in',
      passwordHash: commonPassword,
      role: 'TEACHER',
      fullName: 'Dr. Rajesh Sharma',
      phone: '+91 98111 22334'
    }
  });
  const teacher1 = await prisma.teacher.create({
    data: {
      userId: userTeacher1.id,
      employeeId: 'EMP001',
      departmentId: deptCSE.id,
      designation: 'Professor & HOD',
      qualification: 'Ph.D. in Computer Science (IIT Roorkee)'
    }
  });

  const userTeacher2 = await prisma.user.create({
    data: {
      email: 'priya.verma@vgi.ac.in',
      passwordHash: commonPassword,
      role: 'TEACHER',
      fullName: 'Prof. Priya Verma',
      phone: '+91 98222 33445'
    }
  });
  const teacher2 = await prisma.teacher.create({
    data: {
      userId: userTeacher2.id,
      employeeId: 'EMP002',
      departmentId: deptCSE.id,
      designation: 'Assistant Professor',
      qualification: 'M.Tech in Data Analytics'
    }
  });

  const userTeacher3 = await prisma.user.create({
    data: {
      email: 'amit.kumar@vgi.ac.in',
      passwordHash: commonPassword,
      role: 'TEACHER',
      fullName: 'Dr. Amit Kumar',
      phone: '+91 98333 44556'
    }
  });
  const teacher3 = await prisma.teacher.create({
    data: {
      userId: userTeacher3.id,
      employeeId: 'EMP003',
      departmentId: deptCSE.id,
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Distributed Computing'
    }
  });

  // 10. Teaching Assignments
  await prisma.teachingAssignment.createMany({
    data: [
      { teacherId: teacher1.id, subjectId: subDBMS.id, sectionId: sectionA.id },
      { teacherId: teacher2.id, subjectId: subDAA.id, sectionId: sectionA.id },
      { teacherId: teacher3.id, subjectId: subOS.id, sectionId: sectionA.id },
      { teacherId: teacher2.id, subjectId: subML.id, sectionId: sectionA.id }
    ]
  });

  // 11. Students
  // Primary Student: Aarav Patel (matches PRD spec)
  const userAarav = await prisma.user.create({
    data: {
      email: 'aarav.patel@vgi.ac.in',
      passwordHash: commonPassword,
      role: 'STUDENT',
      fullName: 'Aarav Patel',
      phone: '+91 98989 12345'
    }
  });
  const studentAarav = await prisma.student.create({
    data: {
      userId: userAarav.id,
      enrollmentNumber: 'ENR2024001',
      rollNumber: '24DS001',
      departmentId: deptCSE.id,
      programId: progDataScience.id,
      batchId: batch2024.id,
      semesterId: semester5.id,
      sectionId: sectionA.id,
      cgpa: 8.65,
      hostelRoom: 'Aryabhata - Room 204 (Bed 1)',
      guardianName: 'Suresh Patel',
      guardianPhone: '+91 98760 11223'
    }
  });

  const userSneha = await prisma.user.create({
    data: {
      email: 'sneha.gupta@vgi.ac.in',
      passwordHash: commonPassword,
      role: 'STUDENT',
      fullName: 'Sneha Gupta',
      phone: '+91 98789 23456'
    }
  });
  const studentSneha = await prisma.student.create({
    data: {
      userId: userSneha.id,
      enrollmentNumber: 'ENR2024002',
      rollNumber: '24DS002',
      departmentId: deptCSE.id,
      programId: progDataScience.id,
      batchId: batch2024.id,
      semesterId: semester5.id,
      sectionId: sectionA.id,
      cgpa: 9.12,
      hostelRoom: 'Kalpana Chawla - Room 102',
      guardianName: 'Manoj Gupta',
      guardianPhone: '+91 98760 44556'
    }
  });

  const userRohan = await prisma.user.create({
    data: {
      email: 'rohan.singh@vgi.ac.in',
      passwordHash: commonPassword,
      role: 'STUDENT',
      fullName: 'Rohan Singh',
      phone: '+91 98678 34567'
    }
  });
  const studentRohan = await prisma.student.create({
    data: {
      userId: userRohan.id,
      enrollmentNumber: 'ENR2024003',
      rollNumber: '24DS003',
      departmentId: deptCSE.id,
      programId: progDataScience.id,
      batchId: batch2024.id,
      semesterId: semester5.id,
      sectionId: sectionA.id,
      cgpa: 7.42,
      hostelRoom: 'Aryabhata - Room 204 (Bed 2)'
    }
  });

  // 12. Timetable Entries for Section A
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  for (const day of days) {
    await prisma.timetableEntry.createMany({
      data: [
        {
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '10:00',
          subjectId: subDBMS.id,
          teacherId: teacher1.id,
          sectionId: sectionA.id,
          roomName: 'Lecture Hall LT-101'
        },
        {
          dayOfWeek: day,
          startTime: '10:00',
          endTime: '11:00',
          subjectId: subDAA.id,
          teacherId: teacher2.id,
          sectionId: sectionA.id,
          roomName: 'Computing Lab 3'
        },
        {
          dayOfWeek: day,
          startTime: '11:15',
          endTime: '12:15',
          subjectId: subOS.id,
          teacherId: teacher3.id,
          sectionId: sectionA.id,
          roomName: 'Lecture Hall LT-102'
        },
        {
          dayOfWeek: day,
          startTime: '14:00',
          endTime: '15:30',
          subjectId: subML.id,
          teacherId: teacher2.id,
          sectionId: sectionA.id,
          roomName: 'AI & Data Science Lab'
        }
      ]
    });
  }

  // 13. Attendance Sessions & Records (giving Aarav realistic 84% attendance)
  const sessionDates = [
    '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'
  ];

  for (const date of sessionDates) {
    // DBMS Session
    const s1 = await prisma.attendanceSession.create({
      data: {
        date,
        subjectId: subDBMS.id,
        teacherId: teacher1.id,
        sectionId: sectionA.id,
        topic: 'Relational Model & Normalization',
        records: {
          create: [
            { studentId: studentAarav.id, isPresent: true },
            { studentId: studentSneha.id, isPresent: true },
            { studentId: studentRohan.id, isPresent: false, remarks: 'Absent without leave' }
          ]
        }
      }
    });

    // DAA Session
    const s2 = await prisma.attendanceSession.create({
      data: {
        date,
        subjectId: subDAA.id,
        teacherId: teacher2.id,
        sectionId: sectionA.id,
        topic: 'Divide and Conquer Algorithms',
        records: {
          create: [
            { studentId: studentAarav.id, isPresent: date !== '2026-09-18' },
            { studentId: studentSneha.id, isPresent: true },
            { studentId: studentRohan.id, isPresent: true }
          ]
        }
      }
    });

    // OS Session
    const s3 = await prisma.attendanceSession.create({
      data: {
        date,
        subjectId: subOS.id,
        teacherId: teacher3.id,
        sectionId: sectionA.id,
        topic: 'Process Scheduling & Deadlocks',
        records: {
          create: [
            { studentId: studentAarav.id, isPresent: true },
            { studentId: studentSneha.id, isPresent: true },
            { studentId: studentRohan.id, isPresent: true }
          ]
        }
      }
    });
  }

  // 14. Syllabus Units for DBMS
  await prisma.syllabusUnit.createMany({
    data: [
      {
        subjectId: subDBMS.id,
        unitNumber: 1,
        title: 'Introduction & Entity-Relationship Model',
        topics: JSON.stringify(['Database Architecture', 'Data Independence', 'ER Modeling', 'Extended ER Constructs'])
      },
      {
        subjectId: subDBMS.id,
        unitNumber: 2,
        title: 'Relational Model & SQL',
        topics: JSON.stringify(['Relational Algebra', 'Tuple Relational Calculus', 'SQL Queries & Joins', 'Views & Triggers'])
      },
      {
        subjectId: subDBMS.id,
        unitNumber: 3,
        title: 'Database Design & Normalization',
        topics: JSON.stringify(['Functional Dependencies', '1NF, 2NF, 3NF', 'BCNF Decomposition', 'Lossless Join Property'])
      },
      {
        subjectId: subDBMS.id,
        unitNumber: 4,
        title: 'Transaction Management & Concurrency',
        topics: JSON.stringify(['ACID Properties', 'Serializability', 'Two-Phase Locking (2PL)', 'Deadlock Prevention'])
      }
    ]
  });

  // 15. Study Materials
  await prisma.studyMaterial.createMany({
    data: [
      {
        subjectId: subDBMS.id,
        teacherId: teacher1.id,
        title: 'Unit 3: Comprehensive Normalization Guide',
        description: 'Detailed solved examples of 1NF to BCNF decompositions and multi-valued dependencies.',
        fileUrl: 'https://vgi.ac.in/materials/dbms_unit3_normalization.pdf',
        fileType: 'PDF',
        unitNumber: 3
      },
      {
        subjectId: subDAA.id,
        teacherId: teacher2.id,
        title: 'Dynamic Programming Lecture Slides',
        description: 'Knapsack, LCS, and Matrix Chain Multiplication algorithms with complexity proofs.',
        fileUrl: 'https://vgi.ac.in/materials/daa_dynamic_programming.pdf',
        fileType: 'PDF',
        unitNumber: 2
      }
    ]
  });

  // 16. Assignments
  const assign1 = await prisma.assignment.create({
    data: {
      title: 'DBMS Normalization & Schema Refinement',
      description: 'Given the hospital management schema, identify functional dependencies and normalize up to BCNF.',
      subjectId: subDBMS.id,
      teacherId: teacher1.id,
      sectionId: sectionA.id,
      dueDate: '2026-09-28T23:59:59Z',
      maxMarks: 50,
      attachmentUrl: 'https://vgi.ac.in/assignments/dbms_assignment_1.pdf'
    }
  });

  const assign2 = await prisma.assignment.create({
    data: {
      title: 'DAA: Greedy vs Dynamic Programming Analysis',
      description: 'Implement Huffman Coding and 0/1 Knapsack in Python with empirical benchmark comparisons.',
      subjectId: subDAA.id,
      teacherId: teacher2.id,
      sectionId: sectionA.id,
      dueDate: '2026-10-02T23:59:59Z',
      maxMarks: 100,
      attachmentUrl: 'https://vgi.ac.in/assignments/daa_assignment_2.pdf'
    }
  });

  // Seed Aarav's submission for Assignment 1
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assign1.id,
      studentId: studentAarav.id,
      content: 'Hospital management relational decomposition attached with dependency diagram.',
      fileUrl: 'https://vgi.ac.in/submissions/aarav_patel_dbms_assign1.pdf',
      status: 'GRADED',
      marks: 47,
      feedback: 'Excellent work on preserving lossless join and dependency preservation.'
    }
  });

  // 17. Previous Results (Semester 4)
  const sem4 = await prisma.semester.create({
    data: {
      number: 4,
      batchId: batch2024.id,
      academicYearId: academicYear.id,
      isCurrent: false
    }
  });

  const resAarav = await prisma.result.create({
    data: {
      studentId: studentAarav.id,
      semesterId: sem4.id,
      sgpa: 8.75,
      cgpa: 8.65,
      status: 'PASSED',
      isPublished: true
    }
  });

  await prisma.resultItem.createMany({
    data: [
      {
        resultId: resAarav.id,
        subjectId: subDBMS.id,
        internalMarks: 28,
        externalMarks: 62,
        totalMarks: 90,
        grade: 'A+',
        gradePoints: 9.0
      },
      {
        resultId: resAarav.id,
        subjectId: subDAA.id,
        internalMarks: 26,
        externalMarks: 58,
        totalMarks: 84,
        grade: 'A',
        gradePoints: 8.5
      }
    ]
  });

  // 18. Campus Notices
  await prisma.notice.createMany({
    data: [
      {
        title: 'Mid-Semester Examination Schedule — Autumn 2026',
        content: 'Mid-semester examinations for all B.Tech and BCA batches will commence from October 12, 2026. Detailed seating arrangements and rules will be published shortly.',
        category: 'EXAMINATION',
        priority: 'CRITICAL',
        targetAudience: 'ALL',
        authorId: adminUser.id
      },
      {
        title: 'Smart India Hackathon 2026 Institutional Round',
        content: 'Registration is now open for college internal selection rounds. Teams of 6 members with at least 1 female participant can submit project proposals by Oct 5.',
        category: 'ACADEMIC',
        priority: 'HIGH',
        targetAudience: 'STUDENTS',
        authorId: adminUser.id
      },
      {
        title: 'Hostel Mess Special Festive Dinner Announcement',
        content: 'A special celebratory dinner will be served this Friday in both Aryabhata and Kalpana Chawla dining halls from 7:30 PM.',
        category: 'HOSTEL',
        priority: 'MEDIUM',
        targetAudience: 'ALL',
        authorId: adminUser.id
      }
    ]
  });

  // 19. Campus Events
  const event1 = await prisma.event.create({
    data: {
      title: 'VGI Technovate 2026 — Annual Technology Conclave',
      description: 'Keynotes by industry leaders from Google, Microsoft, and leading AI startups, featuring competitive robotics, coding sprint, and project showcase.',
      category: 'TECH',
      venue: 'Main Auditorium & Central Amphitheatre',
      date: '2026-10-25',
      startTime: '09:30',
      endTime: '18:00',
      maxParticipants: 500,
      posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'
    }
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Inter-College Chess & Esports Championship',
      description: 'Fast-paced rapid chess and gaming league with cash prizes and institutional trophies.',
      category: 'SPORTS',
      venue: 'Indoor Sports Complex',
      date: '2026-10-18',
      startTime: '10:00',
      endTime: '17:00',
      maxParticipants: 120,
      posterUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200'
    }
  });

  await prisma.eventRegistration.create({
    data: {
      eventId: event1.id,
      studentId: studentAarav.id
    }
  });

  // 20. Hostel Rooms & Complaints
  await prisma.hostelRoom.createMany({
    data: [
      { hostelName: 'Aryabhata Boys Hostel', building: 'Block A', roomNumber: '204', floor: 2, capacity: 2, occupied: 2 },
      { hostelName: 'Aryabhata Boys Hostel', building: 'Block A', roomNumber: '205', floor: 2, capacity: 2, occupied: 1 },
      { hostelName: 'Kalpana Chawla Girls Hostel', building: 'Block C', roomNumber: '102', floor: 1, capacity: 2, occupied: 1 }
    ]
  });

  await prisma.hostelComplaint.create({
    data: {
      studentId: studentAarav.id,
      roomNumber: 'Aryabhata - 204',
      category: 'ELECTRICAL',
      description: 'Ceiling fan regulator in room 204 running only on highest speed.',
      status: 'IN_PROGRESS'
    }
  });

  // 21. Mess Menu
  const messDays = [
    { day: 'MONDAY', b: 'Idli Sambar, Chutney, Tea/Coffee', l: 'Rajma Masala, Steamed Rice, Roti, Salad', d: 'Paneer Butter Masala, Dal Tadka, Naan, Gulab Jamun' },
    { day: 'TUESDAY', b: 'Aloo Paratha with Curd, Pickle, Tea', l: 'Kadhi Pakora, Jeera Rice, Chapati, Boondi Raita', d: 'Mix Vegetable Curry, Yellow Dal, Phulka, Kheer' },
    { day: 'WEDNESDAY', b: 'Poha with Sev, Sprouts, Banana, Milk', l: 'Chole Bhature, Onion Salad, Mint Chutney', d: 'Mutter Paneer, Dal Fry, Roti, Rice' },
    { day: 'THURSDAY', b: 'Upma with Coconut Chutney, Boiled Egg/Fruit', l: 'Dal Makhani, Rice, Tandoori Roti, Papad', d: 'Kashmiri Dum Aloo, Dal Palak, Phulka, Halwa' },
    { day: 'FRIDAY', b: 'Masala Dosa with Sambar, Tea/Coffee', l: 'Egg Curry / Paneer Bhurji, Rice, Chapati', d: 'Special Biryani (Veg/Chicken), Mirchi Ka Salan, Raita, Ice Cream' },
    { day: 'SATURDAY', b: 'Methi Paratha, Butter, Curd, Tea', l: 'Black Chana Curry, Steamed Rice, Roti, Salad', d: 'Shahi Paneer, Dal Tadka, Missi Roti, Jalebi' },
    { day: 'SUNDAY', b: 'Puri Bhaji with Halwa, Tea/Coffee', l: 'Special Sunday Thali: Dal, Sabzi, Rice, Puri, Sweet', d: 'Pav Bhaji with Butter Pav, Pulao, Custard' }
  ];

  for (const m of messDays) {
    await prisma.messMenu.create({
      data: {
        dayOfWeek: m.day,
        breakfast: m.b,
        lunch: m.l,
        dinner: m.d,
        specialMeal: m.day === 'FRIDAY' || m.day === 'SUNDAY' ? 'Special Chef Creation' : null
      }
    });
  }

  // 22. Library Books
  const book1 = await prisma.libraryBook.create({
    data: {
      title: 'Database System Concepts (7th Edition)',
      author: 'Silberschatz, Korth, Sudarshan',
      isbn: '978-0078022159',
      category: 'Computer Science',
      totalCopies: 10,
      availableCopies: 8
    }
  });

  await prisma.libraryBook.create({
    data: {
      title: 'Introduction to Algorithms (4th Edition)',
      author: 'Cormen, Leiserson, Rivest, Stein',
      isbn: '978-0262046305',
      category: 'Algorithms',
      totalCopies: 8,
      availableCopies: 5
    }
  });

  await prisma.libraryTransaction.create({
    data: {
      bookId: book1.id,
      studentId: studentAarav.id,
      issuedAt: new Date('2026-09-10'),
      dueDate: new Date('2026-10-10'),
      fineAmount: 0.0
    }
  });

  // 23. Student Fees
  await prisma.studentFee.create({
    data: {
      studentId: studentAarav.id,
      academicYear: '2026-2027',
      totalAmount: 125000,
      paidAmount: 125000,
      pendingAmount: 0,
      status: 'PAID'
    }
  });

  // 24. Audit Log initial entry
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'System',
      details: JSON.stringify({ message: 'VGI CAMPUS production database seeded successfully' }),
      ipAddress: '127.0.0.1'
    }
  });

  console.log('✅ VGI CAMPUS Database Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('Credentials:');
  console.log('👑 Admin:   admin@vgi.ac.in      | Admin@123');
  console.log('👨‍🏫 Teacher: rajesh.sharma@vgi.ac.in | Password@123');
  console.log('🎓 Student: aarav.patel@vgi.ac.in  | Password@123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
