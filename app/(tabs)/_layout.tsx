import { Tabs } from 'expo-router';
import { Camera, FileText, User } from 'lucide-react-native';
import { StyleSheet, Platform, Animated, View } from 'react-native';
import { useRef, useEffect } from 'react';
import { useTheme } from '../../app/utils/ThemeContext';
import { Colors, ThemeStyles } from '../../app/utils/theme';

export default function TabLayout() {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle breathing animation for active tab
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    breathingAnimation.start();

    return () => breathingAnimation.stop();
  }, []);

  const themedStyles = {
    tabBar: {
      ...ThemeStyles[theme].tabBar,
      height: Platform.OS === 'ios' ? 88 : 60,
      paddingTop: 12,
      paddingBottom: Platform.OS === 'ios' ? 24 : 8,
      position: 'absolute' as const,
    }
  };

  // Helper to determine if dark mode is active
  const isDarkMode = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDarkMode ? Colors.dark.tabBarActive : Colors.light.tabBarActive,
        tabBarInactiveTintColor: isDarkMode ? Colors.dark.tabBarInactive : Colors.light.tabBarInactive,
        tabBarStyle: themedStyles.tabBar,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 6,
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 8,
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ size, color, focused }) => (
            <Animated.View
              style={[
                {
                  transform: [{ scale: focused ? scaleAnim : 1 }],
                  backgroundColor: focused ? (isDarkMode ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 120, 212, 0.1)') : 'transparent',
                  borderRadius: 12,
                  padding: 8,
                },
              ]}
            >
              <Camera
                size={focused ? size + 4 : size}
                color={color}
                strokeWidth={focused ? 3 : 2}
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="translator"
        options={{
          title: 'Translator',
          tabBarIcon: ({ size, color, focused }) => (
            <Animated.View
              style={[
                {
                  transform: [{ scale: focused ? scaleAnim : 1 }],
                  backgroundColor: focused ? (isDarkMode ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 120, 212, 0.1)') : 'transparent',
                  borderRadius: 12,
                  padding: 8,
                },
              ]}
            >
              <FileText
                size={focused ? size + 4 : size}
                color={color}
                strokeWidth={focused ? 3 : 2}
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color, focused }) => (
            <Animated.View
              style={[
                {
                  transform: [{ scale: focused ? scaleAnim : 1 }],
                  backgroundColor: focused ? (isDarkMode ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 120, 212, 0.1)') : 'transparent',
                  borderRadius: 12,
                  padding: 8,
                },
              ]}
            >
              <User
                size={focused ? size + 4 : size}
                color={color}
                strokeWidth={focused ? 3 : 2}
              />
            </Animated.View>
          ),
        }}
      />
    </Tabs>
  );
}