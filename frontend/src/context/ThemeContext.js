import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('emerald');
  const [fontSize, setFontSize] = useState('medium');
  const [animations, setAnimations] = useState(true);

  // Theme configurations
  const themes = {
    light: {
      name: 'Light',
      nameHi: 'हल्का',
      colors: {
        background: 'bg-white',
        surface: 'bg-gray-50',
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        accent: 'text-emerald-600',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-100'
      }
    },
    dark: {
      name: 'Dark',
      nameHi: 'गहरा',
      colors: {
        background: 'bg-gray-900',
        surface: 'bg-gray-800',
        primary: 'text-white',
        secondary: 'text-gray-300',
        accent: 'text-emerald-400',
        border: 'border-gray-700',
        hover: 'hover:bg-gray-700'
      }
    },
    system: {
      name: 'System',
      nameHi: 'सिस्टम',
      colors: {
        background: 'bg-white dark:bg-gray-900',
        surface: 'bg-gray-50 dark:bg-gray-800',
        primary: 'text-gray-900 dark:text-white',
        secondary: 'text-gray-600 dark:text-gray-300',
        accent: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-gray-200 dark:border-gray-700',
        hover: 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }
    }
  };

  const accentColors = {
    emerald: {
      name: 'Emerald',
      nameHi: 'पन्ना',
      primary: 'emerald-500',
      secondary: 'emerald-600',
      light: 'emerald-100',
      dark: 'emerald-800'
    },
    blue: {
      name: 'Blue',
      nameHi: 'नीला',
      primary: 'blue-500',
      secondary: 'blue-600',
      light: 'blue-100',
      dark: 'blue-800'
    },
    purple: {
      name: 'Purple',
      nameHi: 'बैंगनी',
      primary: 'purple-500',
      secondary: 'purple-600',
      light: 'purple-100',
      dark: 'purple-800'
    },
    orange: {
      name: 'Orange',
      nameHi: 'नारंगी',
      primary: 'orange-500',
      secondary: 'orange-600',
      light: 'orange-100',
      dark: 'orange-800'
    },
    pink: {
      name: 'Pink',
      nameHi: 'गुलाबी',
      primary: 'pink-500',
      secondary: 'pink-600',
      light: 'pink-100',
      dark: 'pink-800'
    }
  };

  const fontSizes = {
    small: {
      name: 'Small',
      nameHi: 'छोटा',
      classes: 'text-sm'
    },
    medium: {
      name: 'Medium',
      nameHi: 'मध्यम',
      classes: 'text-base'
    },
    large: {
      name: 'Large',
      nameHi: 'बड़ा',
      classes: 'text-lg'
    },
    xlarge: {
      name: 'Extra Large',
      nameHi: 'अतिरिक्त बड़ा',
      classes: 'text-xl'
    }
  };

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('bharatshaala_theme');
    const savedAccent = localStorage.getItem('bharatshaala_accent');
    const savedFontSize = localStorage.getItem('bharatshaala_fontSize');
    const savedAnimations = localStorage.getItem('bharatshaala_animations');

    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    } else {
      // Detect system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    }

    if (savedAccent && accentColors[savedAccent]) {
      setAccentColor(savedAccent);
    }

    if (savedFontSize && fontSizes[savedFontSize]) {
      setFontSize(savedFontSize);
    }

    if (savedAnimations !== null) {
      setAnimations(JSON.parse(savedAnimations));
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (theme === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, accentColor, fontSize, animations]);

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement;
    
    // Apply theme classes
    if (selectedTheme === 'dark' || (selectedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply accent color
    root.style.setProperty('--accent-primary', `var(--${accentColor}-500)`);
    root.style.setProperty('--accent-secondary', `var(--${accentColor}-600)`);
    root.style.setProperty('--accent-light', `var(--${accentColor}-100)`);
    root.style.setProperty('--accent-dark', `var(--${accentColor}-800)`);

    // Apply font size
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    root.classList.add(fontSizes[fontSize].classes);

    // Apply animations
    if (!animations) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
    }
  };

  const changeTheme = (newTheme) => {
    if (themes[newTheme]) {
      setTheme(newTheme);
      localStorage.setItem('bharatshaala_theme', newTheme);
    }
  };

  const changeAccentColor = (newColor) => {
    if (accentColors[newColor]) {
      setAccentColor(newColor);
      localStorage.setItem('bharatshaala_accent', newColor);
    }
  };

  const changeFontSize = (newSize) => {
    if (fontSizes[newSize]) {
      setFontSize(newSize);
      localStorage.setItem('bharatshaala_fontSize', newSize);
    }
  };

  const toggleAnimations = () => {
    const newValue = !animations;
    setAnimations(newValue);
    localStorage.setItem('bharatshaala_animations', JSON.stringify(newValue));
  };

  const resetToDefaults = () => {
    setTheme('light');
    setAccentColor('emerald');
    setFontSize('medium');
    setAnimations(true);
    
    localStorage.removeItem('bharatshaala_theme');
    localStorage.removeItem('bharatshaala_accent');
    localStorage.removeItem('bharatshaala_fontSize');
    localStorage.removeItem('bharatshaala_animations');
  };

  const getCurrentTheme = () => themes[theme];
  const getCurrentAccent = () => accentColors[accentColor];
  const getCurrentFontSize = () => fontSizes[fontSize];

  const getThemeClasses = () => {
    const currentTheme = getCurrentTheme();
    const currentAccent = getCurrentAccent();
    
    return {
      ...currentTheme.colors,
      accent: {
        primary: `text-${currentAccent.primary}`,
        secondary: `text-${currentAccent.secondary}`,
        bg: `bg-${currentAccent.primary}`,
        bgLight: `bg-${currentAccent.light}`,
        border: `border-${currentAccent.primary}`,
        hover: `hover:bg-${currentAccent.light}`
      }
    };
  };

  const value = {
    theme,
    accentColor,
    fontSize,
    animations,
    themes,
    accentColors,
    fontSizes,
    changeTheme,
    changeAccentColor,
    changeFontSize,
    toggleAnimations,
    resetToDefaults,
    getCurrentTheme,
    getCurrentAccent,
    getCurrentFontSize,
    getThemeClasses
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;