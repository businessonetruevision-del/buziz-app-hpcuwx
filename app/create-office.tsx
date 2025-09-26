
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function CreateOfficeScreen() {
  const [officeName, setOfficeName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [officeDescription, setOfficeDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const generateOfficeCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateOffice = async () => {
    console.log('Creating office with data:', { officeName, creatorName, officeDescription });
    
    if (!officeName.trim()) {
      Alert.alert('Error', 'Please enter an office name');
      return;
    }
    
    if (!creatorName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsCreating(true);

    try {
      // Simulate office creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const officeCode = generateOfficeCode();
      
      // In a real app, you would save this to AsyncStorage or backend
      const officeData = {
        id: Date.now().toString(),
        name: officeName.trim(),
        description: officeDescription.trim(),
        code: officeCode,
        creator: {
          name: creatorName.trim(),
          employeeNumber: '#00001',
          role: 'Creator',
          isCreator: true,
        },
        createdAt: new Date().toISOString(),
      };

      console.log('Office created successfully:', officeData);

      Alert.alert(
        'Office Created Successfully!',
        `Your office "${officeName}" has been created.\n\nOffice Code: ${officeCode}\n\nShare this code with team members to invite them to join your office.`,
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
      console.error('Error creating office:', error);
      Alert.alert('Error', 'Failed to create office. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleGoBack = () => {
    console.log('Going back to login screen');
    router.back();
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
            <Icon name="business" size={40} color={colors.primary} />
            <Text style={commonStyles.title}>Create Office</Text>
            <Text style={commonStyles.textSecondary}>
              Set up your new business office and become the office creator
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Office Name *</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              placeholder="e.g., Acme Corp, Downtown Cafe, Tech Startup"
              value={officeName}
              onChangeText={setOfficeName}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              placeholder="Enter your full name"
              value={creatorName}
              onChangeText={setCreatorName}
              maxLength={50}
            />
            <Text style={styles.helperText}>
              You will be assigned Employee #00001 as the office creator
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Office Description (Optional)</Text>
            <TextInput
              style={[commonStyles.input, styles.textArea]}
              placeholder="Brief description of your business or team"
              value={officeDescription}
              onChangeText={setOfficeDescription}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <View style={styles.infoCard}>
            <Icon name="information-circle-outline" size={24} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>What happens next?</Text>
              <Text style={styles.infoText}>
                • You'll receive a unique 6-digit office code{'\n'}
                • Share this code with team members to invite them{'\n'}
                • You can create custom roles and manage permissions{'\n'}
                • Start managing shifts, tasks, and inventory immediately
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            text={isCreating ? "Creating Office..." : "Create Office"}
            onPress={handleCreateOffice}
            variant="primary"
            disabled={isCreating || !officeName.trim() || !creatorName.trim()}
            style={styles.createButton}
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
  textArea: {
    height: 80,
    textAlignVertical: 'top' as const,
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
    marginTop: 10,
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
  footer: {
    padding: 20,
  },
  createButton: {
    width: '100%',
  },
};
