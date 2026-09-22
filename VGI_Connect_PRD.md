# VGI Connect — Product Requirements Document (PRD)

**Project:** VGI Connect  
**Institution:** Vishveshwarya Group of Institutions (VGI)  
**Document Version:** 1.0  
**Status:** Initial Product Specification  
**Primary Goal:** Build a unified college super-app and administration platform for students, teachers, staff, and administrators.

---

## 1. Product Overview

VGI Connect is a centralized digital campus platform inspired by the concept of apps such as LPU Touch.

The system will provide one ecosystem for:

- Students
- Teachers / Faculty
- HODs
- College Administrators
- Hostel Staff
- Library Staff
- Finance Staff
- Other authorized staff

The mobile application will be built with React Native and Expo. A web-based administration portal will provide complete institutional management capabilities.

The platform should be designed so that the institution can manage academic and campus data from one central backend, while each user sees only the information and actions allowed by their role.

---

# 2. Product Goals

## Primary Goals

1. Give students one app for their academic and campus requirements.
2. Give teachers a single interface for teaching-related operations.
3. Give administrators complete control over institutional data.
4. Build a scalable academic data hierarchy.
5. Provide role-based access control.
6. Centralize attendance, timetable, assignments, syllabus, results, notices, events, and other services.
7. Provide push notifications.
8. Provide dashboards and reports.
9. Maintain audit logs for important administrative actions.
10. Build a foundation that can later support AI-assisted features.

---

# 3. Non-Goals for MVP

Do not implement these in the first version unless explicitly requested:

- AI chatbot
- Live bus GPS tracking
- Complex online payment processing
- Biometric attendance
- Microservices architecture
- Kubernetes
- Advanced predictive analytics
- Native Android/iOS code outside Expo
- Parent application as a separate application

These may be added in later phases.

---

# 4. User Roles

The system must support role-based access.

## 4.1 Student

Permissions:

- View own profile
- View attendance
- View timetable
- View subjects
- View syllabus
- View study material
- View assignments
- Submit assignments
- View results
- View notices
- View events
- Register for events
- View hostel information
- Submit hostel complaints
- View mess information
- View library transactions
- View fee information
- Receive notifications

Students must never be able to access another student's private academic information.

---

## 4.2 Teacher

Permissions:

- View assigned classes
- View assigned subjects
- View assigned students
- Mark attendance
- Edit attendance within permitted rules
- Create assignments
- Review assignment submissions
- Upload study material
- Enter internal marks where authorized
- View class timetable
- Publish class-level announcements
- View class attendance reports

Teachers must only access classes and subjects assigned to them.

---

## 4.3 HOD

Permissions include teacher capabilities plus:

- View department students
- View department teachers
- Manage department-level academic data
- View department attendance
- View department performance
- Approve selected academic requests
- Generate department reports

---

## 4.4 Admin

Permissions:

- Manage students
- Manage teachers
- Manage staff
- Manage departments
- Manage programs
- Manage academic years
- Manage batches
- Manage semesters
- Manage sections
- Manage subjects
- Assign teachers
- Assign subjects
- Manage timetable
- Manage attendance configuration
- Manage results
- Manage assignments
- Manage syllabus
- Manage study materials
- Manage notices
- Manage events
- Manage hostel
- Manage library
- Manage fees
- Manage notifications
- Generate reports
- View audit logs

---

## 4.5 Super Admin

Full system access, including:

- User management
- Role management
- Permission management
- System configuration
- Institution configuration
- Security settings
- Audit logs
- Administrative controls

---

## 4.6 Specialized Staff

The architecture should support specialized roles such as:

- Hostel Staff
- Librarian
- Finance Staff
- Transport Staff
- Sports Staff
- Event Manager

Each role should receive only the permissions required for its responsibilities.

---

# 5. Core Academic Hierarchy

The academic model is the foundation of the entire system.

Use the following hierarchy:

```text
Institution
    |
    +-- Department
          |
          +-- Program
                |
                +-- Academic Year
                |
                +-- Batch
                      |
                      +-- Year
                            |
                            +-- Semester
                                  |
                                  +-- Section
                                        |
                                        +-- Students
                                        |
                                        +-- Subjects
```

Teacher assignments connect teachers to subjects/classes:

```text
Teacher
   |
   +-- Teaching Assignment
            |
            +-- Subject
            +-- Program
            +-- Batch
            +-- Semester
            +-- Section
            +-- Academic Year
```

All academic modules should reference this hierarchy.

---

# 6. Recommended Technology Stack

## Mobile

- React Native
- Expo
- TypeScript
- Expo Router
- TanStack Query
- Zustand
- NativeWind or a consistent React Native UI system
- Expo SecureStore
- Expo Notifications
- Expo DocumentPicker
- Expo ImagePicker
- Expo Camera

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Zod for request validation
- JWT or secure session-based authentication
- Argon2 or bcrypt for password hashing

## Admin Web

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

## Storage

Use object storage for files:

- AWS S3 or compatible storage
- Cloudinary can be used for image-heavy content

Do not store large PDF/document files directly in PostgreSQL.

## Notifications

- Expo Notifications
- Backend notification service

## Deployment

Suggested initial architecture:

```text
Expo/EAS
    |
Mobile App

Vercel
    |
Next.js Admin

Render/Railway/AWS
    |
Node.js API

Managed PostgreSQL
    |
Database

Redis
    |
Cache / queues / temporary data

S3-compatible storage
    |
Documents / images
```

---

# 7. High-Level Architecture

Use a modular monolith for the initial production system.

```text
                    VGI CONNECT
                         |
          +--------------+--------------+
          |                             |
      Mobile App                    Admin Web
     React Native                    Next.js
        Expo                           |
          |                             |
          +-------------+---------------+
                        |
                     REST API
                        |
                Node.js + Express
                        |
        +---------------+----------------+
        |               |                |
      Auth          Application       Notifications
        |             Modules             |
        |               |                 |
        +---------------+-----------------+
                        |
                     Prisma
                        |
                   PostgreSQL
                        |
              +---------+---------+
              |                   |
            Redis            Object Storage
```

Do not introduce microservices unless there is a clear scaling requirement.

---

# 8. Mobile Application

## 8.1 Authentication

Screens:

- Splash
- Login
- Forgot Password
- Reset Password
- Session restoration
- Logout

Login should identify the user's role and route them to the correct application area.

Example:

```text
Student -> Student Dashboard
Teacher -> Teacher Dashboard
Staff -> Staff Dashboard
Admin -> Admin Web Portal
```

Sensitive authentication information must be stored securely.

Use Expo SecureStore for mobile credentials/tokens where appropriate.

---

# 9. Student Application

## 9.1 Student Home Dashboard

The dashboard should display:

- Student name
- Profile photo
- Program
- Semester
- Section
- Overall attendance
- Next class
- Today's timetable summary
- Pending assignments
- Latest notices
- Upcoming events
- Important notifications

Example:

```text
Hello, Aarav

B.Tech Data Science
Semester 5 | Section A

Attendance
82%

Next Class
DBMS — 10:00 AM

Pending Assignment
Data Analytics — Due Tomorrow

Latest Notice
Mid-Semester Examination Schedule

Upcoming Event
Chess Tournament
```

---

# 10. Student Profile

Display:

## Personal Information

- Name
- Enrollment number
- Roll number
- Email
- Phone
- Date of birth where permitted
- Profile photo

## Academic Information

- Department
- Program
- Batch
- Academic year
- Current year
- Current semester
- Section
- CGPA

## Guardian Information

Only if institution policy permits:

- Guardian name
- Guardian contact

## Hostel Information

If applicable:

- Hostel
- Room
- Bed

Students should not be able to modify institution-controlled academic fields themselves.

---

# 11. Attendance Module

## Student Features

Students can:

- View overall attendance
- View subject-wise attendance
- View attendance history
- View present/absent counts
- View attendance percentage
- View attendance warnings

Example:

```text
DBMS              86%
Data Analytics    81%
DAA               78%
Operating Systems 69%
```

## Teacher Features

Teachers can:

1. Select class
2. Select subject
3. Select date/time
4. Load enrolled students
5. Mark present/absent
6. Submit attendance

Attendance must be associated with:

- Student
- Subject
- Teacher
- Class/section
- Date
- Academic year
- Semester
- Attendance session

## Future QR Attendance

Optional later feature:

```text
Teacher
  |
Generate QR
  |
Student scans
  |
Server validates
  |
Attendance recorded
```

Validation should include class, subject, time window, student enrollment, and duplicate prevention.

---

# 12. Timetable Module

Students:

- View today's timetable
- View weekly timetable
- View subject
- View teacher
- View room
- View class time
- See next class

Teachers:

- View their teaching schedule

Admins:

- Create timetable entries
- Edit timetable
- Assign teacher
- Assign subject
- Assign room
- Assign section
- Detect timetable conflicts

The system should prevent or warn about:

- Teacher double booking
- Room double booking
- Section double booking

---

# 13. Subject Module

Each subject should contain:

- Subject name
- Subject code
- Credits
- Type
- Department
- Program
- Semester
- Assigned teachers
- Syllabus
- Study material
- Assignments
- Attendance
- Results

Student subject screen:

```text
DBMS

Teacher
Attendance
Syllabus
Study Material
Assignments
Results
```

---

# 14. Syllabus Module

Admins/authorized teachers can manage syllabus content.

Hierarchy:

```text
Program
 -> Semester
   -> Subject
     -> Unit
       -> Topic
```

Example:

```text
BCS501 — DBMS

Unit 1
- Introduction
- ER Model
- Relational Model
- SQL

Unit 2
- Normalization
- Transactions
- Concurrency
```

Support both:

- Structured syllabus
- Official syllabus PDF

---

# 15. Assignment Module

## Teacher

Can:

- Create assignment
- Set title
- Description
- Subject
- Class
- Deadline
- Maximum marks
- Attachment
- Publish/unpublish

## Student

Can:

- View assignments
- View deadlines
- Open assignment details
- Upload submission
- Replace submission before deadline if allowed
- View submission status
- View marks/feedback when published

Statuses:

```text
Pending
Submitted
Late
Graded
```

Teacher dashboard should show:

```text
Total Students: 50
Submitted: 43
Pending: 7
```

---

# 16. Study Material Module

Teachers can upload:

- PDF
- PPT
- DOC/DOCX
- Images
- Links
- Other institution-approved formats

Materials should be associated with:

- Subject
- Unit
- Program
- Semester
- Section where applicable
- Teacher
- Academic year

Store files in object storage.

---

# 17. Results Module

Authorized staff can enter/publish:

- Internal marks
- External marks
- Practical marks
- Grade
- Grade points
- Result status

Students can view:

- Semester-wise results
- Subject marks
- SGPA
- CGPA
- Result status

Results must have strict authorization.

Once published, changes should be audited.

---

# 18. Notice Module

Admins and authorized staff can create notices.

Fields:

- Title
- Description
- Category
- Attachment
- Publish date
- Expiry date
- Priority
- Audience

Audience can target:

```text
Everyone
Students
Teachers
Department
Program
Batch
Year
Semester
Section
```

Students receive push notifications for relevant notices.

---

# 19. Events Module

Event fields:

- Event name
- Description
- Date
- Start time
- End time
- Venue
- Organizer
- Registration deadline
- Maximum participants
- Poster
- Status

Students can:

- Browse events
- View event details
- Register
- Cancel registration if allowed
- View registered events

Future:

- QR event check-in
- Attendance
- Certificates

---

# 20. Hostel Module

## Hostel Structure

```text
Hostel
 -> Building
   -> Floor
     -> Room
       -> Bed
         -> Student
```

Admin/Hostel Staff can:

- Create hostel
- Create rooms
- Create beds
- Assign students
- Transfer students
- Vacate rooms
- View occupancy

Students can view:

- Hostel
- Room
- Bed
- Roommates
- Hostel notices
- Complaint status
- Mess information

---

# 21. Hostel Complaint System

Student:

```text
Create Complaint
Category
Description
Photo
Room
```

Statuses:

```text
Pending
Assigned
In Progress
Resolved
Rejected
```

Staff can assign complaints and update status.

Maintain complaint history.

---

# 22. Mess Module

Admin/staff can manage:

- Daily menu
- Breakfast
- Lunch
- Dinner
- Special meals
- Mess notices

Students can view the menu.

Future:

- Meal feedback
- Mess ratings
- Complaint management

---

# 23. Library Module

Library staff can manage:

- Books
- Authors
- Categories
- Copies
- Issue
- Return
- Due dates
- Fines

Students can:

- Search books
- View availability
- View issued books
- View due dates
- View transaction history

---

# 24. Fees Module

Admin/finance can manage:

- Fee structure
- Student fees
- Payments
- Pending amounts
- Scholarships
- Receipts

Students can view:

- Total fee
- Paid amount
- Pending amount
- Payment history
- Receipts

Online payment integration is a later phase and must use an approved payment provider.

---

# 25. Transport Module

Future/optional:

- Bus
- Route
- Stops
- Driver
- Vehicle
- Assigned students

Later:

- Live GPS tracking

---

# 26. Teacher Management

Admin must be able to:

- Add teacher
- Edit teacher
- Disable teacher
- Assign department
- Assign subjects
- Assign classes
- Assign sections
- Assign timetable
- View teaching load

Teacher fields:

```text
Name
Employee ID
Email
Phone
Department
Designation
Qualification
Joining date
Status
```

---

# 27. Teaching Assignment

Do not directly associate a teacher permanently with a subject.

Use a TeachingAssignment entity.

Example:

```text
Teacher:
Professor XYZ

Subject:
DBMS

Program:
B.Tech Data Science

Batch:
2024-2028

Semester:
5

Section:
A

Academic Year:
2026-27
```

This supports teachers teaching multiple subjects/classes.

---

# 28. Student Promotion

Admin should have a bulk promotion feature.

Example:

```text
Program: B.Tech Data Science
Batch: 2024-2028
From: Semester 4
To: Semester 5

Students: 120

[ Review ]
[ Promote ]
```

The system should record the promotion in an audit/history record.

Do not destroy previous academic history.

---

# 29. Department Management

Admin can:

- Create department
- Edit department
- Assign HOD
- View teachers
- View programs
- View students
- View attendance
- View performance

---

# 30. Program Management

Example:

```text
B.Tech Data Science
B.Tech CSE
B.Tech AI
BCA
MCA
```

Each program can define:

- Duration
- Departments
- Semesters
- Subjects
- Credit structure

---

# 31. Batch Management

Example:

```text
B.Tech Data Science
Batch: 2024-2028
```

Batch contains:

- Students
- Academic progression
- Sections
- Enrollment history

---

# 32. Admin Dashboard Analytics

Display:

- Total students
- Total teachers
- Departments
- Programs
- Current academic year
- Attendance average
- Pending assignments
- Active events
- Notices
- Hostel occupancy
- Library activity

Example:

```text
Students       4,823
Teachers         214
Departments       12
Attendance        87%
Hostel Occupancy 92%
```

---

# 33. Reports

Admin should eventually be able to generate:

- Student list
- Teacher list
- Attendance report
- Department attendance
- Subject attendance
- Assignment report
- Result report
- Hostel occupancy
- Library report
- Fee report
- Event registration report

Support CSV/PDF export in later phases.

---

# 34. Notifications

Notification events include:

- New notice
- New assignment
- Assignment deadline reminder
- Timetable update
- Attendance warning
- Result published
- New event
- Event registration confirmation
- Hostel complaint update
- Library due-date reminder

Notifications should be targeted according to user permissions and audience.

---

# 35. Authentication and Authorization

Authentication must be centralized.

Recommended flow:

```text
Login
  |
Validate credentials
  |
Create authenticated session
  |
Determine user role
  |
Load permissions
  |
Route user
```

Authorization must happen on the backend.

Never rely only on frontend route protection.

Use:

- Role-based access control
- Permission-based access control
- Server-side authorization
- Secure password hashing
- Rate limiting
- Request validation
- Audit logging

---

# 36. Permission Model

Support permissions such as:

```text
students.read
students.create
students.update
students.delete

teachers.read
teachers.create
teachers.update
teachers.assign

attendance.read
attendance.create
attendance.update

assignments.read
assignments.create
assignments.grade

results.read
results.create
results.publish

notices.read
notices.create
notices.publish

events.read
events.create
events.manage

hostel.read
hostel.manage

library.read
library.manage

fees.read
fees.manage
```

Users can have roles containing permissions.

---

# 37. Database Model

Recommended database: PostgreSQL.

Core entities:

```text
User
Role
Permission
UserRole

Institution
Department
Program
AcademicYear
Batch
Year
Semester
Section

Student
Teacher
Staff

Subject
Enrollment
TeachingAssignment

Timetable
Room

AttendanceSession
AttendanceRecord

Syllabus
SyllabusUnit
SyllabusTopic

StudyMaterial

Assignment
AssignmentSubmission

Result
ResultItem

Notice
Event
EventRegistration

Hostel
HostelBuilding
HostelFloor
Room
Bed
HostelAllocation
HostelComplaint

MessMenu

LibraryBook
LibraryCopy
LibraryTransaction

FeeStructure
StudentFee
Payment

Notification
DeviceToken

AuditLog
```

---

# 38. Important Database Relationships

## Student

```text
Student
 -> User
 -> Program
 -> Batch
 -> Semester
 -> Section
 -> Department
 -> Enrollments
 -> HostelAllocation
```

## Teacher

```text
Teacher
 -> User
 -> Department
 -> TeachingAssignments
```

## TeachingAssignment

```text
TeachingAssignment
 -> Teacher
 -> Subject
 -> Program
 -> Batch
 -> Semester
 -> Section
 -> AcademicYear
```

## Enrollment

```text
Enrollment
 -> Student
 -> Subject
 -> Semester
 -> AcademicYear
```

## Attendance

```text
AttendanceSession
 -> TeachingAssignment

AttendanceRecord
 -> AttendanceSession
 -> Student
```

---

# 39. Backend Folder Structure

```text
backend/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── utils/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── departments/
│   │   ├── programs/
│   │   ├── academic-years/
│   │   ├── batches/
│   │   ├── semesters/
│   │   ├── sections/
│   │   ├── subjects/
│   │   ├── enrollments/
│   │   ├── teaching-assignments/
│   │   ├── timetable/
│   │   ├── attendance/
│   │   ├── syllabus/
│   │   ├── materials/
│   │   ├── assignments/
│   │   ├── results/
│   │   ├── notices/
│   │   ├── events/
│   │   ├── hostel/
│   │   ├── mess/
│   │   ├── library/
│   │   ├── fees/
│   │   ├── transport/
│   │   └── notifications/
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
├── package.json
└── tsconfig.json
```

---

# 40. Mobile Folder Structure

```text
mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── forgot-password.tsx
│   │
│   ├── (student)/
│   │   ├── index.tsx
│   │   ├── attendance.tsx
│   │   ├── timetable.tsx
│   │   ├── subjects.tsx
│   │   ├── syllabus.tsx
│   │   ├── assignments.tsx
│   │   ├── materials.tsx
│   │   ├── results.tsx
│   │   ├── notices.tsx
│   │   ├── events.tsx
│   │   ├── hostel.tsx
│   │   ├── library.tsx
│   │   ├── fees.tsx
│   │   └── profile.tsx
│   │
│   ├── (teacher)/
│   │   ├── index.tsx
│   │   ├── classes.tsx
│   │   ├── attendance.tsx
│   │   ├── assignments.tsx
│   │   ├── materials.tsx
│   │   └── students.tsx
│   │
│   └── _layout.tsx
│
├── components/
├── features/
├── services/
├── hooks/
├── store/
├── types/
├── constants/
├── utils/
└── package.json
```

---

# 41. Admin Web Structure

```text
admin/
├── app/
│   ├── login/
│   ├── dashboard/
│   ├── students/
│   ├── teachers/
│   ├── staff/
│   ├── departments/
│   ├── programs/
│   ├── academic-years/
│   ├── batches/
│   ├── semesters/
│   ├── sections/
│   ├── subjects/
│   ├── teaching-assignments/
│   ├── timetable/
│   ├── attendance/
│   ├── syllabus/
│   ├── materials/
│   ├── assignments/
│   ├── results/
│   ├── notices/
│   ├── events/
│   ├── hostel/
│   ├── mess/
│   ├── library/
│   ├── fees/
│   ├── transport/
│   ├── reports/
│   ├── audit-logs/
│   └── settings/
├── components/
├── features/
├── services/
├── hooks/
└── package.json
```

---

# 42. API Structure

Base URL:

```text
/api/v1
```

Authentication:

```text
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
```

Students:

```text
GET    /students
POST   /students
GET    /students/:id
PATCH  /students/:id
DELETE /students/:id

GET    /students/:id/attendance
GET    /students/:id/results
GET    /students/:id/assignments
```

Teachers:

```text
GET    /teachers
POST   /teachers
GET    /teachers/:id
PATCH  /teachers/:id
```

Teaching assignments:

```text
GET    /teaching-assignments
POST   /teaching-assignments
PATCH  /teaching-assignments/:id
DELETE /teaching-assignments/:id
```

Attendance:

```text
GET  /attendance
POST /attendance/sessions
POST /attendance/sessions/:id/records
GET  /attendance/student/:studentId
```

Timetable:

```text
GET  /timetable
POST /timetable
PATCH /timetable/:id
DELETE /timetable/:id
```

Assignments:

```text
GET  /assignments
POST /assignments
GET  /assignments/:id
POST /assignments/:id/submissions
PATCH /assignments/:id
```

Results:

```text
GET  /results
POST /results
PATCH /results/:id
POST /results/:id/publish
```

Notices:

```text
GET  /notices
POST /notices
PATCH /notices/:id
DELETE /notices/:id
POST /notices/:id/publish
```

Events:

```text
GET  /events
POST /events
GET  /events/:id
POST /events/:id/register
DELETE /events/:id/register
```

---

# 43. API Rules

All APIs must:

1. Validate request bodies.
2. Authenticate users where required.
3. Authorize based on roles/permissions.
4. Return consistent error formats.
5. Use pagination for large lists.
6. Avoid exposing sensitive fields.
7. Use transactions for multi-step database updates.
8. Log important administrative operations.
9. Never trust IDs supplied by the client without authorization checks.

Recommended response format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action."
  }
}
```

---

# 44. Audit Logging

Important actions must create audit records.

Examples:

```text
Admin created student
Admin changed student semester
Admin assigned teacher to subject
Teacher updated attendance
Teacher uploaded material
Admin published result
Admin published notice
Admin changed fee
Hostel staff resolved complaint
```

Audit record:

```text
userId
action
entityType
entityId
oldValue
newValue
timestamp
ipAddress
```

Avoid storing unnecessary sensitive information in logs.

---

# 45. Security Requirements

The system must implement:

- HTTPS
- Secure password hashing
- Authentication
- Authorization
- RBAC/permissions
- Input validation
- Rate limiting
- CORS configuration
- Secure HTTP headers
- File upload validation
- File size limits
- Database backups
- Audit logs
- Secure secrets management
- Token expiration/rotation
- Secure mobile token storage
- Server-side access checks

The backend must never assume that hiding a frontend button is sufficient security.

---

# 46. Data Privacy

The application contains sensitive institutional data.

The implementation must:

- Minimize collected personal data.
- Restrict access according to role.
- Avoid exposing student information through public APIs.
- Avoid returning unnecessary fields.
- Protect academic records.
- Protect fee information.
- Protect authentication information.
- Maintain audit history for privileged changes.
- Follow applicable institutional policies and laws.

Real student/teacher data must only be used with appropriate institutional authorization.

---

# 47. Performance Requirements

Initial targets:

- API common requests: ideally < 500 ms under normal load
- Mobile dashboard should load quickly using cached data where possible
- Paginate student/teacher lists
- Cache suitable read-heavy data
- Avoid loading entire datasets into mobile clients
- Compress/optimize images
- Lazy-load large files
- Use database indexes on common query fields

Important indexes should include:

```text
User.email
Student.enrollmentNumber
Student.rollNumber
Teacher.employeeId
Enrollment.studentId
Enrollment.subjectId
AttendanceRecord.studentId
AttendanceSession.subjectId
Assignment.subjectId
Notice.publishDate
Event.date
```

---

# 48. Error Handling

Mobile UI should handle:

- Network unavailable
- Session expired
- Unauthorized
- Server error
- Validation error
- Empty data
- Loading state
- Retry state

Every major screen should have:

```text
Loading
Success
Empty
Error
```

states.

---

# 49. UX Requirements

The app should be:

- Clean
- Fast
- Mobile-first
- Easy for students with limited technical knowledge
- Consistent across screens
- Accessible
- Responsive

Use a consistent design system.

Recommended bottom navigation:

```text
Home
Academics
Campus
Notifications
Profile
```

Academics:

```text
Attendance
Timetable
Subjects
Syllabus
Assignments
Materials
Results
```

Campus:

```text
Notices
Events
Hostel
Mess
Library
Fees
Transport
```

---

# 50. MVP Scope

The first production milestone should include:

## Mobile

- Login
- Student profile
- Dashboard
- Attendance
- Timetable
- Subjects
- Syllabus
- Assignments
- Study material
- Results
- Notices
- Events
- Notifications

## Teacher

- Login
- Dashboard
- Assigned classes
- Attendance
- Assignments
- Study material
- Students

## Admin

- Login
- Dashboard
- Student management
- Teacher management
- Department management
- Program management
- Batch management
- Semester management
- Section management
- Subject management
- Teaching assignment
- Timetable
- Attendance
- Assignment management
- Syllabus
- Results
- Notices
- Events
- Notifications
- Audit logs

---

# 51. Phase 2

Add:

- Hostel
- Hostel complaints
- Mess
- Library
- Fees
- Transport
- Reports
- CSV exports
- PDF reports
- Bulk student import
- Bulk teacher import
- Bulk promotion

---

# 52. Phase 3

Add:

- QR attendance
- Event QR check-in
- Advanced analytics
- Parent access
- Advanced notification automation
- Online fee payment
- Bus tracking
- Certificate management

---

# 53. Phase 4 — AI

Potential AI assistant:

```text
VGI AI

Student:
"What classes do I have tomorrow?"

"What is my DBMS attendance?"

"What assignments are due this week?"

"Show the DBMS syllabus."

"When is the next college event?"
```

AI must use authenticated, permission-aware backend tools and must never bypass normal authorization.

---

# 54. Coding Agent Instructions

The coding agent should follow these principles:

1. Use TypeScript everywhere.
2. Prefer clean modular architecture.
3. Do not duplicate business logic.
4. Keep database logic inside service/repository layers.
5. Validate all API inputs.
6. Enforce authorization server-side.
7. Use Prisma migrations.
8. Write reusable UI components.
9. Use TanStack Query for server state.
10. Use Zustand only for appropriate client state.
11. Keep authentication logic centralized.
12. Use environment variables for secrets.
13. Never hardcode credentials.
14. Never store secrets in Git.
15. Add loading/error/empty states.
16. Add meaningful tests for critical business logic.
17. Use transactions for critical multi-record updates.
18. Add indexes for frequent queries.
19. Use pagination for large datasets.
20. Maintain backward-compatible API contracts where practical.
21. Keep modules independently understandable.
22. Do not introduce unnecessary libraries.
23. Do not implement future features unless required by the current milestone.
24. Do not use mock data in production paths.
25. Clearly separate development seed data from production data.

---

# 55. Development Order

The coding agent should implement in this order:

## Step 1

Create monorepo/project structure.

```text
mobile
admin
backend
packages
```

## Step 2

Set up:

- TypeScript
- ESLint
- Prettier
- Environment configuration
- PostgreSQL
- Prisma
- Database migrations

## Step 3

Implement:

- User
- Role
- Permission
- Authentication
- Authorization

## Step 4

Implement academic foundation:

- Department
- Program
- Academic Year
- Batch
- Semester
- Section
- Student
- Teacher
- Subject

## Step 5

Implement:

- Enrollment
- Teaching Assignment

## Step 6

Implement:

- Timetable
- Attendance

## Step 7

Implement:

- Syllabus
- Materials
- Assignments

## Step 8

Implement:

- Results
- Notices
- Events

## Step 9

Build student mobile UI.

## Step 10

Build teacher mobile UI.

## Step 11

Build admin dashboard.

## Step 12

Implement notifications.

## Step 13

Implement audit logging.

## Step 14

Test complete end-to-end flows.

---

# 56. Critical End-to-End Flows

## Flow 1 — Create Student

```text
Admin
 -> Add Student
 -> Select Department
 -> Select Program
 -> Select Batch
 -> Select Year
 -> Select Semester
 -> Select Section
 -> Create Account
 -> Student receives login access
```

## Flow 2 — Assign Teacher

```text
Admin
 -> Select Teacher
 -> Select Subject
 -> Select Program
 -> Select Batch
 -> Select Semester
 -> Select Section
 -> Select Academic Year
 -> Create Teaching Assignment
```

## Flow 3 — Attendance

```text
Teacher
 -> Select Class
 -> Select Subject
 -> Start Attendance Session
 -> Mark Students
 -> Submit
 -> Backend validates
 -> Save attendance
 -> Student attendance updates
```

## Flow 4 — Assignment

```text
Teacher
 -> Create Assignment
 -> Select Subject/Class
 -> Publish
 -> Students receive notification
 -> Student submits
 -> Teacher reviews
 -> Teacher grades
 -> Student sees result
```

## Flow 5 — Notice

```text
Admin
 -> Create Notice
 -> Select Audience
 -> Publish
 -> Notification service
 -> Target students receive push notification
```

## Flow 6 — Promotion

```text
Admin
 -> Select Program
 -> Select Batch
 -> Select Current Semester
 -> Review students
 -> Promote
 -> New academic enrollment/state created
 -> Previous academic history retained
 -> Audit log created
```

---

# 57. Acceptance Criteria

The MVP is considered functional when:

### Authentication

- Users can log in.
- Users are routed according to role.
- Unauthorized routes are blocked.
- Sessions can be securely terminated.

### Student

- Student sees their correct academic profile.
- Student sees only their own attendance/results/fees.
- Student can view timetable.
- Student can view assignments.
- Student can submit assignments.
- Student can view syllabus/materials.
- Student receives relevant notices/events.

### Teacher

- Teacher sees only assigned classes.
- Teacher can mark attendance.
- Teacher can create assignments.
- Teacher can upload materials.
- Teacher can view assigned students.

### Admin

- Admin can create/manage students.
- Admin can create/manage teachers.
- Admin can create/manage departments/programs.
- Admin can manage batches/semesters/sections.
- Admin can assign teachers to classes.
- Admin can manage timetable.
- Admin can manage notices/events.
- Admin can manage results.
- Admin can view reports.
- Important actions are audited.

### Security

- Backend authorization works independently of frontend UI.
- Users cannot access another user's protected records by changing IDs.
- Passwords are never stored in plaintext.
- Secrets are not committed to Git.

---

# 58. Suggested Project Name

Primary:

**VGI Connect**

Possible alternatives:

- VGI One
- VGI Campus
- VGI Hub
- VGI Student
- VGI Digital Campus
- VGI Portal

Use **VGI Connect** as the working project name unless the institution chooses another official name.

---

# 59. Final Architecture Summary

```text
                         VGI CONNECT
                              |
             +----------------+----------------+
             |                                 |
       React Native                         Next.js
          Expo                            Admin Portal
             |                                 |
             +----------------+----------------+
                              |
                         REST API
                              |
                    Node.js + Express
                         TypeScript
                              |
        +---------------------+---------------------+
        |                     |                     |
       Auth              Business Modules      Notifications
        |                     |                     |
        |          +----------+----------+          |
        |          |          |          |          |
        |       Academic    Campus    Admin         |
        |          |          |          |          |
        |       Attendance  Hostel   Management     |
        |       Timetable   Library  Reports        |
        |       Assignment  Fees     Users          |
        |       Results     Events   Roles           |
        |       Syllabus    Mess     Permissions    |
        |                                            |
        +--------------------+-----------------------+
                             |
                          Prisma
                             |
                        PostgreSQL
                             |
                    +--------+--------+
                    |                 |
                  Redis         Object Storage
                    |
                  Cache
```

---

# 60. Product Principle

The most important architectural principle is:

> **Build the academic data foundation first. Every other feature should consume the same source of truth.**

For example:

```text
B.Tech Data Science
       ↓
Batch 2024-2028
       ↓
Semester 5
       ↓
Section A
       ↓
Students
       ↓
Subjects
       ↓
Teachers
       ↓
Timetable
       ↓
Attendance
       ↓
Assignments
       ↓
Results
```

This allows an administrator to manage the institution centrally while students and teachers automatically see the correct information in their respective applications.

The initial implementation should remain a **modular monolith**, with clean module boundaries so that individual services can be separated later only if the scale requires it.
