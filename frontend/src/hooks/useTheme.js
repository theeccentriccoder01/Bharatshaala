import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

// Additional theme utilities
export const useThemeClasses = () => {
  const { getThemeClasses } = useTheme();
  return getThemeClasses();
};

export const useResponsiveTheme = () => {
  const { theme, accentColor, fontSize } = useTheme();
  
  const getResponsiveClasses = (breakpoint = 'base') => {
    const breakpoints = {
      sm: 'sm:',
      md: 'md:',
      lg: 'lg:',
      xl: 'xl:',
      '2xl': '2xl:',
      base: ''
    };
    
    const prefix = breakpoints[breakpoint] || '';
    
    return {
      container: `${prefix}max-w-7xl ${prefix}mx-auto ${prefix}px-6`,
      grid: {
        1: `${prefix}grid-cols-1`,
        2: `${prefix}grid-cols-2`,
        3: `${prefix}grid-cols-3`,
        4: `${prefix}grid-cols-4`,
        6: `${prefix}grid-cols-6`
      },
      spacing: {
        xs: `${prefix}space-y-2`,
        sm: `${prefix}space-y-4`,
        md: `${prefix}space-y-6`,
        lg: `${prefix}space-y-8`,
        xl: `${prefix}space-y-12`
      }
    };
  };

  return { getResponsiveClasses };
};

// Market-specific theme hook
export const useMarketTheme = (marketId) => {
  const { accentColor, changeAccentColor } = useTheme();
  
  const marketThemes = {
    chandni_chowk: {
      primary: 'red',
      accent: 'orange',
      name: 'चांदनी चौक'
    },
    laad_bazaar: {
      primary: 'purple',
      accent: 'indigo',
      name: 'लाड़ बाजार'
    },
    devaraja_market: {
      primary: 'amber',
      accent: 'yellow',
      name: 'देवराज मार्केट'
    },
    colaba_causeway: {
      primary: 'blue',
      accent: 'cyan',
      name: 'कोलाबा कॉज़वे'
    },
    commercial_street: {
      primary: 'gray',
      accent: 'slate',
      name: 'कमर्शियल स्ट्रीट'
    },
    dilli_haat: {
      primary: 'orange',
      accent: 'red',
      name: 'दिल्ली हाट'
    }
  };

  const applyMarketTheme = (marketId) => {
    const marketTheme = marketThemes[marketId];
    if (marketTheme) {
      changeAccentColor(marketTheme.primary);
    }
  };

  const getMarketTheme = (marketId) => {
    return marketThemes[marketId] || marketThemes.chandni_chowk;
  };

  return {
    marketThemes,
    applyMarketTheme,
    getMarketTheme
  };
};

export default useTheme;