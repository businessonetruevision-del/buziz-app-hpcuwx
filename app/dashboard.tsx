
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

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Shifts',
      subtitle: '3 upcoming this week',
      icon: 'calendar',
      route: '/shifts',
      color: colors.primary
    },
    {
      title: 'Tasks',
      subtitle: '5 pending assignments',
      icon: 'checkmark-circle',
      route: '/tasks',
      color: colors.accent
    },
    {
      title: 'Inventory',
      subtitle: '2 low stock alerts',
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
        router.push(card.route as any);
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
              <Text style={commonStyles.title}>Welcome back!</Text>
              <Text style={commonStyles.textSecondary}>
                {currentUser.name} • {currentUser.employeeNumber}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigate to settings');
                router.push('/settings' as any);
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
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700' }]}>
                  6
                </Text>
                <Text style={commonStyles.textSecondary}>
                  Active Shifts
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700' }]}>
                  12
                </Text>
                <Text style={commonStyles.textSecondary}>
                  Open Tasks
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700' }]}>
                  2
                </Text>
                <Text style={commonStyles.textSecondary}>
                  Alerts
                </Text>
              </View>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
