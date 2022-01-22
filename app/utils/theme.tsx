import React, { useContext } from 'react';

export type Theme = 'light' | 'dark';
type ThemeContextType = [Theme, React.Dispatch<React.SetStateAction<Theme>>];

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeContext.Provider');
  }
  return context;
}
