
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';

interface User {
  id: string;
  name: string;
  employeeNumber: string;
  role: string;
  isCreator: boolean;
  isHeadManager: boolean;
}

interface Office {
  id: string;
  name: string;
  code: string;
  creator: string;
  members: User[];
}

export default function WelcomeScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentOffice, setCurrentOffice] = useState<Office | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // If user is logged in and has an office, redirect to dashboard
  if (currentUser && currentOffice) {
    router.replace('/dashboard');
    return null;
  }

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

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.centerContent}>
        <View style={{ alignItems: 'center', marginBottom: 60 }}>
          <Text style={[commonStyles.title, { fontSize: 48, marginBottom: 16 }]}>
            Buziz
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontSize: 18 }]}>
            Lightweight Business Control Panel
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
            Manage shifts, tasks, inventory & more
          </Text>
        </View>

        <View style={{ width: '100%', maxWidth: 300 }}>
          <Button
            text="Create New Office"
            onPress={() => {
              console.log('Navigate to create office');
              router.push('/create-office');
            }}
            style={{ marginBottom: 16 }}
          />
          
          <Button
            text="Join Existing Office"
            onPress={() => {
              console.log('Navigate to join office');
              router.push('/join-office');
            }}
            style={{ marginBottom: 32 }}
            variant="secondary"
          />
        </View>

        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { fontSize: 16, marginBottom: 12 }]}>
            Features Include:
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Shift scheduling & management
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Task assignment & tracking
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Inventory & supplier management
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Staff directory & roles
          </Text>
          <Text style={commonStyles.textSecondary}>
            • Internal communication
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
