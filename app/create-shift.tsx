
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function CreateShiftScreen() {
  const [shiftTitle, setShiftTitle] = useState('');
  const [shiftDate, setShiftDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const availableRoles = [
    'All Staff',
    'Manager',
    'Cashier',
    'Inventory Specialist',
    'Technician',
    'Security Guard'
  ];

  const availableEmployees = [
    { id: '1', name: 'John Doe', role: 'Manager' },
    { id: '2', name: 'Sarah Wilson', role: 'Cashier' },
    { id: '3', name: 'Mike Johnson', role: 'Inventory Specialist' },
    { id: '4', name: 'Emily Davis', role: 'Technician' },
    { id: '5', name: 'Alex Brown', role: 'Security Guard' },
    { id: '6', name: 'Lisa Garcia', role: 'Cashier' },
  ];

  const handleCreateShift = async () => {
    console.log('Creating shift with data:', {
      shiftTitle,
      shiftDate,
      startTime,
      endTime,
      location,
      notes,
      selectedRole,
      selectedEmployees
    });

    if (!shiftTitle.trim()) {
      Alert.alert('Error', 'Please enter a shift title');
      return;
    }

    if (!shiftDate.trim()) {
      Alert.alert('Error', 'Please enter a shift date');
      return;
    }

    if (!startTime.trim() || !endTime.trim()) {
      Alert.alert('Error', 'Please enter start and end times');
      return;
    }

    if (!selectedRole && selectedEmployees.length === 0) {
      Alert.alert('Error', 'Please assign the shift to a role or specific employees');
      return;
    }

    setIsCreating(true);

    try {
      // Simulate shift creation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newShift = {
        id: Date.now().toString(),
        title: shiftTitle.trim(),
        date: shiftDate.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        location: location.trim() || 'Main Office',
        notes: notes.trim(),
        assignedTo: selectedEmployees,
        role: selectedRole || undefined,
        status: 'upcoming' as const,
        createdAt: new Date().toISOString(),
      };

      console.log('Shift created successfully:', newShift);

      Alert.alert(
        'Shift Created!',
        `"${shiftTitle}" has been scheduled for ${shiftDate} from ${startTime} to ${endTime}.${selectedRole ? ` Assigned to: ${selectedRole}` : ` Assigned to ${selectedEmployees.length} employee(s)`}`,
        [
          {
            text: 'View Shifts',
            onPress: () => router.replace('/shifts')
          },
          {
            text: 'Create Another',
            onPress: () => {
              // Reset form
              setShiftTitle('');
              setShiftDate('');
              setStartTime('');
              setEndTime('');
              setLocation('');
              setNotes('');
              setSelectedRole('');
              setSelectedEmployees([]);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating shift:', error);
      Alert.alert('Error', 'Failed to create shift. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const handleRoleSelection = (role: string) => {
    if (selectedRole === role) {
      setSelectedRole('');
    } else {
      setSelectedRole(role);
      // Clear individual employee selections when selecting a role
      setSelectedEmployees([]);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Button
            text="← Back"
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButton}
          />
          
          <View style={styles.titleContainer}>
            <Icon name="calendar-outline" size={40} color={colors.primary} />
            <Text style={commonStyles.title}>Create Shift</Text>
            <Text style={commonStyles.textSecondary}>
              Schedule a new shift for your team
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Shift Title *</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              placeholder="e.g., Morning Shift, Weekend Coverage"
              value={shiftTitle}
              onChangeText={setShiftTitle}
              maxLength={50}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="YYYY-MM-DD"
                value={shiftDate}
                onChangeText={setShiftDate}
                maxLength={10}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="Main Office"
                value={location}
                onChangeText={setLocation}
                maxLength={30}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Start Time *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="09:00"
                value={startTime}
                onChangeText={setStartTime}
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>End Time *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                placeholder="17:00"
                value={endTime}
                onChangeText={setEndTime}
                maxLength={5}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[commonStyles.input, styles.textArea]}
              placeholder="Additional instructions or requirements"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          {/* Role Assignment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assign to Role</Text>
            <Text style={styles.sectionSubtitle}>
              Select a role to assign this shift to all members of that role
            </Text>
            <View style={styles.roleGrid}>
              {availableRoles.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleChip,
                    selectedRole === role && styles.roleChipSelected
                  ]}
                  onPress={() => handleRoleSelection(role)}
                >
                  <Text style={[
                    styles.roleChipText,
                    selectedRole === role && styles.roleChipTextSelected
                  ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Individual Employee Assignment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Or Assign to Specific Employees</Text>
            <Text style={styles.sectionSubtitle}>
              Select individual employees for this shift
            </Text>
            {availableEmployees.map((employee) => (
              <TouchableOpacity
                key={employee.id}
                style={[
                  styles.employeeItem,
                  selectedEmployees.includes(employee.id) && styles.employeeItemSelected
                ]}
                onPress={() => {
                  // Clear role selection when selecting individual employees
                  if (selectedRole) setSelectedRole('');
                  toggleEmployeeSelection(employee.id);
                }}
              >
                <View style={styles.employeeInfo}>
                  <Text style={[
                    styles.employeeName,
                    selectedEmployees.includes(employee.id) && styles.employeeNameSelected
                  ]}>
                    {employee.name}
                  </Text>
                  <Text style={styles.employeeRole}>{employee.role}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  selectedEmployees.includes(employee.id) && styles.checkboxSelected
                ]}>
                  {selectedEmployees.includes(employee.id) && (
                    <Icon name="checkmark" size={16} color={colors.background} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            text={isCreating ? "Creating Shift..." : "Create Shift"}
            onPress={handleCreateShift}
            variant="primary"
            disabled={isCreating}
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
  row: {
    flexDirection: 'row' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  roleGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginHorizontal: -4,
  },
  roleChip: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
  },
  roleChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500' as const,
  },
  roleChipTextSelected: {
    color: colors.background,
  },
  employeeItem: {
    ...commonStyles.card,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
    padding: 12,
  },
  employeeItemSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  employeeNameSelected: {
    color: colors.primary,
  },
  employeeRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  footer: {
    padding: 20,
  },
  createButton: {
    width: '100%',
  },
};
