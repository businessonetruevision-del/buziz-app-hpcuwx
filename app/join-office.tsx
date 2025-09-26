
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function JoinOfficeScreen() {
  const [officeCode, setOfficeCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinOffice = async () => {
    console.log('Joining office with data:', { officeCode, memberName });
    
    if (!officeCode.trim()) {
      Alert.alert('Error', 'Please enter the office code');
      return;
    }
    
    if (!memberName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (officeCode.trim().length !== 6) {
      Alert.alert('Error', 'Office code must be 6 characters long');
      return;
    }

    setIsJoining(true);

    try {
      // Simulate office lookup and joining
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate finding the office (in a real app, you'd query your backend)
      const mockOffices = [
        { code: 'ABC123', name: 'Acme Corp', description: 'Main office' },
        { code: 'XYZ789', name: 'Downtown Cafe', description: 'Coffee shop team' },
        { code: 'DEF456', name: 'Tech Startup', description: 'Development team' },
      ];

      const foundOffice = mockOffices.find(office => 
        office.code.toUpperCase() === officeCode.trim().toUpperCase()
      );

      if (!foundOffice) {
        Alert.alert('Office Not Found', 'The office code you entered is not valid. Please check the code and try again.');
        setIsJoining(false);
        return;
      }

      // Generate employee number (in a real app, this would come from the backend)
      const employeeNumber = `#${String(Math.floor(Math.random() * 99) + 2).padStart(5, '0')}`;
      
      const memberData = {
        name: memberName.trim(),
        employeeNumber,
        role: 'Employee',
        office: foundOffice,
        joinedAt: new Date().toISOString(),
      };

      console.log('Successfully joined office:', memberData);

      Alert.alert(
        'Welcome to the Team!',
        `You have successfully joined "${foundOffice.name}".\n\nYour Employee Number: ${employeeNumber}\n\nYou can now access shifts, tasks, and collaborate with your team.`,
        [
          {
            text: 'Continue to Dashboard',
            onPress: () => {
              router.replace('/dashboard');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error joining office:', error);
      Alert.alert('Error', 'Failed to join office. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleGoBack = () => {
    console.log('Going back to login screen');
    router.back();
  };

  const formatOfficeCode = (text: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = text.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    // Limit to 6 characters
    return cleaned.slice(0, 6);
  };

  const handleOfficeCodeChange = (text: string) => {
    const formatted = formatOfficeCode(text);
    setOfficeCode(formatted);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Button
            text="← Back"
            onPress={handleGoBack}
            variant="outline"
            style={styles.backButton}
          />
          
          <View style={styles.titleContainer}>
            <Icon name="people" size={40} color={colors.primary} />
            <Text style={commonStyles.title}>Join Office</Text>
            <Text style={commonStyles.textSecondary}>
              Enter the office code provided by your team leader
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Office Code *</Text>
            <TextInput
              style={[commonStyles.input, styles.codeInput]}
              placeholder="ABC123"
              value={officeCode}
              onChangeText={handleOfficeCodeChange}
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Text style={styles.helperText}>
              6-character code provided by your office creator
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              placeholder="Enter your full name"
              value={memberName}
              onChangeText={setMemberName}
              maxLength={50}
            />
            <Text style={styles.helperText}>
              You will be assigned an auto-generated employee number
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Icon name="shield-checkmark-outline" size={24} color={colors.success} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Joining an Office</Text>
              <Text style={styles.infoText}>
                • You'll be assigned a unique employee number{'\n'}
                • Your role will be set to "Employee" by default{'\n'}
                • The office creator can assign you to custom roles{'\n'}
                • You'll have access to shifts, tasks, and team communication
              </Text>
            </View>
          </View>

          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>Example Office Codes:</Text>
            <View style={styles.exampleCodes}>
              <View style={styles.exampleCode}>
                <Text style={styles.codeText}>ABC123</Text>
                <Text style={styles.codeLabel}>Acme Corp</Text>
              </View>
              <View style={styles.exampleCode}>
                <Text style={styles.codeText}>XYZ789</Text>
                <Text style={styles.codeLabel}>Downtown Cafe</Text>
              </View>
              <View style={styles.exampleCode}>
                <Text style={styles.codeText}>DEF456</Text>
                <Text style={styles.codeLabel}>Tech Startup</Text>
              </View>
            </View>
            <Text style={styles.exampleNote}>
              Try one of these codes to test the join functionality
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            text={isJoining ? "Joining Office..." : "Join Office"}
            onPress={handleJoinOffice}
            variant="primary"
            disabled={isJoining || !officeCode.trim() || !memberName.trim()}
            style={styles.joinButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start' as const,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  titleContainer: {
    alignItems: 'center' as const,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    marginBottom: 4,
  },
  codeInput: {
    fontSize: 18,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    letterSpacing: 2,
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoCard: {
    ...commonStyles.card,
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  exampleCard: {
    ...commonStyles.card,
    backgroundColor: colors.backgroundAlt,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  exampleCodes: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
  },
  exampleCode: {
    alignItems: 'center' as const,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.primary,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  codeLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center' as const,
  },
  exampleNote: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
  },
  footer: {
    padding: 20,
  },
  joinButton: {
    width: '100%',
  },
};
