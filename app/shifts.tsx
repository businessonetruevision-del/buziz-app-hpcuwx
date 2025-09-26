
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

interface Shift {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  assignedTo: string[];
  role?: string;
  status: 'upcoming' | 'active' | 'completed';
}

export default function ShiftsScreen() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('list');
  
  const [shifts] = useState<Shift[]>([
    {
      id: '1',
      title: 'Morning Shift',
      date: '2024-01-15',
      startTime: '08:00',
      endTime: '16:00',
      assignedTo: ['John Doe', 'Jane Smith'],
      role: 'Cashier',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Evening Shift',
      date: '2024-01-15',
      startTime: '16:00',
      endTime: '00:00',
      assignedTo: ['Mike Johnson'],
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Weekend Coverage',
      date: '2024-01-13',
      startTime: '09:00',
      endTime: '17:00',
      assignedTo: ['Sarah Wilson', 'Tom Brown'],
      role: 'Manager',
      status: 'completed'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'completed':
        return colors.textSecondary;
      default:
        return colors.primary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      default:
        return 'Upcoming';
    }
  };

  const renderShift = (shift: Shift) => (
    <TouchableOpacity
      key={shift.id}
      style={commonStyles.card}
      onPress={() => {
        console.log('View shift details:', shift.id);
        Alert.alert('Shift Details', `${shift.title}\n${shift.date} ${shift.startTime}-${shift.endTime}`);
      }}
      activeOpacity={0.7}
    >
      <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
        <Text style={[commonStyles.text, { fontWeight: '600' }]}>
          {shift.title}
        </Text>
        <View style={[commonStyles.badge, { backgroundColor: getStatusColor(shift.status) }]}>
          <Text style={commonStyles.badgeText}>
            {getStatusText(shift.status)}
          </Text>
        </View>
      </View>
      
      <View style={[commonStyles.row, { marginBottom: 8 }]}>
        <Icon name="calendar" size={16} color={colors.textSecondary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
          {shift.date}
        </Text>
        <Icon name="time" size={16} color={colors.textSecondary} style={{ marginLeft: 16 }} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
          {shift.startTime} - {shift.endTime}
        </Text>
      </View>

      {shift.role && (
        <View style={[commonStyles.row, { marginBottom: 8 }]}>
          <Icon name="person" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            Role: {shift.role}
          </Text>
        </View>
      )}

      <View style={commonStyles.row}>
        <Icon name="people" size={16} color={colors.textSecondary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
          Assigned: {shift.assignedTo.join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.spaceBetween, { paddingTop: 20, marginBottom: 24 }]}>
          <View style={commonStyles.row}>
            <Button
              text="← Back"
              onPress={() => router.back()}
              variant="outline"
              style={{ paddingHorizontal: 16, paddingVertical: 8, marginRight: 16 }}
            />
            <Text style={commonStyles.title}>Shifts</Text>
          </View>
          <Button
            text="+ New"
            onPress={() => {
              console.log('Create new shift');
              Alert.alert('Create Shift', 'This will open the shift creation form');
            }}
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
          />
        </View>

        {/* Tab Navigation */}
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <TouchableOpacity
            style={[
              commonStyles.card,
              {
                flex: 1,
                marginRight: 8,
                backgroundColor: activeTab === 'list' ? colors.primary : colors.background,
                borderColor: activeTab === 'list' ? colors.primary : colors.border
              }
            ]}
            onPress={() => setActiveTab('list')}
          >
            <Text style={[
              commonStyles.text,
              {
                textAlign: 'center',
                color: activeTab === 'list' ? colors.background : colors.text,
                fontWeight: '600'
              }
            ]}>
              List View
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              commonStyles.card,
              {
                flex: 1,
                marginLeft: 8,
                backgroundColor: activeTab === 'calendar' ? colors.primary : colors.background,
                borderColor: activeTab === 'calendar' ? colors.primary : colors.border
              }
            ]}
            onPress={() => setActiveTab('calendar')}
          >
            <Text style={[
              commonStyles.text,
              {
                textAlign: 'center',
                color: activeTab === 'calendar' ? colors.background : colors.text,
                fontWeight: '600'
              }
            ]}>
              Calendar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === 'list' ? (
            <View style={{ paddingBottom: 40 }}>
              <Text style={[commonStyles.subtitle, { fontSize: 16, marginBottom: 16 }]}>
                All Shifts
              </Text>
              {shifts.map(renderShift)}
            </View>
          ) : (
            <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
              <Icon name="calendar" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                Calendar View
              </Text>
              <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
                Interactive calendar coming soon
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
