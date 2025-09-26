
import React, { useState } from 'react';
import { Text, View, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function CreateOfficeScreen() {
  const [officeName, setOfficeName] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateOfficeCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateOffice = async () => {
    if (!officeName.trim() || !userName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const officeCode = generateOfficeCode();
      
      Alert.alert(
        'Office Created Successfully!',
        `Your office "${officeName}" has been created.\n\nOffice Code: ${officeCode}\n\nShare this code with your team members so they can join your office.`,
        [
          {
            text: 'Continue',
            onPress: () => {
              console.log('Office created:', { officeName, userName, officeCode });
              router.replace('/dashboard');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create office. Please try again.');
      console.log('Create office error:', error);
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

          <Text style={commonStyles.title}>Create Your Office</Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 32 }]}>
            Set up your business control panel and become Employee #00001
          </Text>

          <View style={commonStyles.section}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
              Office Name
            </Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter your business name"
              value={officeName}
              onChangeText={setOfficeName}
              autoCapitalize="words"
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
              <Icon name="information-circle" size={20} color={colors.accent} />
              <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>
                What happens next?
              </Text>
            </View>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
              • You&apos;ll be assigned Employee #00001
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
              • You&apos;ll receive a unique office code
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
              • Share the code with team members to invite them
            </Text>
            <Text style={commonStyles.textSecondary}>
              • You can create custom roles and manage permissions
            </Text>
          </View>

          <Button
            text={isLoading ? "Creating Office..." : "Create Office"}
            onPress={handleCreateOffice}
            disabled={isLoading}
            style={{ marginTop: 32, marginBottom: 40 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
