import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  Alert,
  PanResponder,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Camera as CameraIcon, 
  FlashlightOff as FlashOff, 
  Slash as Flash, 
  RotateCcw, 
  Image as ImageIcon, 
  Zap,
  Sparkles,
  Circle,
  ScanText
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState<'sign' | 'text'>('sign');
  
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const captureButtonScale = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const modeSwipeAnim = useRef(new Animated.Value(0)).current;
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const scanOverlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous pulse animation for capture button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  // Pan responder for mode switching
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderMove: (_, gestureState) => {
      const progress = Math.max(0, Math.min(1, gestureState.dx / 100));
      modeSwipeAnim.setValue(progress);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        switchMode();
      } else {
        Animated.spring(modeSwipeAnim, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (Platform.OS !== 'web') {
      const hapticType = type === 'light' 
        ? Haptics.ImpactFeedbackStyle.Light
        : type === 'heavy' 
        ? Haptics.ImpactFeedbackStyle.Heavy
        : Haptics.ImpactFeedbackStyle.Medium;
      
      Haptics.impactAsync(hapticType);
    }
  };

  const switchMode = () => {
    triggerHaptic('light');
    setCaptureMode(prev => prev === 'sign' ? 'text' : 'sign');
    
    Animated.parallel([
      Animated.spring(modeSwipeAnim, {
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.timing(scanOverlayAnim, {
        toValue: captureMode === 'sign' ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCapture = async () => {
    if (isCapturing) return;

    try {
      setIsCapturing(true);
      triggerHaptic('heavy');

      // Advanced capture animation
      Animated.sequence([
        Animated.parallel([
          Animated.timing(captureButtonScale, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(flashAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(controlsOpacity, {
            toValue: 0.3,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(captureButtonScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(flashAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(controlsOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Simulate capture success
      setTimeout(() => {
        Alert.alert(
          captureMode === 'sign' ? '📸 Sign Detected!' : '📄 Text Captured!',
          captureMode === 'sign' 
            ? 'Street sign detected. Transliteration will appear in the Translator tab.' 
            : 'Text captured. Transliteration will appear in the Translator tab.',
          [{ text: 'View Result', style: 'default' }]
        );
      }, 300);

    } catch (error) {
      Alert.alert('Error', 'Failed to capture. Please try again.');
    } finally {
      setTimeout(() => setIsCapturing(false), 500);
    }
  };

  const handleGalleryUpload = async () => {
    try {
      triggerHaptic('light');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!result.canceled) {
        Alert.alert('✨ Image Loaded!', 'Your image has been processed for transliteration.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access gallery.');
    }
  };

  const toggleCameraFacing = () => {
    triggerHaptic('light');
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
    
    // Rotation animation effect
    Animated.sequence([
      Animated.timing(controlsOpacity, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleFlash = () => {
    triggerHaptic('light');
    setFlash(!flash);
    
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#0078D4', '#0B3D91']}
          style={styles.loadingGradient}
        >
          <Animated.View style={[styles.loadingSpinner, { transform: [{ rotate: '0deg' }] }]}>
            <Sparkles size={32} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.loadingText}>Initializing Camera...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={['#F8F9FA', '#FFFFFF']} style={styles.permissionContainer}>
        <BlurView intensity={20} style={styles.permissionCard}>
          <View style={styles.permissionIconContainer}>
            <CameraIcon size={48} color="#0078D4" strokeWidth={1.5} />
            <View style={styles.permissionIconBadge}>
              <Zap size={16} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            Enable camera access to detect street signs and transliterate Indian scripts.
          </Text>
          
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0078D4', '#0B3D91']}
              style={styles.permissionButtonGradient}
            >
              <Text style={styles.permissionButtonText}>Enable Camera</Text>
              <Sparkles size={16} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <CameraView
        style={styles.camera}
        facing={facing}
        flash={flash ? 'on' : 'off'}
      >
        {/* Flash overlay */}
        <Animated.View
          style={[
            styles.flashOverlay,
            {
              opacity: flashAnim,
            },
          ]}
        />

        {/* Sign detection overlay */}
        {captureMode === 'sign' && (
          <Animated.View
            style={[
              styles.scanOverlay,
              {
                opacity: scanOverlayAnim,
              },
            ]}
          >
            <View style={styles.scanFrame}>
              <View style={[styles.scanCorner, styles.scanCornerTL]} />
              <View style={[styles.scanCorner, styles.scanCornerTR]} />
              <View style={[styles.scanCorner, styles.scanCornerBL]} />
              <View style={[styles.scanCorner, styles.scanCornerBR]} />
            </View>
            <Text style={styles.scanText}>Point at street signs or public text</Text>
            <Text style={styles.scanSubtext}>Scriptsetu will detect and transliterate Indian scripts</Text>
          </Animated.View>
        )}

        {/* Text capture overlay */}
        {captureMode === 'text' && (
          <Animated.View
            style={[
              styles.textOverlay,
              {
                opacity: scanOverlayAnim,
              },
            ]}
          >
            <View style={styles.textFrame}>
              <View style={[styles.textCorner, styles.textCornerTL]} />
              <View style={[styles.textCorner, styles.textCornerTR]} />
              <View style={[styles.textCorner, styles.textCornerBL]} />
              <View style={[styles.textCorner, styles.textCornerBR]} />
            </View>
            <Text style={styles.scanText}>Capture any text for transliteration</Text>
            <Text style={styles.scanSubtext}>Supports all Indian scripts</Text>
          </Animated.View>
        )}

        {/* Top Controls */}
        <Animated.View
          style={[
            styles.topControls,
            { opacity: controlsOpacity },
          ]}
        >
          <BlurView intensity={20} style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.controlButton, flash && styles.activeControl]}
              onPress={toggleFlash}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={flash ? ['#0078D4', '#0B3D91'] : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.controlButtonGradient}
              >
                {flash ? (
                  <Flash size={20} color="#FFFFFF" strokeWidth={2} />
                ) : (
                  <FlashOff size={20} color="#FFFFFF" strokeWidth={2} />
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCameraFacing}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.controlButtonGradient}
              >
                <RotateCcw size={20} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>

        {/* Mode Selector */}
        <View style={styles.modeSelector} {...panResponder.panHandlers}>
          <BlurView intensity={20} style={styles.modeSelectorContainer}>
            <TouchableOpacity
              style={[styles.modeButton, captureMode === 'sign' && styles.activeModeButton]}
              onPress={() => captureMode !== 'sign' && switchMode()}
              activeOpacity={0.8}
            >
              <ScanText size={16} color={captureMode === 'sign' ? '#FFFFFF' : 'rgba(255,255,255,0.7)'} />
              <Text style={[styles.modeText, captureMode === 'sign' && styles.activeModeText]}>
                Sign Detection
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, captureMode === 'text' && styles.activeModeButton]}
              onPress={() => captureMode !== 'text' && switchMode()}
              activeOpacity={0.8}
            >
              <Text style={[styles.modeText, captureMode === 'text' && styles.activeModeText]}>
                Text Capture
              </Text>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Bottom Controls */}
        <Animated.View
          style={[
            styles.bottomControls,
            { opacity: controlsOpacity },
          ]}
        >
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handleGalleryUpload}
            activeOpacity={0.8}
          >
            <BlurView intensity={20} style={styles.galleryButtonBlur}>
              <ImageIcon size={24} color="#FFFFFF" strokeWidth={2} />
            </BlurView>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.captureButtonContainer,
              {
                transform: [
                  { scale: captureButtonScale },
                  { scale: pulseAnim },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
              disabled={isCapturing}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={isCapturing ? ['#666666', '#444444'] : ['#0078D4', '#0B3D91']}
                style={styles.captureButtonGradient}
              >
                <View style={styles.captureButtonInner}>
                  {isCapturing ? (
                    <Animated.View style={styles.processingIndicator}>
                      <Circle size={20} color="#FFFFFF" strokeWidth={3} />
                    </Animated.View>
                  ) : (
                    <CameraIcon size={28} color="#FFFFFF" strokeWidth={2.5} />
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.placeholder} />
        </Animated.View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  permissionIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  permissionIconBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0078D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0078D4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  permissionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 5,
  },
  scanFrame: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8 * 1.4,
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#0078D4',
    borderWidth: 3,
  },
  scanCornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  scanCornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  scanCornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  scanCornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 5,
  },
  textFrame: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.4,
    position: 'relative',
  },
  textCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#0078D4',
    borderWidth: 2,
  },
  textCornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  textCornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  textCornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  textCornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
  },
  scanSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  topControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 24,
    right: 24,
    zIndex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 8,
  },
  controlButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  controlButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControl: {
    shadowColor: '#0078D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  modeSelector: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : 120,
    left: '50%',
    transform: [{ translateX: -100 }],
    zIndex: 1,
  },
  modeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 4,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  activeModeButton: {
    backgroundColor: 'rgba(0, 120, 212, 0.8)',
  },
  modeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  activeModeText: {
    color: '#FFFFFF',
  },
  bottomControls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  galleryButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  galleryButtonBlur: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#0078D4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingIndicator: {
    transform: [{ rotate: '45deg' }],
  },
  placeholder: {
    width: 56,
    height: 56,
  },
});