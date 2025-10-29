import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme/theme';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  // Get initial theme from localStorage or default to 'light'
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('parkingAppTheme');
    return savedTheme || 'light';
  });

  // Create theme based on current mode
  const theme = createAppTheme(themeMode);

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('parkingAppTheme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const setTheme = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setThemeMode(mode);
    } else if (mode === 'auto') {
      // Auto mode: detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDark ? 'dark' : 'light');
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setThemeMode(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup listener
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  };

  const value = {
    themeMode,
    toggleTheme,
    setTheme,
    isDark: themeMode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};