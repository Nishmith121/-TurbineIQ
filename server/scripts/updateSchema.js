const fs = require('fs');

let schema = fs.readFileSync('c:/Users/nishu/Downloads/New folder (2)/server/prisma/schema.prisma', 'utf8');

// Update User relations
schema = schema.replace(
  /projects    Project\[\]/g,
  `projects    Project[]\n  teams       Team[]      @relation("TeamMembers")\n  taughtTeams Team[]      @relation("TeamTeacher")\n  assignments Assignment[]\n  submissions Submission[]`
);

// Append new models
const newModels = `
// =============================================
// LMS MODELS (Professor Portal)
// =============================================

model Team {
  id          String       @id @default(uuid())
  name        String
  joinCode    String       @unique
  teacherId   String
  createdAt   DateTime     @default(now())

  teacher     User         @relation("TeamTeacher", fields: [teacherId], references: [id])
  members     User[]       @relation("TeamMembers")
  assignments Assignment[] @relation("TeamAssignments")

  @@map("teams")
}

model Assignment {
  id          String      @id @default(uuid())
  title       String
  description String
  machineType MachineType
  dueDate     DateTime?
  teacherId   String
  createdAt   DateTime    @default(now())
  
  teacher     User        @relation(fields: [teacherId], references: [id])
  teams       Team[]      @relation("TeamAssignments")
  submissions Submission[]

  @@map("assignments")
}

enum SubmissionStatus {
  PENDING
  GRADED
}

model Submission {
  id            String           @id @default(uuid())
  assignmentId  String
  studentId     String
  projectId     String?
  status        SubmissionStatus @default(PENDING)
  score         Float?
  feedback      String?
  submittedAt   DateTime         @default(now())
  gradedAt      DateTime?

  assignment    Assignment       @relation(fields: [assignmentId], references: [id])
  student       User             @relation(fields: [studentId], references: [id])
  project       Project?         @relation(fields: [projectId], references: [id])

  @@map("submissions")
}
`;

fs.writeFileSync('c:/Users/nishu/Downloads/New folder (2)/server/prisma/schema.prisma', schema + newModels, 'utf8');
console.log("SUCCESS");
