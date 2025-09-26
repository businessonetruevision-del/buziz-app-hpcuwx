
import React, { useState } from 'react';
import { Text, View, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function JoinOfficeScreen() {
  const [officeCode, setOfficeCode] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinOffice = async () => {
    if (!officeCode.trim() || !userName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call to verify office code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful join
      const employeeNumber = '#00003'; // This would be generated based on existing members
      
      Alert.alert(
        'Successfully Joined Office!',
        `Welcome to the team, ${userName}!\n\nYour Employee Number: ${employeeNumber}\n\nYou can now access the office dashboard and collaborate with your team.`,
        [
          {
            text: 'Continue',
            onPress: () => {
              console.log('Joined office:', { officeCode, userName, employeeNumber });
              router.replace('/dashboard');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Invalid office code or connection failed. Please try again.');
      console.log('Join office error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content}>
        <View style={{ paddingTop: 20 }}>
          <View style={[commonStyles.row, { marginBottom: 32 }]}>
            <Button
              text="← Back"
              onPress={() => router.back()}
              variant="outline"
              style={{ paddingHorizontal: 16, paddingVertical: 8 }}
            />
          </View>

          <Text style={commonStyles.title}>Join an Office</Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 32 }]}>
            Enter the office code provided by your manager to join the team
          </Text>

          <View style={commonStyles.section}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
              Office Code
            </Text>
            <TextInput
              style={[commonStyles.input, { textTransform: 'uppercase' }]}
              placeholder="Enter 6-character code"
              value={officeCode}
              onChangeText={(text) => setOfficeCode(text.toUpperCase())}
              maxLength={6}
              autoCapitalize="characters"
            />
          </View>

          <View style={commonStyles.section}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
              Your Name
            </Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter your full name"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="words"
            />
          </View>

          <View style={[commonStyles.card, { marginTop: 24 }]}>
            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <Icon name="people" size={20} color={colors.accent} />
              <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>
                Joining a Team
              </Text>
            </View>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
              • You&apos;ll be assigned an auto-generated employee number
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
              • Your role will be set by the office manager
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
              • You&apos;ll have access to shifts, tasks, and team communication
            </Text>
            <Text style={commonStyles.textSecondary}>
              • Permissions depend on your assigned role
            </Text>
          </View>

          <Button
            text={isLoading ? "Joining Office..." : "Join Office"}
            onPress={handleJoinOffice}
            disabled={isLoading}
            style={{ marginTop: 32, marginBottom: 40 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
