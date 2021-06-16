export interface IDootedPost {
  content: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  creatorEmail: string;
  creatorId: string;
  creatorName: string;
}

export interface IComposedPost {
  content: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  id: number;
}
