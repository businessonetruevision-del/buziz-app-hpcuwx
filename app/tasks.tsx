
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  assignedTo: string[];
  role?: string;
  createdBy: string;
}

export default function TasksScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Update inventory system',
      description: 'Review and update the current inventory tracking system',
      deadline: '2024-01-20',
      priority: 'high',
      status: 'todo',
      assignedTo: ['John Doe'],
      createdBy: 'Manager'
    },
    {
      id: '2',
      title: 'Staff training session',
      description: 'Conduct training for new cashier procedures',
      deadline: '2024-01-18',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: ['Jane Smith', 'Mike Johnson'],
      role: 'Cashier',
      createdBy: 'Manager'
    },
    {
      id: '3',
      title: 'Monthly report preparation',
      description: 'Prepare monthly sales and performance report',
      deadline: '2024-01-15',
      priority: 'high',
      status: 'done',
      assignedTo: ['Sarah Wilson'],
      createdBy: 'Manager'
    },
    {
      id: '4',
      title: 'Equipment maintenance',
      description: 'Check and maintain all equipment in the store',
      deadline: '2024-01-25',
      priority: 'low',
      status: 'todo',
      assignedTo: ['Tom Brown'],
      role: 'Technician',
      createdBy: 'Manager'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      default:
        return colors.success;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return colors.success;
      case 'in-progress':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  const filteredTasks = activeFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === activeFilter);

  const renderTask = (task: Task) => (
    <TouchableOpacity
      key={task.id}
      style={[
        commonStyles.card,
        task.status === 'done' && { opacity: 0.7 }
      ]}
      onPress={() => {
        console.log('View task details:', task.id);
        Alert.alert('Task Details', `${task.title}\n\n${task.description}\n\nDeadline: ${task.deadline}`);
      }}
      activeOpacity={0.7}
    >
      <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
        <Text style={[
          commonStyles.text, 
          { 
            fontWeight: '600',
            textDecorationLine: task.status === 'done' ? 'line-through' : 'none'
          }
        ]}>
          {task.title}
        </Text>
        <View style={[commonStyles.badge, { backgroundColor: getPriorityColor(task.priority) }]}>
          <Text style={commonStyles.badgeText}>
            {task.priority.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>
        {task.description}
      </Text>

      <View style={[commonStyles.row, { marginBottom: 8 }]}>
        <Icon name="calendar" size={16} color={colors.textSecondary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
          Due: {task.deadline}
        </Text>
        <View style={[
          commonStyles.badge, 
          { 
            backgroundColor: getStatusColor(task.status),
            marginLeft: 16
          }
        ]}>
          <Text style={commonStyles.badgeText}>
            {getStatusText(task.status)}
          </Text>
        </View>
      </View>

      {task.role && (
        <View style={[commonStyles.row, { marginBottom: 8 }]}>
          <Icon name="person" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            Role: {task.role}
          </Text>
        </View>
      )}

      <View style={commonStyles.row}>
        <Icon name="people" size={16} color={colors.textSecondary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
          Assigned: {task.assignedTo.join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filterButtons = [
    { key: 'all', label: 'All', count: tasks.length },
    { key: 'todo', label: 'To Do', count: tasks.filter(t => t.status === 'todo').length },
    { key: 'in-progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length },
    { key: 'done', label: 'Done', count: tasks.filter(t => t.status === 'done').length }
  ];

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
            <Text style={commonStyles.title}>Tasks</Text>
          </View>
          <Button
            text="+ New"
            onPress={() => {
              console.log('Create new task');
              Alert.alert('Create Task', 'This will open the task creation form');
            }}
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
          />
        </View>

        {/* Filter Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
        >
          <View style={commonStyles.row}>
            {filterButtons.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  commonStyles.card,
                  {
                    marginRight: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: activeFilter === filter.key ? colors.primary : colors.background,
                    borderColor: activeFilter === filter.key ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setActiveFilter(filter.key as any)}
              >
                <Text style={[
                  commonStyles.text,
                  {
                    color: activeFilter === filter.key ? colors.background : colors.text,
                    fontWeight: '600'
                  }
                ]}>
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Tasks List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: 40 }}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(renderTask)
            ) : (
              <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
                <Icon name="checkmark-circle" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                  No tasks found
                </Text>
                <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
                  {activeFilter === 'all' 
                    ? 'Create your first task to get started'
                    : `No tasks with status "${getStatusText(activeFilter)}"`
                  }
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
