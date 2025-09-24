import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreenComponent: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide the native splash screen
    SplashScreen.hideAsync();
    
    // Start animations
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        speed: 10,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Complete animation and transition after 3 seconds
    setTimeout(() => {
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        onAnimationComplete();
      });
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.imageContainer, 
          {
            opacity: opacityValue,
            transform: [{ scale: scaleValue }],
          }
        ]}
      >
        <Image 
          source={require('../../assets/splash/splash-logo.png')} 
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreenComponent;