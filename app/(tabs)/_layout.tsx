import { Tabs } from 'expo-router';
import { Camera, FileText, User } from 'lucide-react-native';
import { StyleSheet, Platform, Animated } from 'react-native';
import { useRef, useEffect } from 'react';

export default function TabLayout() {
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

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0078D4',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          elevation: 20,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          position: 'absolute',
        },
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
                  backgroundColor: focused ? 'rgba(0, 120, 212, 0.1)' : 'transparent',
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
                  backgroundColor: focused ? 'rgba(0, 120, 212, 0.1)' : 'transparent',
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
                  backgroundColor: focused ? 'rgba(0, 120, 212, 0.1)' : 'transparent',
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