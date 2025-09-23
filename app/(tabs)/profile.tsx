import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Animated,
  Alert,
  Switch,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { User, Mail, Settings, Moon, Sun, LogOut, Camera, FileText, CreditCard as Edit3, ChevronRight } from 'lucide-react-native';

interface SavedItem {
  id: string;
  type: 'camera' | 'text';
  content: string;
  timestamp: Date;
}

export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [savedItems] = useState<SavedItem[]>([
    {
      id: '1',
      type: 'camera',
      content: 'Photo captured on Dec 15, 2024',
      timestamp: new Date('2024-12-15'),
    },
    {
      id: '2',
      type: 'text',
      content: 'Meeting notes: Discussed project timeline and deliverables...',
      timestamp: new Date('2024-12-14'),
    },
    {
      id: '3',
      type: 'camera',
      content: 'Document scan - Invoice #12345',
      timestamp: new Date('2024-12-13'),
    },
  ]);

  const avatarBounce = useRef(new Animated.Value(1)).current;
  const editButtonScale = useRef(new Animated.Value(1)).current;

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const animateAvatar = () => {
    Animated.sequence([
      Animated.timing(avatarBounce, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(avatarBounce, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateButton = (scale: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleEditProfile = () => {
    triggerHaptic();
    animateButton(editButtonScale);
    animateAvatar();
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleLogout = () => {
    triggerHaptic();
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const toggleDarkMode = (value: boolean) => {
    triggerHaptic();
    setIsDarkMode(value);
    Alert.alert('Theme', `${value ? 'Dark' : 'Light'} mode will be applied.`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Animated.View
            style={[
              styles.avatarContainer,
              { transform: [{ scale: avatarBounce }] },
            ]}
          >
            <TouchableOpacity
              style={styles.avatar}
              onPress={animateAvatar}
              activeOpacity={0.8}
            >
              <User size={48} color="#0078D4" strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.avatarBadge}>
              <Camera size={16} color="#FFFFFF" />
            </View>
          </Animated.View>

          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>

          <Animated.View
            style={[
              styles.editButtonContainer,
              { transform: [{ scale: editButtonScale }] },
            ]}
          >
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              <Edit3 size={16} color="#0078D4" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Camera size={20} color="#0078D4" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <FileText size={20} color="#0078D4" />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Texts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Settings size={20} color="#0078D4" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Settings</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              {isDarkMode ? (
                <Moon size={20} color="#0078D4" />
              ) : (
                <Sun size={20} color="#0078D4" />
              )}
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#E5E5E5', true: '#0078D4' }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
            <View style={styles.settingLeft}>
              <Mail size={20} color="#0078D4" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
            <View style={styles.settingLeft}>
              <Settings size={20} color="#0078D4" />
              <Text style={styles.settingText}>Preferences</Text>
            </View>
            <ChevronRight size={20} color="#999999" />
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {savedItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.activityItem}
              activeOpacity={0.8}
            >
              <View style={styles.activityIcon}>
                {item.type === 'camera' ? (
                  <Camera size={16} color="#0078D4" />
                ) : (
                  <FileText size={16} color="#0078D4" />
                )}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText} numberOfLines={2}>
                  {item.content}
                </Text>
                <Text style={styles.activityDate}>
                  {formatDate(item.timestamp)}
                </Text>
              </View>
              <ChevronRight size={16} color="#999999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F0FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#0078D4',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0078D4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  editButtonContainer: {
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E6F0FA',
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    color: '#0078D4',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
  settingsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  activitySection: {
    marginBottom: 32,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F0FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 20,
  },
  activityDate: {
    fontSize: 12,
    color: '#666666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    gap: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});