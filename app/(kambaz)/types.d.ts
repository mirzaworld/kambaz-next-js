// types.d.ts (create at project root or inside app/(kambaz))
export type Course = {
  _id: string;
  name: string;
  number: string;
  description?: string;
};

export type Lesson = {
  _id: string;
  name: string;
  description?: string;
  module: string;
};

export type Module = {
  _id: string;
  name: string;
  description?: string;
  course: string;
  lessons?: Lesson[];
};

export type Assignment = {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  loginId: string;
  section: string;
  role: string;
  lastActivity: string;
  totalActivity: string;
};

export type Enrollment = {
  _id: string;
  user: string;
  course: string;
};
