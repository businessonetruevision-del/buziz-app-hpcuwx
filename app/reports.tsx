
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

interface AnalyticsData {
  totalHours: number;
  completedTasks: number;
  totalTasks: number;
  inventoryValue: number;
  lowStockItems: number;
  activeStaff: number;
  totalStaff: number;
  weeklyHours: number[];
  tasksByPriority: { high: number; medium: number; low: number };
  departmentStats: { name: string; staff: number; tasks: number }[];
}

export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  
  const analyticsData: AnalyticsData = {
    totalHours: 312,
    completedTasks: 28,
    totalTasks: 35,
    inventoryValue: 15420,
    lowStockItems: 3,
    activeStaff: 6,
    totalStaff: 6,
    weeklyHours: [45, 52, 48, 50, 47, 38, 32],
    tasksByPriority: { high: 8, medium: 15, low: 12 },
    departmentStats: [
      { name: 'Management', staff: 2, tasks: 12 },
      { name: 'Operations', staff: 2, tasks: 15 },
      { name: 'Sales', staff: 1, tasks: 5 },
      { name: 'Technical', staff: 1, tasks: 3 }
    ]
  };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 80;

  const renderProgressBar = (value: number, max: number, color: string) => (
    <View style={{
      height: 8,
      backgroundColor: colors.backgroundAlt,
      borderRadius: 4,
      overflow: 'hidden',
      marginTop: 8
    }}>
      <View style={{
        height: '100%',
        width: `${Math.min((value / max) * 100, 100)}%`,
        backgroundColor: color,
        borderRadius: 4
      }} />
    </View>
  );

  const renderDoughnutChart = (data: { high: number; medium: number; low: number }) => {
    const total = data.high + data.medium + data.low;
    const highPercentage = (data.high / total) * 100;
    const mediumPercentage = (data.medium / total) * 100;
    const lowPercentage = (data.low / total) * 100;

    return (
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <View style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: colors.backgroundAlt,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '700' }]}>
              {total}
            </Text>
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              Tasks
            </Text>
          </View>
        </View>
        
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.error,
              marginRight: 8
            }} />
            <Text style={commonStyles.textSecondary}>
              High Priority: {data.high} ({highPercentage.toFixed(0)}%)
            </Text>
          </View>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.warning,
              marginRight: 8
            }} />
            <Text style={commonStyles.textSecondary}>
              Medium Priority: {data.medium} ({mediumPercentage.toFixed(0)}%)
            </Text>
          </View>
          <View style={[commonStyles.row]}>
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.success,
              marginRight: 8
            }} />
            <Text style={commonStyles.textSecondary}>
              Low Priority: {data.low} ({lowPercentage.toFixed(0)}%)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderBarChart = (data: number[]) => {
    const maxValue = Math.max(...data);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <View style={{ marginVertical: 20 }}>
        <View style={[commonStyles.row, { height: 150, alignItems: 'flex-end', justifyContent: 'space-around' }]}>
          {data.map((value, index) => (
            <View key={index} style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 24,
                height: (value / maxValue) * 120,
                backgroundColor: colors.primary,
                borderRadius: 4,
                marginBottom: 8
              }} />
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                {days[index]}
              </Text>
              <Text style={[commonStyles.textSecondary, { fontSize: 10 }]}>
                {value}h
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const periodFilters = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'quarter', label: 'This Quarter' }
  ];

  const taskCompletionRate = (analyticsData.completedTasks / analyticsData.totalTasks) * 100;
  const staffUtilization = (analyticsData.activeStaff / analyticsData.totalStaff) * 100;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.spaceBetween, { paddingTop: 20, marginBottom: 24 }]}>
          <View>
            <Text style={commonStyles.title}>Analytics</Text>
            <Text style={commonStyles.textSecondary}>
              Business performance insights
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

        {/* Period Filter */}
        <View style={[commonStyles.row, { marginBottom: 24, flexWrap: 'wrap' }]}>
          {periodFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                {
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                  marginBottom: 8,
                  backgroundColor: selectedPeriod === filter.key ? colors.primary : colors.backgroundAlt,
                  borderWidth: 1,
                  borderColor: selectedPeriod === filter.key ? colors.primary : colors.border
                }
              ]}
              onPress={() => {
                console.log(`Filter by period: ${filter.key}`);
                setSelectedPeriod(filter.key as any);
              }}
            >
              <Text style={[
                commonStyles.textSecondary,
                {
                  color: selectedPeriod === filter.key ? colors.background : colors.text,
                  fontWeight: selectedPeriod === filter.key ? '600' : '400'
                }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Key Metrics */}
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { fontSize: 18, marginBottom: 16 }]}>
              Key Metrics
            </Text>
            
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.primary }]}>
                  {analyticsData.totalHours}
                </Text>
                <Text style={commonStyles.textSecondary}>Total Hours</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.success }]}>
                  {taskCompletionRate.toFixed(0)}%
                </Text>
                <Text style={commonStyles.textSecondary}>Task Completion</Text>
              </View>
            </View>

            <View style={[commonStyles.row]}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.accent }]}>
                  ${analyticsData.inventoryValue.toLocaleString()}
                </Text>
                <Text style={commonStyles.textSecondary}>Inventory Value</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.warning }]}>
                  {staffUtilization.toFixed(0)}%
                </Text>
                <Text style={commonStyles.textSecondary}>Staff Utilization</Text>
              </View>
            </View>
          </View>

          {/* Weekly Hours Chart */}
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { fontSize: 18, marginBottom: 8 }]}>
              Weekly Hours Breakdown
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
              Hours worked per day this week
            </Text>
            {renderBarChart(analyticsData.weeklyHours)}
          </View>

          {/* Task Priority Distribution */}
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { fontSize: 18, marginBottom: 8 }]}>
              Task Priority Distribution
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
              Current tasks by priority level
            </Text>
            {renderDoughnutChart(analyticsData.tasksByPriority)}
          </View>

          {/* Department Performance */}
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { fontSize: 18, marginBottom: 16 }]}>
              Department Performance
            </Text>
            
            {analyticsData.departmentStats.map((dept, index) => (
              <View key={dept.name} style={{ marginBottom: 16 }}>
                <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {dept.name}
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    {dept.staff} staff • {dept.tasks} tasks
                  </Text>
                </View>
                
                <View style={{ marginBottom: 8 }}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                    Task Load: {dept.tasks} tasks
                  </Text>
                  {renderProgressBar(dept.tasks, 20, colors.primary)}
                </View>
                
                <View>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                    Staff Count: {dept.staff} members
                  </Text>
                  {renderProgressBar(dept.staff, 5, colors.accent)}
                </View>
                
                {index < analyticsData.departmentStats.length - 1 && (
                  <View style={commonStyles.divider} />
                )}
              </View>
            ))}
          </View>

          {/* Performance Indicators */}
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { fontSize: 18, marginBottom: 16 }]}>
              Performance Indicators
            </Text>
            
            <View style={{ marginBottom: 16 }}>
              <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={commonStyles.text}>Task Completion Rate</Text>
                <Text style={[commonStyles.text, { fontWeight: '600', color: colors.success }]}>
                  {taskCompletionRate.toFixed(1)}%
                </Text>
              </View>
              {renderProgressBar(analyticsData.completedTasks, analyticsData.totalTasks, colors.success)}
            </View>

            <View style={{ marginBottom: 16 }}>
              <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={commonStyles.text}>Staff Utilization</Text>
                <Text style={[commonStyles.text, { fontWeight: '600', color: colors.primary }]}>
                  {staffUtilization.toFixed(1)}%
                </Text>
              </View>
              {renderProgressBar(analyticsData.activeStaff, analyticsData.totalStaff, colors.primary)}
            </View>

            <View>
              <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={commonStyles.text}>Inventory Health</Text>
                <Text style={[
                  commonStyles.text, 
                  { 
                    fontWeight: '600', 
                    color: analyticsData.lowStockItems > 0 ? colors.warning : colors.success 
                  }
                ]}>
                  {analyticsData.lowStockItems === 0 ? 'Excellent' : `${analyticsData.lowStockItems} Alerts`}
                </Text>
              </View>
              {renderProgressBar(
                10 - analyticsData.lowStockItems, 
                10, 
                analyticsData.lowStockItems > 0 ? colors.warning : colors.success
              )}
            </View>
          </View>

          {/* Insights & Recommendations */}
          <View style={[commonStyles.card, { marginBottom: 40 }]}>
            <Text style={[commonStyles.subtitle, { fontSize: 18, marginBottom: 16 }]}>
              Insights & Recommendations
            </Text>
            
            <View style={[commonStyles.row, { marginBottom: 12, alignItems: 'flex-start' }]}>
              <Icon name="trending-up" size={16} color={colors.success} style={{ marginTop: 2, marginRight: 8 }} />
              <Text style={[commonStyles.textSecondary, { flex: 1 }]}>
                Task completion rate is above 80% - excellent team performance this week.
              </Text>
            </View>
            
            <View style={[commonStyles.row, { marginBottom: 12, alignItems: 'flex-start' }]}>
              <Icon name="warning" size={16} color={colors.warning} style={{ marginTop: 2, marginRight: 8 }} />
              <Text style={[commonStyles.textSecondary, { flex: 1 }]}>
                {analyticsData.lowStockItems} inventory items are running low and need restocking.
              </Text>
            </View>
            
            <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
              <Icon name="bulb" size={16} color={colors.primary} style={{ marginTop: 2, marginRight: 8 }} />
              <Text style={[commonStyles.textSecondary, { flex: 1 }]}>
                Consider redistributing high-priority tasks across departments for better balance.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
