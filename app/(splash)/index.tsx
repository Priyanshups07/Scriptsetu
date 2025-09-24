import React, { useCallback } from 'react';
import { Redirect } from 'expo-router';
import SplashScreenComponent from '../components/SplashScreen';

export default function SplashIndex() {
  const [animationComplete, setAnimationComplete] = React.useState(false);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  // Redirect to tabs after animation completes
  if (animationComplete) {
    return <Redirect href="/(tabs)/camera" />;
  }

  return <SplashScreenComponent onAnimationComplete={handleAnimationComplete} />;
}