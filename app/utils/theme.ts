// Define color palette
export const Colors = {
  light: {
    // Background colors
    background: '#FFFFFF',
    secondaryBackground: '#F8F9FA',
    cardBackground: '#F8F9FA',
    
    // Text colors
    text: '#000000',
    secondaryText: '#666666',
    placeholder: '#999999',
    
    // Primary colors
    primary: '#0078D4',
    primaryLight: '#E6F0FA',
    
    // UI elements
    border: '#E5E5E5',
    separator: '#E5E5E5',
    shadow: '#000000',
    
    // Status colors
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF3B30',
    
    // Tab bar
    tabBarBackground: 'rgba(255, 255, 255, 0.95)',
    tabBarActive: '#0078D4',
    tabBarInactive: '#999999',
  },
  dark: {
    // Background colors
    background: '#000000',
    secondaryBackground: '#1C1C1E',
    cardBackground: '#1C1C1E',
    
    // Text colors
    text: '#FFFFFF',
    secondaryText: '#AAAAAA',
    placeholder: '#777777',
    
    // Primary colors
    primary: '#0A84FF',
    primaryLight: '#1C2C3A',
    
    // UI elements
    border: '#333333',
    separator: '#333333',
    shadow: '#000000',
    
    // Status colors
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    
    // Tab bar
    tabBarBackground: 'rgba(28, 28, 30, 0.95)',
    tabBarActive: '#0A84FF',
    tabBarInactive: '#8E8E93',
  },
};

// Define theme styles for different components
export const ThemeStyles = {
  light: {
    container: {
      backgroundColor: Colors.light.background,
    },
    text: {
      color: Colors.light.text,
    },
    secondaryText: {
      color: Colors.light.secondaryText,
    },
    card: {
      backgroundColor: Colors.light.cardBackground,
      borderRadius: 12,
    },
    tabBar: {
      backgroundColor: Colors.light.tabBarBackground,
      backdropFilter: 'blur(20px)',
      borderTopWidth: 0,
      borderTopColor: 'transparent',
      elevation: 20,
      shadowColor: Colors.light.shadow,
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
    },
  },
  dark: {
    container: {
      backgroundColor: Colors.dark.background,
    },
    text: {
      color: Colors.dark.text,
    },
    secondaryText: {
      color: Colors.dark.secondaryText,
    },
    card: {
      backgroundColor: Colors.dark.cardBackground,
      borderRadius: 12,
    },
    tabBar: {
      backgroundColor: Colors.dark.tabBarBackground,
      backdropFilter: 'blur(20px)',
      borderTopWidth: 0,
      borderTopColor: 'transparent',
      elevation: 20,
      shadowColor: Colors.dark.shadow,
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
    },
  },
};

export type ThemeColors = typeof Colors.light & typeof Colors.dark;