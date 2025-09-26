
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';

interface Message {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  timestamp: string;
  targetRole?: string;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  type: 'announcement' | 'message' | 'alert';
}

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      title: 'New POS System Training',
      content: 'All cashiers are required to attend the new POS system training session scheduled for tomorrow at 2 PM. Please confirm your attendance.',
      author: 'Sarah Wilson',
      authorRole: 'Head Manager',
      timestamp: '2024-01-15T10:30:00Z',
      targetRole: 'Cashier',
      priority: 'high',
      isRead: false,
      type: 'announcement'
    },
    {
      id: '2',
      title: 'Inventory Count Reminder',
      content: 'Monthly inventory count is scheduled for this Friday. All inventory specialists please prepare the necessary equipment and forms.',
      author: 'John Doe',
      authorRole: 'Manager',
      timestamp: '2024-01-15T08:15:00Z',
      targetRole: 'Inventory Specialist',
      priority: 'medium',
      isRead: true,
      type: 'announcement'
    },
    {
      id: '3',
      title: 'Security Alert',
      content: 'Please be aware that there have been reports of suspicious activity in the parking area. Security team to increase patrols.',
      author: 'John Doe',
      authorRole: 'Manager',
      timestamp: '2024-01-14T16:45:00Z',
      priority: 'high',
      isRead: false,
      type: 'alert'
    },
    {
      id: '4',
      title: 'Team Meeting Notes',
      content: 'Summary from today&apos;s team meeting: Q1 goals discussed, new supplier contracts approved, staff appreciation event planned for next month.',
      author: 'Sarah Wilson',
      authorRole: 'Head Manager',
      timestamp: '2024-01-14T14:20:00Z',
      priority: 'low',
      isRead: true,
      type: 'message'
    },
    {
      id: '5',
      title: 'Equipment Maintenance',
      content: 'The coffee machine in the break room will be serviced tomorrow morning. Alternative arrangements have been made.',
      author: 'Tom Brown',
      authorRole: 'Technician',
      timestamp: '2024-01-14T11:30:00Z',
      priority: 'low',
      isRead: true,
      type: 'announcement'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'announcement' | 'message' | 'alert'>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showComposeSheet, setShowComposeSheet] = useState(false);
  const [newMessage, setNewMessage] = useState({
    title: '',
    content: '',
    targetRole: 'all',
    priority: 'medium' as 'low' | 'medium' | 'high',
    type: 'announcement' as 'announcement' | 'message' | 'alert'
  });

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return colors.error;
      case 'announcement':
        return colors.primary;
      case 'message':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return 'warning';
      case 'announcement':
        return 'megaphone';
      case 'message':
        return 'chatbubble';
      default:
        return 'document';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === messageId ? { ...message, isRead: true } : message
      )
    );
    console.log(`Message ${messageId} marked as read`);
  };

  const filteredMessages = messages.filter(message => {
    const typeMatch = selectedFilter === 'all' || message.type === selectedFilter;
    const priorityMatch = selectedPriority === 'all' || message.priority === selectedPriority;
    const readMatch = !showUnreadOnly || !message.isRead;
    return typeMatch && priorityMatch && readMatch;
  });

  const handleSendMessage = () => {
    if (!newMessage.title.trim() || !newMessage.content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content.');
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      title: newMessage.title,
      content: newMessage.content,
      author: 'John Doe',
      authorRole: 'Manager',
      timestamp: new Date().toISOString(),
      targetRole: newMessage.targetRole === 'all' ? undefined : newMessage.targetRole,
      priority: newMessage.priority,
      isRead: true,
      type: newMessage.type
    };

    setMessages(prevMessages => [message, ...prevMessages]);
    setNewMessage({
      title: '',
      content: '',
      targetRole: 'all',
      priority: 'medium',
      type: 'announcement'
    });
    setShowComposeSheet(false);
    console.log('New message sent:', message);
    Alert.alert('Success', 'Message sent successfully!');
  };

  const renderMessage = (message: Message) => (
    <TouchableOpacity
      key={message.id}
      style={[
        commonStyles.card, 
        { 
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: getTypeColor(message.type),
          backgroundColor: message.isRead ? colors.card : colors.backgroundAlt
        }
      ]}
      onPress={() => {
        console.log(`View message: ${message.title}`);
        if (!message.isRead) {
          markAsRead(message.id);
        }
        Alert.alert(
          message.title,
          `${message.content}\n\nFrom: ${message.author} (${message.authorRole})\nTime: ${formatTimestamp(message.timestamp)}${message.targetRole ? `\nTarget: ${message.targetRole}` : ''}`,
          [{ text: 'OK' }]
        );
      }}
      activeOpacity={0.7}
    >
      <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
        <View style={[commonStyles.row, { flex: 1 }]}>
          <Icon 
            name={getTypeIcon(message.type)} 
            size={20} 
            color={getTypeColor(message.type)} 
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={[
              commonStyles.text, 
              { 
                fontWeight: message.isRead ? '500' : '700', 
                fontSize: 16
              }
            ]}>
              {message.title}
            </Text>
            <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 2 }]}>
              {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
              {message.targetRole && ` • ${message.targetRole}`}
            </Text>
          </View>
        </View>
        <View style={[commonStyles.badge, { backgroundColor: getPriorityColor(message.priority) }]}>
          <Text style={[commonStyles.badgeText, { color: colors.background }]}>
            {message.priority.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={[
        commonStyles.textSecondary, 
        { 
          marginBottom: 12,
          opacity: message.isRead ? 0.8 : 1
        }
      ]}>
        {message.content.length > 120 
          ? `${message.content.substring(0, 120)}...` 
          : message.content
        }
      </Text>

      <View style={[commonStyles.spaceBetween]}>
        <View style={[commonStyles.row]}>
          <Icon name="person" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            {message.author} • {message.authorRole}
          </Text>
        </View>
        <View style={[commonStyles.row]}>
          {!message.isRead && (
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.primary,
              marginRight: 8
            }} />
          )}
          <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
            {formatTimestamp(message.timestamp)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const typeFilters = [
    { key: 'all', label: 'All Messages' },
    { key: 'announcement', label: 'Announcements' },
    { key: 'message', label: 'Messages' },
    { key: 'alert', label: 'Alerts' }
  ];

  const priorityFilters = [
    { key: 'all', label: 'All Priority' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' }
  ];

  const unreadCount = messages.filter(message => !message.isRead).length;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.spaceBetween, { paddingTop: 20, marginBottom: 24 }]}>
          <View>
            <Text style={commonStyles.title}>Messages</Text>
            <Text style={commonStyles.textSecondary}>
              {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
              {unreadCount > 0 && ` • ${unreadCount} unread`}
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

        {/* Quick Actions */}
        <View style={[commonStyles.row, { marginBottom: 20 }]}>
          <Button
            text="+ Compose"
            onPress={() => {
              console.log('Compose new message');
              setShowComposeSheet(true);
            }}
            style={{ flex: 1, marginRight: 8 }}
          />
          <TouchableOpacity
            style={[
              {
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: showUnreadOnly ? colors.primary : colors.backgroundAlt,
                borderWidth: 1,
                borderColor: showUnreadOnly ? colors.primary : colors.border,
                alignItems: 'center',
                justifyContent: 'center'
              }
            ]}
            onPress={() => {
              console.log('Toggle unread filter');
              setShowUnreadOnly(!showUnreadOnly);
            }}
          >
            <Text style={[
              commonStyles.text,
              {
                color: showUnreadOnly ? colors.background : colors.text,
                fontWeight: '600'
              }
            ]}>
              Unread Only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Type Filter */}
        <View style={[commonStyles.row, { marginBottom: 12, flexWrap: 'wrap' }]}>
          {typeFilters.map((filter) => (
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
                console.log(`Filter by type: ${filter.key}`);
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

        {/* Priority Filter */}
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

        {/* Messages List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredMessages.length > 0 ? (
            filteredMessages.map(renderMessage)
          ) : (
            <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
              <Icon name="chatbubble" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, marginBottom: 8 }]}>
                No messages found
              </Text>
              <Text style={commonStyles.textSecondary}>
                Try changing the filters or compose a new message.
              </Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {/* Compose Message Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showComposeSheet}
        onClose={() => setShowComposeSheet(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
            Compose Message
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>Title</Text>
            <TextInput
              style={commonStyles.input}
              value={newMessage.title}
              onChangeText={(text) => setNewMessage(prev => ({ ...prev, title: text }))}
              placeholder="Enter message title"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>Content</Text>
            <TextInput
              style={[commonStyles.input, { height: 100, textAlignVertical: 'top' }]}
              value={newMessage.content}
              onChangeText={(text) => setNewMessage(prev => ({ ...prev, content: text }))}
              placeholder="Enter message content"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>

          <View style={[commonStyles.row, { marginBottom: 20 }]}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[commonStyles.text, { marginBottom: 8 }]}>Type</Text>
              <View style={[commonStyles.row, { flexWrap: 'wrap' }]}>
                {['announcement', 'message', 'alert'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 16,
                        marginRight: 8,
                        marginBottom: 8,
                        backgroundColor: newMessage.type === type ? colors.primary : colors.backgroundAlt,
                        borderWidth: 1,
                        borderColor: newMessage.type === type ? colors.primary : colors.border
                      }
                    ]}
                    onPress={() => setNewMessage(prev => ({ ...prev, type: type as any }))}
                  >
                    <Text style={[
                      commonStyles.textSecondary,
                      {
                        color: newMessage.type === type ? colors.background : colors.text,
                        fontSize: 12
                      }
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[commonStyles.text, { marginBottom: 8 }]}>Priority</Text>
              <View style={[commonStyles.row, { flexWrap: 'wrap' }]}>
                {['low', 'medium', 'high'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 16,
                        marginRight: 8,
                        marginBottom: 8,
                        backgroundColor: newMessage.priority === priority ? getPriorityColor(priority) : colors.backgroundAlt,
                        borderWidth: 1,
                        borderColor: newMessage.priority === priority ? getPriorityColor(priority) : colors.border
                      }
                    ]}
                    onPress={() => setNewMessage(prev => ({ ...prev, priority: priority as any }))}
                  >
                    <Text style={[
                      commonStyles.textSecondary,
                      {
                        color: newMessage.priority === priority ? colors.background : colors.text,
                        fontSize: 12
                      }
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>
            <Button
              text="Cancel"
              onPress={() => setShowComposeSheet(false)}
              variant="outline"
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              text="Send Message"
              onPress={handleSendMessage}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
