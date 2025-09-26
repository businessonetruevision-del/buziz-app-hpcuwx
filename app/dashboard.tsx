
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

interface DashboardCard {
  title: string;
  subtitle: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  route: string;
  color: string;
}

export default function DashboardScreen() {
  const [currentUser] = useState({
    name: 'John Doe',
    employeeNumber: '#00001',
    role: 'Manager',
    isCreator: true
  });

  const [officeInfo] = useState({
    name: 'Acme Corp',
    code: 'ABC123',
    memberCount: 8
  });

  const [todayStats] = useState({
    activeShifts: 6,
    openTasks: 12,
    alerts: 2,
    completedTasks: 8,
    hoursWorked: 45,
    lowStockItems: 3
  });

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Shifts',
      subtitle: `${todayStats.activeShifts} active today`,
      icon: 'calendar',
      route: '/shifts',
      color: colors.primary
    },
    {
      title: 'Tasks',
      subtitle: `${todayStats.openTasks} pending`,
      icon: 'checkmark-circle',
      route: '/tasks',
      color: colors.accent
    },
    {
      title: 'Inventory',
      subtitle: `${todayStats.lowStockItems} low stock alerts`,
      icon: 'cube',
      route: '/inventory',
      color: colors.warning
    },
    {
      title: 'Staff',
      subtitle: `${officeInfo.memberCount} team members`,
      icon: 'people',
      route: '/staff',
      color: colors.success
    },
    {
      title: 'Messages',
      subtitle: '1 new announcement',
      icon: 'chatbubble',
      route: '/messages',
      color: colors.secondary
    },
    {
      title: 'Reports',
      subtitle: 'View analytics',
      icon: 'bar-chart',
      route: '/reports',
      color: colors.error
    }
  ];

  const renderDashboardCard = (card: DashboardCard) => (
    <TouchableOpacity
      key={card.title}
      style={[
        commonStyles.card,
        {
          marginHorizontal: 8,
          marginVertical: 8,
          flex: 1,
          minWidth: '45%',
          maxWidth: '48%'
        }
      ]}
      onPress={() => {
        console.log(`Navigate to ${card.route}`);
        if (card.route === '/staff' || card.route === '/messages' || card.route === '/reports') {
          // These screens don't exist yet, show alert
          console.log(`${card.title} feature coming soon`);
        } else {
          router.push(card.route as any);
        }
      }}
      activeOpacity={0.7}
    >
      <View style={[commonStyles.row, { marginBottom: 12 }]}>
        <Icon name={card.icon} size={24} color={card.color} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
            {card.title}
          </Text>
          <Text style={commonStyles.textSecondary}>
            {card.subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content}>
        <View style={{ paddingTop: 20 }}>
          {/* Header */}
          <View style={[commonStyles.spaceBetween, { marginBottom: 24 }]}>
            <View>
              <Text style={commonStyles.title}>Buziz Dashboard</Text>
              <Text style={commonStyles.textSecondary}>
                {currentUser.name} • {currentUser.employeeNumber}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                console.log('Settings pressed - feature coming soon');
              }}
            >
              <Icon name="settings" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Office Info Card */}
          <View style={[commonStyles.card, { marginBottom: 24 }]}>
            <View style={[commonStyles.spaceBetween, { marginBottom: 12 }]}>
              <Text style={[commonStyles.subtitle, { fontSize: 18 }]}>
                {officeInfo.name}
              </Text>
              <View style={commonStyles.badge}>
                <Text style={commonStyles.badgeText}>
                  {currentUser.role}
                </Text>
              </View>
            </View>
            <View style={commonStyles.row}>
              <Icon name="business" size={16} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
                Office Code: {officeInfo.code} • {officeInfo.memberCount} members
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={[commonStyles.card, { marginBottom: 24 }]}>
            <Text style={[commonStyles.subtitle, { fontSize: 16, marginBottom: 16 }]}>
              Today&apos;s Overview
            </Text>
            <View style={[commonStyles.row, { justifyContent: 'space-around' }]}>
              <View style={{ alignItems: 'center' }}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.success }]}>
                  {todayStats.activeShifts}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  Active Shifts
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.warning }]}>
                  {todayStats.openTasks}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  Open Tasks
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.error }]}>
                  {todayStats.alerts}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  Alerts
                </Text>
              </View>
            </View>
          </View>

          {/* Performance Summary */}
          <View style={[commonStyles.card, { marginBottom: 24 }]}>
            <Text style={[commonStyles.subtitle, { fontSize: 16, marginBottom: 16 }]}>
              This Week&apos;s Performance
            </Text>
            <View style={[commonStyles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
              <Text style={commonStyles.textSecondary}>Tasks Completed</Text>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                {todayStats.completedTasks}/{todayStats.completedTasks + todayStats.openTasks}
              </Text>
            </View>
            <View style={[commonStyles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
              <Text style={commonStyles.textSecondary}>Hours Worked</Text>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                {todayStats.hoursWorked}h
              </Text>
            </View>
            <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>
              <Text style={commonStyles.textSecondary}>Inventory Status</Text>
              <Text style={[commonStyles.text, { fontWeight: '600', color: todayStats.lowStockItems > 0 ? colors.warning : colors.success }]}>
                {todayStats.lowStockItems > 0 ? `${todayStats.lowStockItems} Low Stock` : 'All Good'}
              </Text>
            </View>
          </View>

          {/* Dashboard Cards */}
          <Text style={[commonStyles.subtitle, { fontSize: 18, marginBottom: 16 }]}>
            Quick Access
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -8,
            marginBottom: 40
          }}>
            {dashboardCards.map(renderDashboardCard)}
          </View>

          {/* Recent Activity */}
          <View style={[commonStyles.card, { marginBottom: 40 }]}>
            <Text style={[commonStyles.subtitle, { fontSize: 16, marginBottom: 16 }]}>
              Recent Activity
            </Text>
            <View style={{ marginBottom: 12 }}>
              <View style={[commonStyles.row, { marginBottom: 8 }]}>
                <Icon name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[commonStyles.textSecondary, { marginLeft: 8, flex: 1 }]}>
                  Task &quot;Update inventory&quot; completed by Sarah
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  2h ago
                </Text>
              </View>
              <View style={[commonStyles.row, { marginBottom: 8 }]}>
                <Icon name="calendar" size={16} color={colors.primary} />
                <Text style={[commonStyles.textSecondary, { marginLeft: 8, flex: 1 }]}>
                  New shift assigned to Mike for tomorrow
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  4h ago
                </Text>
              </View>
              <View style={[commonStyles.row]}>
                <Icon name="warning" size={16} color={colors.warning} />
                <Text style={[commonStyles.textSecondary, { marginLeft: 8, flex: 1 }]}>
                  Low stock alert: Office supplies running low
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  6h ago
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
