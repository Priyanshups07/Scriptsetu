import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SplashScreen from '../components/SplashScreen';

export default function SplashScreenDemo() {
  const [showSplash, setShowSplash] = React.useState(true);

  const handleAnimationComplete = () => {
    // In demo, we just hide the splash and show a message
    setShowSplash(false);
  };

  const resetDemo = () => {
    setShowSplash(true);
  };

  if (showSplash) {
    return <SplashScreen onAnimationComplete={handleAnimationComplete} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Splash Screen Demo</Text>
      <Text style={styles.description}>
        The splash screen animation has completed successfully!
      </Text>
      <TouchableOpacity style={styles.button} onPress={resetDemo}>
        <Text style={styles.buttonText}>Replay Animation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});