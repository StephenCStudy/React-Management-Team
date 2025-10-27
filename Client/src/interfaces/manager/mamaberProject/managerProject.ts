export type Projects = {
  id: string | number;
  projectName: string;
  description?: string;
  image?: string; // db.json uses `image`
  members?: Array<{
    userId: number;
    role: string;
  }>;
};
