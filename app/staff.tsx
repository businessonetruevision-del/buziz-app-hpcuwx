
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

interface StaffMember {
  id: string;
  name: string;
  employeeNumber: string;
  role: string;
  email: string;
  phone?: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
  isHeadManager?: boolean;
  isCreator?: boolean;
  avatar?: string;
}

export default function StaffScreen() {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'John Doe',
      employeeNumber: '#00001',
      role: 'Creator/Manager',
      email: 'john.doe@buziz.com',
      phone: '+1 (555) 123-4567',
      department: 'Management',
      joinDate: '2024-01-01',
      status: 'active',
      isCreator: true
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      employeeNumber: '#00002',
      role: 'Head Manager',
      email: 'sarah.wilson@buziz.com',
      phone: '+1 (555) 234-5678',
      department: 'Operations',
      joinDate: '2024-01-02',
      status: 'active',
      isHeadManager: true
    },
    {
      id: '3',
      name: 'Mike Johnson',
      employeeNumber: '#00003',
      role: 'Cashier',
      email: 'mike.johnson@buziz.com',
      phone: '+1 (555) 345-6789',
      department: 'Sales',
      joinDate: '2024-01-03',
      status: 'active'
    },
    {
      id: '4',
      name: 'Emma Davis',
      employeeNumber: '#00004',
      role: 'Inventory Specialist',
      email: 'emma.davis@buziz.com',
      phone: '+1 (555) 456-7890',
      department: 'Operations',
      joinDate: '2024-01-04',
      status: 'active'
    },
    {
      id: '5',
      name: 'Tom Brown',
      employeeNumber: '#00005',
      role: 'Technician',
      email: 'tom.brown@buziz.com',
      phone: '+1 (555) 567-8901',
      department: 'Technical',
      joinDate: '2024-01-05',
      status: 'active'
    },
    {
      id: '6',
      name: 'Alex Chen',
      employeeNumber: '#00006',
      role: 'Security Guard',
      email: 'alex.chen@buziz.com',
      phone: '+1 (555) 678-9012',
      department: 'Security',
      joinDate: '2024-01-06',
      status: 'active'
    }
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const departments = ['all', ...Array.from(new Set(staff.map(member => member.department)))];

  const filteredStaff = staff.filter(member => {
    const departmentMatch = selectedDepartment === 'all' || member.department === selectedDepartment;
    const statusMatch = selectedStatus === 'all' || member.status === selectedStatus;
    return departmentMatch && statusMatch;
  });

  const getRoleColor = (member: StaffMember) => {
    if (member.isCreator) return colors.primary;
    if (member.isHeadManager) return colors.accent;
    return colors.textSecondary;
  };

  const getRoleIcon = (member: StaffMember) => {
    if (member.isCreator) return 'star';
    if (member.isHeadManager) return 'shield-checkmark';
    return 'person';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderStaffMember = (member: StaffMember) => (
    <TouchableOpacity
      key={member.id}
      style={[
        commonStyles.card, 
        { 
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: getRoleColor(member)
        }
      ]}
      onPress={() => {
        console.log(`View staff member: ${member.name}`);
        Alert.alert(
          member.name,
          `Employee #: ${member.employeeNumber}\nRole: ${member.role}\nDepartment: ${member.department}\nEmail: ${member.email}\nPhone: ${member.phone || 'Not provided'}\nJoined: ${formatDate(member.joinDate)}\nStatus: ${member.status}`,
          [
            { text: 'OK' },
            { text: 'Contact', onPress: () => console.log(`Contact ${member.name}`) }
          ]
        );
      }}
      activeOpacity={0.7}
    >
      <View style={[commonStyles.spaceBetween, { marginBottom: 12 }]}>
        <View style={commonStyles.row}>
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12
          }}>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
              {member.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 16 }]}>
              {member.name}
            </Text>
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              {member.employeeNumber} • {member.department}
            </Text>
          </View>
        </View>
        <View style={[commonStyles.badge, { backgroundColor: getRoleColor(member) }]}>
          <Icon 
            name={getRoleIcon(member)} 
            size={12} 
            color={colors.background} 
            style={{ marginRight: 4 }}
          />
          <Text style={[commonStyles.badgeText, { color: colors.background }]}>
            {member.isCreator ? 'Creator' : member.isHeadManager ? 'Head Manager' : member.role}
          </Text>
        </View>
      </View>

      <View style={[commonStyles.row, { marginBottom: 8 }]}>
        <Icon name="briefcase" size={16} color={colors.textSecondary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8, flex: 1 }]}>
          {member.role}
        </Text>
        <View style={[
          commonStyles.badge,
          { 
            backgroundColor: member.status === 'active' ? colors.success : colors.error
          }
        ]}>
          <Text style={[commonStyles.badgeText, { color: colors.background }]}>
            {member.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={[commonStyles.row, { marginBottom: 8 }]}>
        <Icon name="mail" size={16} color={colors.textSecondary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8, flex: 1 }]}>
          {member.email}
        </Text>
      </View>

      {member.phone && (
        <View style={[commonStyles.row, { marginBottom: 8 }]}>
          <Icon name="call" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            {member.phone}
          </Text>
        </View>
      )}

      <View style={[commonStyles.row]}>
        <Icon name="calendar" size={16} color={colors.textSecondary} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
          Joined: {formatDate(member.joinDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const statusFilters = [
    { key: 'all', label: 'All Staff' },
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' }
  ];

  const activeStaffCount = staff.filter(member => member.status === 'active').length;
  const managersCount = staff.filter(member => member.isCreator || member.isHeadManager).length;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.spaceBetween, { paddingTop: 20, marginBottom: 24 }]}>
          <View>
            <Text style={commonStyles.title}>Staff Directory</Text>
            <Text style={commonStyles.textSecondary}>
              {filteredStaff.length} member{filteredStaff.length !== 1 ? 's' : ''}
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

        {/* Summary Cards */}
        <View style={[commonStyles.row, { marginBottom: 20 }]}>
          <View style={[commonStyles.card, { flex: 1, marginRight: 8, alignItems: 'center' }]}>
            <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.success }]}>
              {activeStaffCount}
            </Text>
            <Text style={commonStyles.textSecondary}>Active Staff</Text>
          </View>
          <View style={[commonStyles.card, { flex: 1, marginLeft: 8, alignItems: 'center' }]}>
            <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.primary }]}>
              {managersCount}
            </Text>
            <Text style={commonStyles.textSecondary}>Managers</Text>
          </View>
        </View>

        {/* Department Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          <View style={[commonStyles.row, { paddingHorizontal: 4 }]}>
            {departments.map((department) => (
              <TouchableOpacity
                key={department}
                style={[
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    backgroundColor: selectedDepartment === department ? colors.primary : colors.backgroundAlt,
                    borderWidth: 1,
                    borderColor: selectedDepartment === department ? colors.primary : colors.border
                  }
                ]}
                onPress={() => {
                  console.log(`Filter by department: ${department}`);
                  setSelectedDepartment(department);
                }}
              >
                <Text style={[
                  commonStyles.textSecondary,
                  {
                    color: selectedDepartment === department ? colors.background : colors.text,
                    fontWeight: selectedDepartment === department ? '600' : '400'
                  }
                ]}>
                  {department === 'all' ? 'All Departments' : department}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Status Filter */}
        <View style={[commonStyles.row, { marginBottom: 20, flexWrap: 'wrap' }]}>
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
                  backgroundColor: selectedStatus === filter.key ? colors.accent : colors.backgroundAlt,
                  borderWidth: 1,
                  borderColor: selectedStatus === filter.key ? colors.accent : colors.border
                }
              ]}
              onPress={() => {
                console.log(`Filter by status: ${filter.key}`);
                setSelectedStatus(filter.key as any);
              }}
            >
              <Text style={[
                commonStyles.textSecondary,
                {
                  color: selectedStatus === filter.key ? colors.background : colors.text,
                  fontWeight: selectedStatus === filter.key ? '600' : '400'
                }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add New Staff Button */}
        <Button
          text="+ Invite New Staff"
          onPress={() => {
            console.log('Invite new staff member');
            Alert.alert(
              'Invite New Staff',
              'Share your office code ABC123 with new team members to invite them to join.',
              [{ text: 'OK' }]
            );
          }}
          style={{ marginBottom: 20 }}
        />

        {/* Staff List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredStaff.length > 0 ? (
            filteredStaff.map(renderStaffMember)
          ) : (
            <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
              <Icon name="people" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, marginBottom: 8 }]}>
                No staff members found
              </Text>
              <Text style={commonStyles.textSecondary}>
                Try changing the filters or invite new staff.
              </Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
