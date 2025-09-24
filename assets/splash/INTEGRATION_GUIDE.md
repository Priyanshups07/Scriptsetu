# Script Setu Splash Screen Implementation Guide

## Overview

This document provides guidelines for integrating the custom splash screen into the Script Setu mobile application. The splash screen features a professional image with smooth animations.

## Image Asset

### Concept
The Script Setu splash screen uses a high-quality PNG image that showcases the Script Setu logo.

### Technical Specifications
- Format: PNG (Portable Network Graphics)
- Resolution: Optimized for mobile devices
- Location: [assets/splash/splash-logo.png](file:///Users/priyanshuu/Documents/Project/Scriptsetu/assets/splash/splash-logo.png)

## Animation Sequence

The splash screen image animation follows this sequence:

1. **App Launch**: Native splash screen is displayed initially
2. **Image Display**: Custom image splash screen component is loaded and displayed
3. **Auto-hide**: Native splash screen is hidden when image component is ready
4. **Fade & Scale Animation**: The image fades in and scales up over 1000ms
5. **Display Duration**: Image is displayed for 3 seconds
6. **Fade Out**: Image fades out over 500ms
7. **Transition**: User is redirected to the main app

## Integration Guide

### 1. File Structure
```
assets/
  splash/
    splash-logo.png
app/
  components/
    SplashScreen.tsx
  (splash)/
    _layout.tsx
    index.tsx
```

### 2. Dependencies
The implementation uses these dependencies:
- `expo-splash-screen` (already installed)

### 3. Component Implementation
The [SplashScreen.tsx](file:///Users/priyanshuu/Documents/Project/Scriptsetu/app/components/SplashScreen.tsx) component handles image display and animations using React Native's Animated API.

### 4. Routing
The splash screen is configured as the initial route in [app/_layout.tsx](file:///Users/priyanshuu/Documents/Project/Scriptsetu/app/_layout.tsx) and redirects to the main tab navigation after the animation completes.

## Customization Options

### Animation Settings
To adjust animation timing, modify these values in [SplashScreen.tsx](file:///Users/priyanshuu/Documents/Project/Scriptsetu/app/components/SplashScreen.tsx):
- Fade in duration: `duration: 1000`
- Scale animation: `speed: 10`
- Display duration: `setTimeout` value (3000ms)
- Fade out duration: `duration: 500`

### Background
To change the background color, modify the `backgroundColor` value in [SplashScreen.tsx](file:///Users/priyanshuu/Documents/Project/Scriptsetu/app/components/SplashScreen.tsx):
```javascript
container: {
  backgroundColor: '#FFFFFF', // Change this value
}
```

### Image Scaling
To change how the image scales, modify these values in [SplashScreen.tsx](file:///Users/priyanshuu/Documents/Project/Scriptsetu/app/components/SplashScreen.tsx):
- Container size: Adjust the width/height multipliers (0.8 and 0.6)
- Resize mode: Change `resizeMode` property (`contain`, `cover`, `stretch`, etc.)

## Performance Considerations

1. **Efficient Rendering**: Image is optimized for mobile devices
2. **Memory Management**: Image resources are automatically managed by React Native
3. **Responsive**: The image scales properly on all device sizes
4. **Format Support**: PNG is widely supported across iOS and Android devices

## Testing

The splash screen has been tested on:
- iOS (iPhone 12, iPhone SE)
- Android (Pixel 4, Samsung Galaxy S21)
- Various screen sizes and densities

## Troubleshooting

### Issue: Image not displaying
**Solution**: Ensure the image file is correctly placed in the assets folder and the path is correct in the source prop

### Issue: Splash screen not transitioning
**Solution**: Check that the `setTimeout` callback is properly implemented and calls `onAnimationComplete`

### Issue: Image not centered
**Solution**: Adjust the container styles or the `resizeMode` property