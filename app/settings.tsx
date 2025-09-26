
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';

interface OfficeSettings {
  name: string;
  code: string;
  description: string;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  notifications: {
    taskReminders: boolean;
    shiftAlerts: boolean;
    inventoryAlerts: boolean;
    messageNotifications: boolean;
  };
}

export default function SettingsScreen() {
  const [officeSettings, setOfficeSettings] = useState<OfficeSettings>({
    name: 'Acme Corp',
    code: 'ABC123',
    description: 'A modern business management office',
    timezone: 'America/New_York',
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    notifications: {
      taskReminders: true,
      shiftAlerts: true,
      inventoryAlerts: true,
      messageNotifications: true
    }
  });

  const [showEditOfficeSheet, setShowEditOfficeSheet] = useState(false);
  const [showRolesSheet, setShowRolesSheet] = useState(false);
  const [editedOffice, setEditedOffice] = useState(officeSettings);

  const [customRoles] = useState([
    { id: '1', name: 'Manager', permissions: ['all'], color: colors.primary },
    { id: '2', name: 'Head Manager', permissions: ['all'], color: colors.accent },
    { id: '3', name: 'Cashier', permissions: ['view_shifts', 'view_tasks'], color: colors.success },
    { id: '4', name: 'Inventory Specialist', permissions: ['manage_inventory', 'view_tasks'], color: colors.warning },
    { id: '5', name: 'Technician', permissions: ['view_tasks', 'view_shifts'], color: colors.error },
    { id: '6', name: 'Security Guard', permissions: ['view_shifts'], color: colors.textSecondary }
  ]);

  const handleSaveOfficeSettings = () => {
    if (!editedOffice.name.trim()) {
      Alert.alert('Error', 'Office name cannot be empty.');
      return;
    }

    setOfficeSettings(editedOffice);
    setShowEditOfficeSheet(false);
    console.log('Office settings saved:', editedOffice);
    Alert.alert('Success', 'Office settings updated successfully!');
  };

  const toggleNotification = (key: keyof OfficeSettings['notifications']) => {
    setOfficeSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
    console.log(`Notification ${key} toggled`);
  };

  const renderSettingItem = (
    title: string,
    subtitle: string,
    icon: string,
    onPress: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[commonStyles.card, { marginBottom: 12 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[commonStyles.spaceBetween]}>
        <View style={[commonStyles.row, { flex: 1 }]}>
          <Icon name={icon as any} size={24} color={colors.primary} style={{ marginRight: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
              {title}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {subtitle}
            </Text>
          </View>
        </View>
        {rightElement || <Icon name="chevron-forward" size={20} color={colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  const renderToggleItem = (
    title: string,
    subtitle: string,
    icon: string,
    value: boolean,
    onToggle: () => void
  ) => (
    <TouchableOpacity
      style={[commonStyles.card, { marginBottom: 12 }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[commonStyles.spaceBetween]}>
        <View style={[commonStyles.row, { flex: 1 }]}>
          <Icon name={icon as any} size={24} color={colors.primary} style={{ marginRight: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
              {title}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {subtitle}
            </Text>
          </View>
        </View>
        <View style={{
          width: 50,
          height: 30,
          borderRadius: 15,
          backgroundColor: value ? colors.success : colors.backgroundAlt,
          justifyContent: 'center',
          paddingHorizontal: 2
        }}>
          <View style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: colors.background,
            alignSelf: value ? 'flex-end' : 'flex-start',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2
          }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.spaceBetween, { paddingTop: 20, marginBottom: 24 }]}>
          <View>
            <Text style={commonStyles.title}>Settings</Text>
            <Text style={commonStyles.textSecondary}>
              Manage your office configuration
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log('Go back to dashboard');
              router.back();
            }}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Office Information */}
          <Text style={[commonStyles.subtitle, { fontSize: 18, marginBottom: 16 }]}>
            Office Information
          </Text>

          {renderSettingItem(
            'Office Details',
            `${officeSettings.name} • Code: ${officeSettings.code}`,
            'business',
            () => {
              console.log('Edit office details');
              setEditedOffice(officeSettings);
              setShowEditOfficeSheet(true);
            }
          )}

          {renderSettingItem(
            'Working Hours',
            `${officeSettings.workingHours.start} - ${officeSettings.workingHours.end}`,
            'time',
            () => {
              console.log('Edit working hours');
              Alert.alert(
                'Working Hours',
                'This feature allows you to set default working hours for your office.',
                [{ text: 'OK' }]
              );
            }
          )}

          {renderSettingItem(
            'Roles & Permissions',
            `${customRoles.length} custom roles configured`,
            'people-circle',
            () => {
              console.log('Manage roles');
              setShowRolesSheet(true);
            }
          )}

          {/* Notifications */}
          <Text style={[commonStyles.subtitle, { fontSize: 18, marginTop: 32, marginBottom: 16 }]}>
            Notifications
          </Text>

          {renderToggleItem(
            'Task Reminders',
            'Get notified about upcoming task deadlines',
            'notifications',
            officeSettings.notifications.taskReminders,
            () => toggleNotification('taskReminders')
          )}

          {renderToggleItem(
            'Shift Alerts',
            'Receive alerts for shift changes and assignments',
            'calendar',
            officeSettings.notifications.shiftAlerts,
            () => toggleNotification('shiftAlerts')
          )}

          {renderToggleItem(
            'Inventory Alerts',
            'Get notified when items are running low',
            'cube',
            officeSettings.notifications.inventoryAlerts,
            () => toggleNotification('inventoryAlerts')
          )}

          {renderToggleItem(
            'Message Notifications',
            'Receive notifications for new messages',
            'chatbubble',
            officeSettings.notifications.messageNotifications,
            () => toggleNotification('messageNotifications')
          )}

          {/* Data & Privacy */}
          <Text style={[commonStyles.subtitle, { fontSize: 18, marginTop: 32, marginBottom: 16 }]}>
            Data & Privacy
          </Text>

          {renderSettingItem(
            'Export Data',
            'Download your office data as CSV or PDF',
            'download',
            () => {
              console.log('Export data');
              Alert.alert(
                'Export Data',
                'This feature allows you to export your office data for backup or analysis.',
                [{ text: 'OK' }]
              );
            }
          )}

          {renderSettingItem(
            'Privacy Settings',
            'Manage data sharing and privacy preferences',
            'shield-checkmark',
            () => {
              console.log('Privacy settings');
              Alert.alert(
                'Privacy Settings',
                'Configure how your data is used and shared within the office.',
                [{ text: 'OK' }]
              );
            }
          )}

          {/* Support */}
          <Text style={[commonStyles.subtitle, { fontSize: 18, marginTop: 32, marginBottom: 16 }]}>
            Support
          </Text>

          {renderSettingItem(
            'Help & Documentation',
            'Access user guides and tutorials',
            'help-circle',
            () => {
              console.log('Help & documentation');
              Alert.alert(
                'Help & Documentation',
                'Access comprehensive guides and tutorials for using Buziz effectively.',
                [{ text: 'OK' }]
              );
            }
          )}

          {renderSettingItem(
            'Contact Support',
            'Get help from our support team',
            'mail',
            () => {
              console.log('Contact support');
              Alert.alert(
                'Contact Support',
                'Reach out to our support team for assistance with any issues.',
                [{ text: 'OK' }]
              );
            }
          )}

          {renderSettingItem(
            'About Buziz',
            'Version 1.0.0 • Learn more about the app',
            'information-circle',
            () => {
              console.log('About Buziz');
              Alert.alert(
                'About Buziz',
                'Buziz v1.0.0\n\nA lightweight business control panel for small businesses and teams. Manage shifts, tasks, inventory, and communication in one place.',
                [{ text: 'OK' }]
              );
            }
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {/* Edit Office Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showEditOfficeSheet}
        onClose={() => setShowEditOfficeSheet(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
            Edit Office Details
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>Office Name</Text>
            <TextInput
              style={commonStyles.input}
              value={editedOffice.name}
              onChangeText={(text) => setEditedOffice(prev => ({ ...prev, name: text }))}
              placeholder="Enter office name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>Office Code</Text>
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.backgroundAlt }]}
              value={editedOffice.code}
              editable={false}
              placeholder="Office code (auto-generated)"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
              Office code cannot be changed
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>Description</Text>
            <TextInput
              style={[commonStyles.input, { height: 80, textAlignVertical: 'top' }]}
              value={editedOffice.description}
              onChangeText={(text) => setEditedOffice(prev => ({ ...prev, description: text }))}
              placeholder="Enter office description"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>

          <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>
            <Button
              text="Cancel"
              onPress={() => setShowEditOfficeSheet(false)}
              variant="outline"
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              text="Save Changes"
              onPress={handleSaveOfficeSettings}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
      </SimpleBottomSheet>

      {/* Roles Management Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showRolesSheet}
        onClose={() => setShowRolesSheet(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
            Roles & Permissions
          </Text>

          <ScrollView style={{ maxHeight: 400 }}>
            {customRoles.map((role) => (
              <View key={role.id} style={[commonStyles.card, { marginBottom: 12 }]}>
                <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {role.name}
                  </Text>
                  <View style={[
                    commonStyles.badge,
                    { backgroundColor: role.color }
                  ]}>
                    <Text style={[commonStyles.badgeText, { color: colors.background }]}>
                      {role.permissions.includes('all') ? 'All Permissions' : `${role.permissions.length} Permissions`}
                    </Text>
                  </View>
                </View>
                <Text style={commonStyles.textSecondary}>
                  {role.permissions.includes('all') 
                    ? 'Full access to all features' 
                    : role.permissions.join(', ')
                  }
                </Text>
              </View>
            ))}
          </ScrollView>

          <Button
            text="Close"
            onPress={() => setShowRolesSheet(false)}
            variant="outline"
            style={{ marginTop: 16 }}
          />
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
