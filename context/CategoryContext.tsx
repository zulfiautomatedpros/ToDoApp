// context/CategoryContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CategoryContextType {
  categories: string[];
  addCategory: (cat: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const defaultCategories = ['Personal', 'Work', 'Shopping'];
  const [categories, setCategories] = useState<string[]>(defaultCategories);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`categories_${user.id}`);
      if (stored) setCategories(JSON.parse(stored));
      else setCategories(defaultCategories);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`categories_${user.id}`, JSON.stringify(categories));
    }
  }, [categories, user]);

  const addCategory = (cat: string) => {
    if (!categories.includes(cat)) setCategories([...categories, cat]);
  };

  return <CategoryContext.Provider value={{ categories, addCategory }}>{children}</CategoryContext.Provider>;
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategory must be used within a CategoryProvider');
  return context;
};
