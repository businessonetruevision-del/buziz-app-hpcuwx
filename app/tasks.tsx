
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
  createdAt: string;
  category?: string;
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Update Inventory System',
      description: 'Review and update the current inventory tracking system with new supplier information',
      deadline: '2024-01-20',
      priority: 'high',
      status: 'in-progress',
      assignedTo: ['Sarah Wilson', 'Mike Johnson'],
      role: 'Manager',
      createdBy: 'John Doe',
      createdAt: '2024-01-10',
      category: 'Inventory'
    },
    {
      id: '2',
      title: 'Prepare Monthly Report',
      description: 'Compile sales data and performance metrics for January',
      deadline: '2024-01-25',
      priority: 'medium',
      status: 'todo',
      assignedTo: ['Emma Davis'],
      createdBy: 'John Doe',
      createdAt: '2024-01-12',
      category: 'Reports'
    },
    {
      id: '3',
      title: 'Staff Training Session',
      description: 'Conduct training on new POS system for all cashiers',
      deadline: '2024-01-18',
      priority: 'high',
      status: 'todo',
      assignedTo: ['Tom Brown', 'Alex Chen'],
      role: 'Cashier',
      createdBy: 'Sarah Wilson',
      createdAt: '2024-01-08',
      category: 'Training'
    },
    {
      id: '4',
      title: 'Clean Storage Area',
      description: 'Deep clean and organize the back storage area',
      deadline: '2024-01-16',
      priority: 'low',
      status: 'done',
      assignedTo: ['Mike Johnson'],
      createdBy: 'John Doe',
      createdAt: '2024-01-05',
      category: 'Maintenance'
    },
    {
      id: '5',
      title: 'Customer Feedback Review',
      description: 'Analyze customer feedback from last month and create action plan',
      deadline: '2024-01-22',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: ['Emma Davis', 'Sarah Wilson'],
      createdBy: 'John Doe',
      createdAt: '2024-01-11',
      category: 'Customer Service'
    },
    {
      id: '6',
      title: 'Security System Check',
      description: 'Test all security cameras and alarm systems',
      deadline: '2024-01-19',
      priority: 'high',
      status: 'todo',
      assignedTo: ['Alex Chen'],
      role: 'Security',
      createdBy: 'John Doe',
      createdAt: '2024-01-13',
      category: 'Security'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return colors.success;
      case 'in-progress':
        return colors.warning;
      case 'todo':
        return colors.textSecondary;
      default:
        return colors.text;
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

  const isOverdue = (deadline: string, status: string) => {
    if (status === 'done') return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = selectedFilter === 'all' || task.status === selectedFilter;
    const priorityMatch = selectedPriority === 'all' || task.priority === selectedPriority;
    return statusMatch && priorityMatch;
  });

  const updateTaskStatus = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    console.log(`Task ${taskId} status updated to ${newStatus}`);
  };

  const renderTask = (task: Task) => {
    const overdue = isOverdue(task.deadline, task.status);
    
    return (
      <TouchableOpacity
        key={task.id}
        style={[
          commonStyles.card, 
          { 
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: getPriorityColor(task.priority)
          }
        ]}
        onPress={() => {
          console.log(`View task details: ${task.title}`);
          Alert.alert(
            task.title,
            `${task.description}\n\nDeadline: ${formatDate(task.deadline)}\nPriority: ${task.priority.toUpperCase()}\nAssigned to: ${task.assignedTo.join(', ')}\nCreated by: ${task.createdBy}`,
            [
              { text: 'Cancel', style: 'cancel' },
              task.status !== 'todo' && {
                text: 'Mark To Do',
                onPress: () => updateTaskStatus(task.id, 'todo')
              },
              task.status !== 'in-progress' && {
                text: 'Mark In Progress',
                onPress: () => updateTaskStatus(task.id, 'in-progress')
              },
              task.status !== 'done' && {
                text: 'Mark Done',
                onPress: () => updateTaskStatus(task.id, 'done')
              }
            ].filter(Boolean) as any
          );
        }}
        activeOpacity={0.7}
      >
        <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
          <View style={{ flex: 1 }}>
            <Text style={[
              commonStyles.text, 
              { 
                fontWeight: '600', 
                fontSize: 16,
                textDecorationLine: task.status === 'done' ? 'line-through' : 'none',
                color: task.status === 'done' ? colors.textSecondary : colors.text
              }
            ]}>
              {task.title}
            </Text>
            {task.category && (
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 2 }]}>
                {task.category}
              </Text>
            )}
          </View>
          <View style={[commonStyles.badge, { backgroundColor: getStatusColor(task.status) }]}>
            <Text style={[commonStyles.badgeText, { color: colors.background }]}>
              {getStatusText(task.status)}
            </Text>
          </View>
        </View>

        <Text style={[
          commonStyles.textSecondary, 
          { 
            marginBottom: 12,
            opacity: task.status === 'done' ? 0.6 : 1
          }
        ]}>
          {task.description}
        </Text>

        <View style={[commonStyles.row, { marginBottom: 8 }]}>
          <Icon name="calendar" size={16} color={overdue ? colors.error : colors.textSecondary} />
          <Text style={[
            commonStyles.textSecondary, 
            { 
              marginLeft: 8,
              color: overdue ? colors.error : colors.textSecondary,
              fontWeight: overdue ? '600' : '400'
            }
          ]}>
            Due: {formatDate(task.deadline)} {overdue && '(Overdue)'}
          </Text>
          <View style={[
            commonStyles.badge, 
            { 
              backgroundColor: getPriorityColor(task.priority),
              marginLeft: 12
            }
          ]}>
            <Text style={[commonStyles.badgeText, { color: colors.background }]}>
              {task.priority.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={[commonStyles.row, { marginBottom: 8 }]}>
          <Icon name="people" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8, flex: 1 }]}>
            {task.assignedTo.join(', ')}
          </Text>
        </View>

        {task.role && (
          <View style={[commonStyles.row]}>
            <Icon name="person-circle" size={16} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
              Role: {task.role}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'todo', label: 'To Do' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'done', label: 'Done' }
  ];

  const priorityFilters = [
    { key: 'all', label: 'All Priority' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' }
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.spaceBetween, { paddingTop: 20, marginBottom: 24 }]}>
          <View>
            <Text style={commonStyles.title}>Tasks</Text>
            <Text style={commonStyles.textSecondary}>
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
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

        {/* Status Filter Buttons */}
        <View style={[commonStyles.row, { marginBottom: 12, flexWrap: 'wrap' }]}>
          {statusFilters.map((filter) => (
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
                console.log(`Filter by status: ${filter.key}`);
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

        {/* Priority Filter Buttons */}
        <View style={[commonStyles.row, { marginBottom: 20, flexWrap: 'wrap' }]}>
          {priorityFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                {
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                  marginBottom: 8,
                  backgroundColor: selectedPriority === filter.key ? colors.accent : colors.backgroundAlt,
                  borderWidth: 1,
                  borderColor: selectedPriority === filter.key ? colors.accent : colors.border
                }
              ]}
              onPress={() => {
                console.log(`Filter by priority: ${filter.key}`);
                setSelectedPriority(filter.key as any);
              }}
            >
              <Text style={[
                commonStyles.textSecondary,
                {
                  color: selectedPriority === filter.key ? colors.background : colors.text,
                  fontWeight: selectedPriority === filter.key ? '600' : '400'
                }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add New Task Button */}
        <Button
          text="+ Create New Task"
          onPress={() => {
            console.log('Create new task');
            Alert.alert(
              'Create New Task',
              'This feature will allow you to create and assign new tasks to team members.',
              [{ text: 'OK' }]
            );
          }}
          style={{ marginBottom: 20 }}
        />

        {/* Tasks List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(renderTask)
          ) : (
            <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
              <Icon name="checkmark-circle" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, marginBottom: 8 }]}>
                No tasks found
              </Text>
              <Text style={commonStyles.textSecondary}>
                Try changing the filters or create a new task.
              </Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
