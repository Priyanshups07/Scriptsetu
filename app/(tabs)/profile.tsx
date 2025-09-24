import { useState, useRef } from 'react';
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
  Modal,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { User, Mail, Settings, Moon, Sun, LogOut, Camera, FileText, CreditCard as Edit3, ChevronRight, Languages, Heart } from 'lucide-react-native';
import { useTheme } from '../../app/utils/ThemeContext';
import { Colors, ThemeStyles } from '../../app/utils/theme';

interface SavedItem {
  id: string;
  type: 'sign' | 'text';
  content: string;
  timestamp: Date;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  unread?: boolean;
}

interface FavoriteScriptItem {
  id: string;
  title: string;
  description: string;
  pair: string; // e.g., "Hindi → Malayalam"
}

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  // Helper function to determine if dark mode is active
  const isDarkMode = theme === 'dark';
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const isWide = width >= 768;
  const [savedItems] = useState<SavedItem[]>([
    {
      id: '1',
      type: 'sign',
      content: 'Street sign transliteration: Punjabi to Tamil',
      timestamp: new Date('2024-12-15'),
    },
    {
      id: '2',
      type: 'text',
      content: 'Document transliteration: Hindi to Malayalam',
      timestamp: new Date('2024-12-14'),
    },
    {
      id: '3',
      type: 'sign',
      content: 'Road sign transliteration: Bengali to Telugu',
      timestamp: new Date('2024-12-13'),
    },
  ]);

  const avatarBounce = useRef(new Animated.Value(1)).current;
  const editButtonScale = useRef(new Animated.Value(1)).current;

  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Welcome to Scriptsetu',
      body: 'Thanks for joining! Start by translating a sign or text.',
      timestamp: new Date('2024-12-12'),
      unread: true,
    },
    {
      id: 'n2',
      title: 'Feature Update',
      body: 'We added support for two more Indic scripts.',
      timestamp: new Date('2024-12-14'),
    },
    {
      id: 'n3',
      title: 'Tips & Tricks',
      body: 'Use the camera tab for instant on-the-go transliteration.',
      timestamp: new Date('2024-12-15'),
    },
  ]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [favModalVisible, setFavModalVisible] = useState(false);
  const [favorites] = useState<FavoriteScriptItem[]>([
    {
      id: 'f1',
      title: 'Street Boards Pack',
      description: 'Common street board phrases for travel assistance.',
      pair: 'Punjabi → Tamil',
    },
    {
      id: 'f2',
      title: 'Official Docs Preset',
      description: 'Formal terms for documents and IDs.',
      pair: 'Hindi → Malayalam',
    },
    {
      id: 'f3',
      title: 'Highway Signs',
      description: 'Highway and navigation signage keywords.',
      pair: 'Bengali → Telugu',
    },
  ]);
  const [selectedFavorite, setSelectedFavorite] = useState<FavoriteScriptItem | null>(null);

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

  const handleToggleDarkMode = (value: boolean) => {
    triggerHaptic();
    toggleTheme();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Theme-based styles
  const themedStyles = {
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
    },
    userName: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: isDarkMode ? Colors.dark.text : Colors.light.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: isDarkMode ? Colors.dark.secondaryText : Colors.light.secondaryText,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: isDarkMode ? Colors.dark.text : Colors.light.text,
      marginBottom: 16,
    },
    settingText: {
      fontSize: 16,
      color: isDarkMode ? Colors.dark.text : Colors.light.text,
      fontWeight: '500' as const,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: isDarkMode ? Colors.dark.text : Colors.light.text,
      marginTop: 8,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: isDarkMode ? Colors.dark.secondaryText : Colors.light.secondaryText,
      fontWeight: '500' as const,
    },
    activityText: {
      fontSize: 14,
      color: isDarkMode ? Colors.dark.text : Colors.light.text,
      fontWeight: '500' as const,
      marginBottom: 4,
      lineHeight: 20,
    },
    activityDate: {
      fontSize: 12,
      color: isDarkMode ? Colors.dark.secondaryText : Colors.light.secondaryText,
    },
    logoutText: {
      color: isDarkMode ? Colors.dark.error : Colors.light.error,
      fontSize: 16,
      fontWeight: '600' as const,
    },
  };

    return (
    <View style={themedStyles.container}>
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
              style={[
                styles.avatar,
                {
                  backgroundColor: isDarkMode ? Colors.dark.primaryLight : Colors.light.primaryLight,
                  borderColor: isDarkMode ? Colors.dark.primary : Colors.light.primary,
                }
              ]}
              onPress={animateAvatar}
              activeOpacity={0.8}
            >
              <User size={48} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} strokeWidth={2} />
            </TouchableOpacity>
            <View 
              style={[
                styles.avatarBadge,
                {
                  backgroundColor: isDarkMode ? Colors.dark.primary : Colors.light.primary,
                  borderColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                }
              ]}
            >
              <Languages size={16} color={theme === 'light' ? '#FFFFFF' : '#FFFFFF'} />
            </View>
          </Animated.View>

          <Text style={themedStyles.userName}>Scriptsetu User</Text>
          <Text style={themedStyles.userEmail}>user@scriptsetu.in</Text>

          <Animated.View
            style={[
              styles.editButtonContainer,
              { transform: [{ scale: editButtonScale }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.editButton,
                {
                  backgroundColor: isDarkMode ? Colors.dark.primaryLight : Colors.light.primaryLight,
                }
              ]}
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              <Edit3 size={16} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
              <Text 
                style={[
                  styles.editButtonText,
                  {
                    color: isDarkMode ? Colors.dark.primary : Colors.light.primary,
                  }
                ]}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Information Section - Responsive with dummy information */}
        <View 
          style={[
            styles.infoSection,
            {
              backgroundColor: isDarkMode ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground,
            }
          ]}
        >
          <Text style={themedStyles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <View style={[styles.infoIcon, { backgroundColor: isDarkMode ? Colors.dark.primaryLight : Colors.light.primaryLight }]}>
                  <Languages size={20} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
                </View>
              </View>
              <Text style={themedStyles.statNumber}>12</Text>
              <Text style={themedStyles.statLabel}>Supported Scripts</Text>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <View style={[styles.infoIcon, { backgroundColor: isDarkMode ? Colors.dark.primaryLight : Colors.light.primaryLight }]}>
                  <Camera size={20} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
                </View>
              </View>
              <Text style={themedStyles.statNumber}>24</Text>
              <Text style={themedStyles.statLabel}>Signs Translated</Text>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <View style={[styles.infoIcon, { backgroundColor: isDarkMode ? Colors.dark.primaryLight : Colors.light.primaryLight }]}>
                  <FileText size={20} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
                </View>
              </View>
              <Text style={themedStyles.statNumber}>16</Text>
              <Text style={themedStyles.statLabel}>Texts Processed</Text>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <View style={[styles.infoIcon, { backgroundColor: isDarkMode ? Colors.dark.primaryLight : Colors.light.primaryLight }]}>
                  <Heart size={20} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
                </View>
              </View>
              <Text style={themedStyles.statNumber}>8</Text>
              <Text style={themedStyles.statLabel}>Favorites</Text>
            </View>
          </View>
          
          <View 
            style={[
              styles.infoDetails,
              {
                borderTopColor: isDarkMode ? Colors.dark.separator : Colors.light.separator,
              }
            ]}
          >
            <View style={styles.infoDetailRow}>
              <Text style={themedStyles.settingText}>Version</Text>
              <Text style={themedStyles.activityDate}>v1.2.0</Text>
            </View>
            <View style={styles.infoDetailRow}>
              <Text style={themedStyles.settingText}>Last Update</Text>
              <Text style={themedStyles.activityDate}>Dec 15, 2024</Text>
            </View>
            <View style={styles.infoDetailRow}>
              <Text style={themedStyles.settingText}>Storage Used</Text>
              <Text style={themedStyles.activityDate}>4.2 MB</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={themedStyles.sectionTitle}>Settings</Text>

          <View 
            style={[
              styles.settingItem,
              {
                backgroundColor: isDarkMode ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground,
              }
            ]}
          >
            <View style={styles.settingLeft}>
              {isDarkMode ? (
                <Moon size={20} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
              ) : (
                <Sun size={20} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
              )}
              <Text style={themedStyles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: isDarkMode ? Colors.dark.border : Colors.light.border, true: isDarkMode ? Colors.dark.primary : Colors.light.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.settingItem,
              {
                backgroundColor: isDarkMode ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground,
              }
            ]} 
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              setNotifModalVisible(true);
            }}
          >
            <View style={styles.settingLeft}>
              <Mail size={20} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
              <Text style={themedStyles.settingText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color={isDarkMode ? Colors.dark.placeholder : Colors.light.placeholder} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.settingItem,
              {
                backgroundColor: isDarkMode ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground,
              }
            ]} 
            activeOpacity={0.8}
          >
            <View style={styles.settingLeft}>
              <Heart size={20} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
              <Text style={themedStyles.settingText}>Favorite Scripts</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic();
                setSelectedFavorite(favorites[0]);
                setFavModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <ChevronRight size={20} color={isDarkMode ? Colors.dark.placeholder : Colors.light.placeholder} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={themedStyles.sectionTitle}>Recent Transliterations</Text>
          {savedItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.activityItem,
                {
                  backgroundColor: isDarkMode ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground,
                }
              ]}
              activeOpacity={0.8}
            >
              <View 
                style={[
                  styles.activityIcon,
                  {
                    backgroundColor: isDarkMode ? Colors.dark.primaryLight : Colors.light.primaryLight,
                  }
                ]}
              >
                {item.type === 'sign' ? (
                  <Camera size={16} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
                ) : (
                  <FileText size={16} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
                )}
              </View>
              <View style={styles.activityContent}>
                <Text style={themedStyles.activityText} numberOfLines={2}>
                  {item.content}
                </Text>
                <Text style={themedStyles.activityDate}>
                  {formatDate(item.timestamp)}
                </Text>
              </View>
              <ChevronRight size={16} color={isDarkMode ? Colors.dark.placeholder : Colors.light.placeholder} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications Modal */}
        <Modal
          transparent
          visible={notifModalVisible}
          animationType="slide"
          onRequestClose={() => setNotifModalVisible(false)}
        >
          <View style={styles.modalRoot}>
            <View style={styles.modalBackdrop} />
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: isDarkMode ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground,
                  width: isWide ? '75%' : '90%',
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[themedStyles.sectionTitle, { marginBottom: 0 }]}>Notifications</Text>
                <TouchableOpacity onPress={() => setNotifModalVisible(false)} activeOpacity={0.8}>
                  <Text style={{ color: isDarkMode ? Colors.dark.primary : Colors.light.primary, fontWeight: '600' }}>Close</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.modalBody, { flexDirection: isWide ? 'row' : 'column', gap: isWide ? 16 : 12 }]}>
                <ScrollView
                  style={[styles.modalList, { maxHeight: isWide ? 400 : 220 }]}
                  contentContainerStyle={{ paddingVertical: 4 }}
                  showsVerticalScrollIndicator={false}
                >
                  {notifications.map((n) => (
                    <TouchableOpacity
                      key={n.id}
                      onPress={() => setSelectedNotification(n)}
                      style={[
                        styles.modalListItem,
                        {
                          backgroundColor: isDarkMode ? Colors.dark.background : '#FFFFFF',
                          borderColor: isDarkMode ? Colors.dark.separator : Colors.light.separator,
                          paddingVertical: isCompact ? 10 : 12,
                          paddingHorizontal: isCompact ? 10 : 12,
                        },
                      ]}
                      activeOpacity={0.85}
                    >
                      <View style={[styles.notificationDot, { backgroundColor: n.unread ? (isDarkMode ? Colors.dark.primary : Colors.light.primary) : (isDarkMode ? Colors.dark.border : Colors.light.border) }]} />
                      <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={{ color: isDarkMode ? Colors.dark.text : Colors.light.text, fontWeight: '700', fontSize: isCompact ? 14 : 15 }}>
                          {n.title}
                        </Text>
                        <Text numberOfLines={1} style={{ color: isDarkMode ? Colors.dark.secondaryText : Colors.light.secondaryText, fontSize: isCompact ? 12 : 13 }}>
                          {formatDate(n.timestamp)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={[styles.modalDetails, { minHeight: isWide ? 400 : undefined }] }>
                  {selectedNotification ? (
                    <View>
                      <Text style={{ color: isDarkMode ? Colors.dark.text : Colors.light.text, fontWeight: '700', fontSize: isCompact ? 16 : 18, marginBottom: 6 }}>
                        {selectedNotification.title}
                      </Text>
                      <Text style={{ color: isDarkMode ? Colors.dark.secondaryText : Colors.light.secondaryText, fontSize: isCompact ? 13 : 15, lineHeight: isCompact ? 18 : 20, marginBottom: 8 }}>
                        {selectedNotification.body}
                      </Text>
                      <Text style={{ color: isDarkMode ? Colors.dark.placeholder : Colors.light.placeholder, fontSize: 12 }}>
                        {formatDate(selectedNotification.timestamp)}
                      </Text>
                    </View>
                  ) : (
                    <Text style={{ color: isDarkMode ? Colors.dark.placeholder : Colors.light.placeholder }}>
                      Select a notification to view details
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Favorites Modal */}
        <Modal
          transparent
          visible={favModalVisible}
          animationType="slide"
          onRequestClose={() => setFavModalVisible(false)}
        >
          <View style={styles.modalRoot}>
            <View style={styles.modalBackdrop} />
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: isDarkMode ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground,
                  width: isWide ? '75%' : '90%',
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[themedStyles.sectionTitle, { marginBottom: 0 }]}>Favorite Scripts</Text>
                <TouchableOpacity onPress={() => setFavModalVisible(false)} activeOpacity={0.8}>
                  <Text style={{ color: isDarkMode ? Colors.dark.primary : Colors.light.primary, fontWeight: '600' }}>Close</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.modalBody, { flexDirection: isWide ? 'row' : 'column', gap: isWide ? 16 : 12 }]}>
                <ScrollView
                  style={[styles.modalList, { maxHeight: isWide ? 400 : 220 }]}
                  contentContainerStyle={{ paddingVertical: 4 }}
                  showsVerticalScrollIndicator={false}
                >
                  {favorites.map((f) => (
                    <TouchableOpacity
                      key={f.id}
                      onPress={() => setSelectedFavorite(f)}
                      style={[
                        styles.modalListItem,
                        {
                          backgroundColor: isDarkMode ? Colors.dark.background : '#FFFFFF',
                          borderColor: isDarkMode ? Colors.dark.separator : Colors.light.separator,
                          paddingVertical: isCompact ? 10 : 12,
                          paddingHorizontal: isCompact ? 10 : 12,
                        },
                      ]}
                      activeOpacity={0.85}
                    >
                      <Heart size={14} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
                      <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={{ color: isDarkMode ? Colors.dark.text : Colors.light.text, fontWeight: '700', fontSize: isCompact ? 14 : 15 }}>
                          {f.title}
                        </Text>
                        <Text numberOfLines={1} style={{ color: isDarkMode ? Colors.dark.secondaryText : Colors.light.secondaryText, fontSize: isCompact ? 12 : 13 }}>
                          {f.pair}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={[styles.modalDetails, { minHeight: isWide ? 400 : undefined }] }>
                  {selectedFavorite ? (
                    <View>
                      <Text style={{ color: isDarkMode ? Colors.dark.text : Colors.light.text, fontWeight: '700', fontSize: isCompact ? 16 : 18, marginBottom: 6 }}>
                        {selectedFavorite.title}
                      </Text>
                      <Text style={{ color: isDarkMode ? Colors.dark.secondaryText : Colors.light.secondaryText, fontSize: isCompact ? 13 : 15, lineHeight: isCompact ? 18 : 20, marginBottom: 8 }}>
                        {selectedFavorite.description}
                      </Text>
                      <Text style={{ color: isDarkMode ? Colors.dark.placeholder : Colors.light.placeholder, fontSize: 12 }}>
                        {selectedFavorite.pair}
                      </Text>
                    </View>
                  ) : (
                    <Text style={{ color: isDarkMode ? Colors.dark.placeholder : Colors.light.placeholder }}>
                      Select a favorite script to view details
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Logout */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: isDarkMode ? '#2C1C1C' : '#FFF5F5',
              borderColor: isDarkMode ? '#4A2D2D' : '#FFE5E5',
            }
          ]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={20} color={isDarkMode ? Colors.dark.error : Colors.light.error} />
          <Text style={themedStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  editButtonContainer: {
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
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
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activitySection: {
    marginBottom: 32,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalBody: {
  },
  modalList: {
    flex: 1,
  },
  modalListItem: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalDetails: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  infoSection: {
    marginBottom: 32,
    borderRadius: 16,
    padding: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoCard: {
    width: '48%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoIconContainer: {
    marginBottom: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoDetails: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  infoDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});