
export interface Skill {
  name: string;
  proficiency: number;
}

export interface Developer {
  id: string; // Document ID from Firestore (email)
  name: string;
  employeeId: string;
  email: string;
  location: string;
  role: string;
  project: string;
  active: boolean;
  skills: Skill[];
}
