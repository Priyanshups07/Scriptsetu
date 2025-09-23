import React, { useState, useRef } from 'react';
import transliterator, { getScriptName } from '../utils/transliterator';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
  Alert,
  Dimensions,
  Clipboard,
  Modal,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Languages,
  Copy,
  RotateCcw,
  Sparkles,
  Zap,
  ScanText
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function TranslatorScreen() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceScript, setSourceScript] = useState('Devanagari');
  const [targetScript, setTargetScript] = useState('Tamil');
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  
  // Available Indian scripts
  const indianScripts = [
    'Devanagari (Hindi, Marathi, etc.)',
    'Bengali',
    'Tamil',
    'Telugu',
    'Malayalam',
    'Kannada',
    'Gujarati',
    'Punjabi (Gurmukhi)',
    'Oriya',
    'Assamese',
    'Urdu',
    'Sinhala'
  ];
  
  // Animation refs
  const translateButtonScale = useRef(new Animated.Value(1)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  const animateButton = (scale: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTransliterate = async () => {
    if (!inputText.trim()) {
      Alert.alert('No Text', 'Please enter text to transliterate.');
      return;
    }

    try {
      setIsTranslating(true);
      triggerHaptic('heavy');
      animateButton(translateButtonScale);

      // Simulate transliteration process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get actual script names
      const sourceScriptName = getScriptName(sourceScript);
      const targetScriptName = getScriptName(targetScript);

      // Use our transliteration function
      const result = transliterator.transliterateText(inputText, sourceScriptName, targetScriptName);
      
      setTranslatedText(result);
      
      // Animate result appearance
      Animated.timing(resultOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Alert.alert('✅ Transliteration Complete!', 'Your text has been transliterated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Transliteration failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = async () => {
    if (!translatedText.trim()) {
      Alert.alert('No Text', 'There is no transliterated text to copy.');
      return;
    }

    try {
      triggerHaptic('light');
      Clipboard.setString(translatedText);
      Alert.alert('📋 Copied!', 'Transliterated text has been copied to clipboard.');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy text.');
    }
  };

  const handleSwapScripts = () => {
    triggerHaptic('light');
    const temp = sourceScript;
    setSourceScript(targetScript);
    setTargetScript(temp);
    
    // If we have transliterated text, swap input and output
    if (translatedText) {
      const tempText = inputText;
      setInputText(translatedText);
      setTranslatedText(tempText);
    }
  };

  const handleClear = () => {
    triggerHaptic('light');
    setInputText('');
    setTranslatedText('');
    Animated.timing(resultOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Start pulse animation for transliterate button
  React.useEffect(() => {
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Languages size={32} stroke="#0078D4" strokeWidth={2} />
            <View style={styles.sparkleIcon}>
              <Sparkles size={16} stroke="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.headerTitle}>Script Transliterator</Text>
          <Text style={styles.headerSubtitle}>Transliterate between Indian scripts instantly</Text>
        </View>

        {/* Script Selector */}
        <View style={styles.languageSelectorContainer}>
          <View style={styles.languageColumn}>
            <Text style={styles.languageLabel}>From Script</Text>
            <TouchableOpacity 
              style={styles.languageDropdown}
              onPress={() => setShowSourceModal(true)}
            >
              <Text style={styles.languageText} numberOfLines={2}>{sourceScript}</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.swapButton}
            onPress={handleSwapScripts}
            activeOpacity={0.7}
          >
            <RotateCcw size={20} stroke="#0078D4" />
          </TouchableOpacity>
          
          <View style={styles.languageColumn}>
            <Text style={styles.languageLabel}>To Script</Text>
            <TouchableOpacity 
              style={styles.languageDropdown}
              onPress={() => setShowTargetModal(true)}
            >
              <Text style={styles.languageText} numberOfLines={2}>{targetScript}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Area */}
        <BlurView intensity={10} style={styles.inputContainer}>
          <LinearGradient
            colors={['rgba(248, 249, 250, 0.95)', 'rgba(255, 255, 255, 0.95)']}
            style={styles.inputGradient}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter text to transliterate..."
              placeholderTextColor="#999999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="top"
            />
            
            {inputText.length > 0 && (
              <View style={styles.inputActions}>
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={handleClear}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
                <Text style={styles.charCountText}>{inputText.length}</Text>
              </View>
            )}
          </LinearGradient>
        </BlurView>

        {/* Transliterate Button */}
        <Animated.View
          style={[
            styles.translateButtonContainer,
            { transform: [{ scale: translateButtonScale }, { scale: pulseAnim }] }
          ]}
        >
          <TouchableOpacity
            style={styles.translateButton}
            onPress={handleTransliterate}
            disabled={isTranslating}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isTranslating ? ['#666666', '#444444'] : ['#0078D4', '#0B3D91']}
              style={styles.translateButtonGradient}
            >
              <ScanText size={20} stroke="#FFFFFF" strokeWidth={2} />
              <Text style={styles.translateButtonText}>
                {isTranslating ? 'Transliterating...' : 'Transliterate'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Result Area */}
        <Animated.View 
          style={[
            styles.resultContainer, 
            { opacity: resultOpacity }
          ]}
        >
          <BlurView intensity={10} style={styles.resultBlur}>
            <LinearGradient
              colors={['rgba(248, 249, 250, 0.95)', 'rgba(255, 255, 255, 0.95)']}
              style={styles.resultGradient}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Transliteration</Text>
                {translatedText.length > 0 && (
                  <TouchableOpacity 
                    style={styles.copyButton}
                    onPress={handleCopy}
                    activeOpacity={0.7}
                  >
                    <Copy size={18} stroke="#0078D4" />
                  </TouchableOpacity>
                )}
              </View>
              
              {translatedText ? (
                <Text style={styles.resultText}>{translatedText}</Text>
              ) : (
                <Text style={styles.resultPlaceholder}>
                  {inputText ? 'Tap "Transliterate" to see the result' : 'Transliteration will appear here'}
                </Text>
              )}
            </LinearGradient>
          </BlurView>
        </Animated.View>
      </ScrollView>

      {/* Source Script Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSourceModal}
        onRequestClose={() => setShowSourceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Source Script</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowSourceModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {indianScripts.map((script) => (
                <TouchableOpacity
                  key={`source-${script}`}
                  style={[
                    styles.modalLanguageItem,
                    sourceScript === script && styles.modalLanguageItemSelected
                  ]}
                  onPress={() => {
                    setSourceScript(script);
                    setShowSourceModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalLanguageText,
                    sourceScript === script && styles.modalLanguageTextSelected
                  ]}>
                    {script}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Target Script Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTargetModal}
        onRequestClose={() => setShowTargetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Target Script</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowTargetModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {indianScripts.map((script) => (
                <TouchableOpacity
                  key={`target-${script}`}
                  style={[
                    styles.modalLanguageItem,
                    targetScript === script && styles.modalLanguageItemSelected
                  ]}
                  onPress={() => {
                    setTargetScript(script);
                    setShowTargetModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalLanguageText,
                    targetScript === script && styles.modalLanguageTextSelected
                  ]}>
                    {script}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    borderRadius: 20,
    padding: 24,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 120, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  sparkleIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  languageSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  languageColumn: {
    flex: 1,
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 8,
  },
  languageDropdown: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 120, 212, 0.1)',
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  languageText: {
    fontSize: 14,
    color: '#0078D4',
    fontWeight: '600',
    textAlign: 'center',
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 120, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },

  languageChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeLanguageChip: {
    backgroundColor: 'rgba(0, 120, 212, 0.1)',
  },
  languageChipText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeLanguageChipText: {
    color: '#0078D4',
    fontWeight: '600',
  },
  inputContainer: {
    borderRadius: 20,
    marginBottom: 32,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGradient: {
    padding: 24,
    minHeight: 200,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  charCountText: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
  translateButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#0078D4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  translateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  translateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
    position: 'relative',
  },
  translateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginBottom: 32,
  },
  resultBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  resultGradient: {
    padding: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 120, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  resultPlaceholder: {
    fontSize: 16,
    color: '#999999',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  languageOptions: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: screenWidth - 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 24,
    color: '#000000',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalLanguageItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    marginBottom: 8,
  },
  modalLanguageItemSelected: {
    backgroundColor: 'rgba(0, 120, 212, 0.1)',
  },
  modalLanguageText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  modalLanguageTextSelected: {
    color: '#0078D4',
    fontWeight: '600',
  },

});
