
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function IndexScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log('Checking login status...');
    // Simulate checking for existing login/office membership
    setTimeout(() => {
      // For now, always show login screen
      // In a real app, you'd check AsyncStorage or similar
      setIsLoggedIn(false);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateOffice = () => {
    console.log('Navigating to create office');
    router.push('/create-office');
  };

  const handleJoinOffice = () => {
    console.log('Navigating to join office');
    router.push('/join-office');
  };

  const handleSkipLogin = () => {
    console.log('Skipping login - going to dashboard');
    Alert.alert(
      'Demo Mode',
      'You are entering demo mode. In a real app, you would need to create or join an office.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => router.replace('/dashboard')
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.title}>Buziz</Text>
          <Text style={commonStyles.textSecondary}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoggedIn) {
    router.replace('/dashboard');
    return null;
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="business" size={60} color={colors.primary} />
          </View>
          <Text style={commonStyles.title}>Welcome to Buziz</Text>
          <Text style={[commonStyles.textSecondary, styles.subtitle]}>
            Your lightweight business control panel for managing shifts, tasks, inventory, and team communication.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.optionCard}>
            <Icon name="add-circle-outline" size={32} color={colors.primary} />
            <Text style={styles.optionTitle}>Create New Office</Text>
            <Text style={styles.optionDescription}>
              Start fresh by creating a new office. You'll become the office creator and receive a unique code to invite team members.
            </Text>
            <Button
              text="Create Office"
              onPress={handleCreateOffice}
              variant="primary"
              style={styles.optionButton}
            />
          </View>

          <View style={styles.optionCard}>
            <Icon name="people-outline" size={32} color={colors.primary} />
            <Text style={styles.optionTitle}>Join Existing Office</Text>
            <Text style={styles.optionDescription}>
              Have an office code? Join your team's existing office and start collaborating immediately.
            </Text>
            <Button
              text="Join Office"
              onPress={handleJoinOffice}
              variant="secondary"
              style={styles.optionButton}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            text="Demo Mode"
            onPress={handleSkipLogin}
            variant="outline"
            style={styles.demoButton}
          />
          <Text style={[commonStyles.textSecondary, styles.demoText]}>
            Skip setup and explore the app
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center' as const,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 24,
  },
  subtitle: {
    textAlign: 'center' as const,
    marginTop: 8,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  optionCard: {
    ...commonStyles.card,
    alignItems: 'center' as const,
    padding: 24,
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
    marginBottom: 20,
  },
  optionButton: {
    width: '100%',
  },
  footer: {
    alignItems: 'center' as const,
    paddingVertical: 20,
  },
  demoButton: {
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    textAlign: 'center' as const,
  },
};
