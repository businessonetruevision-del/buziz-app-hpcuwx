
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
  location?: string;
  notes?: string;
}

export default function ShiftsScreen() {
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: '1',
      title: 'Morning Shift',
      date: '2024-01-15',
      startTime: '08:00',
      endTime: '16:00',
      assignedTo: ['John Doe', 'Sarah Wilson'],
      role: 'Manager',
      status: 'active',
      location: 'Main Office',
      notes: 'Handle morning rush and inventory check'
    },
    {
      id: '2',
      title: 'Evening Shift',
      date: '2024-01-15',
      startTime: '16:00',
      endTime: '00:00',
      assignedTo: ['Mike Johnson'],
      role: 'Cashier',
      status: 'upcoming',
      location: 'Main Office',
      notes: 'Close store and prepare daily report'
    },
    {
      id: '3',
      title: 'Weekend Coverage',
      date: '2024-01-16',
      startTime: '10:00',
      endTime: '18:00',
      assignedTo: ['Emma Davis', 'Tom Brown'],
      role: 'Staff',
      status: 'upcoming',
      location: 'Main Office'
    },
    {
      id: '4',
      title: 'Night Shift',
      date: '2024-01-14',
      startTime: '00:00',
      endTime: '08:00',
      assignedTo: ['Alex Chen'],
      role: 'Security',
      status: 'completed',
      location: 'Main Office',
      notes: 'Security patrol and maintenance check'
    },
    {
      id: '5',
      title: 'Inventory Day',
      date: '2024-01-17',
      startTime: '09:00',
      endTime: '17:00',
      assignedTo: ['Sarah Wilson', 'Mike Johnson', 'Emma Davis'],
      role: 'All Staff',
      status: 'upcoming',
      location: 'Warehouse',
      notes: 'Monthly inventory count and stock organization'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'upcoming':
        return colors.warning;
      case 'completed':
        return colors.textSecondary;
      default:
        return colors.text;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active Now';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredShifts = selectedFilter === 'all' 
    ? shifts 
    : shifts.filter(shift => shift.status === selectedFilter);

  const renderShift = (shift: Shift) => (
    <TouchableOpacity
      key={shift.id}
      style={[commonStyles.card, { marginBottom: 12 }]}
      onPress={() => {
        console.log(`View shift details: ${shift.title}`);
        Alert.alert(
          shift.title,
          `Date: ${formatDate(shift.date)}\nTime: ${shift.startTime} - ${shift.endTime}\nAssigned: ${shift.assignedTo.join(', ')}\nLocation: ${shift.location || 'Not specified'}\nNotes: ${shift.notes || 'No notes'}`
        );
      }}
      activeOpacity={0.7}
    >
      <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
        <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 16 }]}>
          {shift.title}
        </Text>
        <View style={[commonStyles.badge, { backgroundColor: getStatusColor(shift.status) }]}>
          <Text style={[commonStyles.badgeText, { color: colors.background }]}>
            {getStatusText(shift.status)}
          </Text>
        </View>
      </View>

      <View style={[commonStyles.row, { marginBottom: 8 }]}>
        <Icon name="calendar" size={16} color={colors.textSecondary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
          {formatDate(shift.date)}
        </Text>
        <Icon name="time" size={16} color={colors.textSecondary} style={{ marginLeft: 16 }} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
          {shift.startTime} - {shift.endTime}
        </Text>
      </View>

      <View style={[commonStyles.row, { marginBottom: 8 }]}>
        <Icon name="people" size={16} color={colors.textSecondary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8, flex: 1 }]}>
          {shift.assignedTo.join(', ')}
        </Text>
      </View>

      {shift.role && (
        <View style={[commonStyles.row, { marginBottom: 8 }]}>
          <Icon name="person-circle" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            Role: {shift.role}
          </Text>
        </View>
      )}

      {shift.location && (
        <View style={[commonStyles.row, { marginBottom: 8 }]}>
          <Icon name="location" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            {shift.location}
          </Text>
        </View>
      )}

      {shift.notes && (
        <View style={[commonStyles.row]}>
          <Icon name="document-text" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8, flex: 1 }]}>
            {shift.notes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const filterButtons = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.spaceBetween, { paddingTop: 20, marginBottom: 24 }]}>
          <View>
            <Text style={commonStyles.title}>Shifts</Text>
            <Text style={commonStyles.textSecondary}>
              {filteredShifts.length} shift{filteredShifts.length !== 1 ? 's' : ''}
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

        {/* Filter Buttons */}
        <View style={[commonStyles.row, { marginBottom: 20, flexWrap: 'wrap' }]}>
          {filterButtons.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                {
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                  marginBottom: 8,
                  backgroundColor: selectedFilter === filter.key ? colors.primary : colors.backgroundAlt,
                  borderWidth: 1,
                  borderColor: selectedFilter === filter.key ? colors.primary : colors.border
                }
              ]}
              onPress={() => {
                console.log(`Filter by: ${filter.key}`);
                setSelectedFilter(filter.key as any);
              }}
            >
              <Text style={[
                commonStyles.textSecondary,
                {
                  color: selectedFilter === filter.key ? colors.background : colors.text,
                  fontWeight: selectedFilter === filter.key ? '600' : '400'
                }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add New Shift Button */}
        <Button
          text="+ Create New Shift"
          onPress={() => {
            console.log('Create new shift');
            Alert.alert(
              'Create New Shift',
              'This feature will allow managers to create and assign new shifts to team members.',
              [{ text: 'OK' }]
            );
          }}
          style={{ marginBottom: 20 }}
        />

        {/* Shifts List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredShifts.length > 0 ? (
            filteredShifts.map(renderShift)
          ) : (
            <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
              <Icon name="calendar" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, marginBottom: 8 }]}>
                No {selectedFilter !== 'all' ? selectedFilter : ''} shifts found
              </Text>
              <Text style={commonStyles.textSecondary}>
                {selectedFilter !== 'all' 
                  ? `Try changing the filter or create a new shift.`
                  : 'Create your first shift to get started.'
                }
              </Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
