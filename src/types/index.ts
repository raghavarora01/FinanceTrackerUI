// User type
export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user fields as needed
}

// Budget type
export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Expense type
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// API Response type
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Error type
export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}
