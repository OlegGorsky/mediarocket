export interface User {
  id: number;
  userid: string;
  points: string;
  avatar: string;
  username: string;
  name: string;
  RC: string;
  order: string;
}

export type Tab = 'rocket' | 'friends' | 'tasks' | 'rating' | 'experts';

export interface Expert {
  id: string;
  title: string;
  image: string;
  link: string;
  featured?: boolean;
  description: string;
  benefitLink: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface Config {
  api: {
    url: string;
    headers: Record<string, string>;
  };
  telegram: {
    botToken: string;
  };
}