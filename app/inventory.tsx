
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  supplier?: string;
  lastUpdated: string;
  cost: number;
  location?: string;
  sku?: string;
}

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Office Paper A4',
      category: 'Office Supplies',
      currentStock: 15,
      minStock: 20,
      maxStock: 100,
      unit: 'packs',
      supplier: 'Office Depot',
      lastUpdated: '2024-01-14',
      cost: 8.99,
      location: 'Storage Room A',
      sku: 'OFF-001'
    },
    {
      id: '2',
      name: 'Printer Ink Cartridge',
      category: 'Office Supplies',
      currentStock: 5,
      minStock: 8,
      maxStock: 25,
      unit: 'units',
      supplier: 'Tech Supply Co',
      lastUpdated: '2024-01-12',
      cost: 45.99,
      location: 'Storage Room A',
      sku: 'OFF-002'
    },
    {
      id: '3',
      name: 'Coffee Beans',
      category: 'Pantry',
      currentStock: 12,
      minStock: 5,
      maxStock: 30,
      unit: 'bags',
      supplier: 'Local Coffee Roasters',
      lastUpdated: '2024-01-13',
      cost: 15.50,
      location: 'Kitchen',
      sku: 'PAN-001'
    },
    {
      id: '4',
      name: 'Cleaning Supplies',
      category: 'Maintenance',
      currentStock: 3,
      minStock: 10,
      maxStock: 50,
      unit: 'bottles',
      supplier: 'CleanCorp',
      lastUpdated: '2024-01-10',
      cost: 12.99,
      location: 'Janitor Closet',
      sku: 'MNT-001'
    },
    {
      id: '5',
      name: 'Laptop Chargers',
      category: 'Electronics',
      currentStock: 8,
      minStock: 5,
      maxStock: 20,
      unit: 'units',
      supplier: 'Tech Supply Co',
      lastUpdated: '2024-01-15',
      cost: 89.99,
      location: 'IT Storage',
      sku: 'ELC-001'
    },
    {
      id: '6',
      name: 'Hand Sanitizer',
      category: 'Health & Safety',
      currentStock: 25,
      minStock: 15,
      maxStock: 100,
      unit: 'bottles',
      supplier: 'Health Plus',
      lastUpdated: '2024-01-11',
      cost: 4.99,
      location: 'Reception',
      sku: 'HLT-001'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'low' | 'good' | 'overstocked'>('all');

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) {
      return 'low';
    } else if (item.currentStock >= item.maxStock * 0.9) {
      return 'overstocked';
    } else {
      return 'good';
    }
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'low':
        return colors.error;
      case 'overstocked':
        return colors.warning;
      case 'good':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getStockText = (status: string) => {
    switch (status) {
      case 'low':
        return 'Low Stock';
      case 'overstocked':
        return 'Overstocked';
      case 'good':
        return 'Good';
      default:
        return status;
    }
  };

  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))];

  const filteredInventory = inventory.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || getStockStatus(item) === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const updateStock = (itemId: string, newStock: number) => {
    setInventory(prevInventory =>
      prevInventory.map(item =>
        item.id === itemId 
          ? { ...item, currentStock: Math.max(0, newStock), lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      )
    );
    console.log(`Stock updated for item ${itemId}: ${newStock}`);
  };

  const renderInventoryItem = (item: InventoryItem) => {
    const status = getStockStatus(item);
    const stockPercentage = (item.currentStock / item.maxStock) * 100;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          commonStyles.card, 
          { 
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: getStockColor(status)
          }
        ]}
        onPress={() => {
          console.log(`View item details: ${item.name}`);
          Alert.alert(
            item.name,
            `SKU: ${item.sku || 'N/A'}\nCategory: ${item.category}\nCurrent Stock: ${item.currentStock} ${item.unit}\nMin Stock: ${item.minStock} ${item.unit}\nMax Stock: ${item.maxStock} ${item.unit}\nSupplier: ${item.supplier || 'N/A'}\nLocation: ${item.location || 'N/A'}\nCost: $${item.cost}\nLast Updated: ${item.lastUpdated}`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Add Stock (+5)',
                onPress: () => updateStock(item.id, item.currentStock + 5)
              },
              item.currentStock > 0 && {
                text: 'Remove Stock (-1)',
                onPress: () => updateStock(item.id, item.currentStock - 1)
              }
            ].filter(Boolean) as any
          );
        }}
        activeOpacity={0.7}
      >
        <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 16 }]}>
              {item.name}
            </Text>
            <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 2 }]}>
              {item.category} • SKU: {item.sku || 'N/A'}
            </Text>
          </View>
          <View style={[commonStyles.badge, { backgroundColor: getStockColor(status) }]}>
            <Text style={[commonStyles.badgeText, { color: colors.background }]}>
              {getStockText(status)}
            </Text>
          </View>
        </View>

        {/* Stock Level Bar */}
        <View style={{ marginBottom: 12 }}>
          <View style={[commonStyles.row, { justifyContent: 'space-between', marginBottom: 4 }]}>
            <Text style={[commonStyles.textSecondary, { fontSize: 14 }]}>
              Stock Level
            </Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {item.currentStock} / {item.maxStock} {item.unit}
            </Text>
          </View>
          <View style={{
            height: 8,
            backgroundColor: colors.backgroundAlt,
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <View style={{
              height: '100%',
              width: `${Math.min(stockPercentage, 100)}%`,
              backgroundColor: getStockColor(status),
              borderRadius: 4
            }} />
          </View>
        </View>

        <View style={[commonStyles.row, { marginBottom: 8 }]}>
          <Icon name="business" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8, flex: 1 }]}>
            {item.supplier || 'No supplier'}
          </Text>
          <Icon name="location" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
            {item.location || 'No location'}
          </Text>
        </View>

        <View style={[commonStyles.row, { justifyContent: 'space-between' }]}>
          <Text style={commonStyles.textSecondary}>
            Cost: ${item.cost} per {item.unit.slice(0, -1)}
          </Text>
          <Text style={commonStyles.textSecondary}>
            Updated: {item.lastUpdated}
          </Text>
        </View>

        {status === 'low' && (
          <View style={[
            commonStyles.row, 
            { 
              marginTop: 8, 
              padding: 8, 
              backgroundColor: colors.error + '10',
              borderRadius: 6 
            }
          ]}>
            <Icon name="warning" size={16} color={colors.error} />
            <Text style={[commonStyles.textSecondary, { marginLeft: 8, color: colors.error }]}>
              Restock needed! Below minimum level of {item.minStock} {item.unit}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const statusFilters = [
    { key: 'all', label: 'All Items' },
    { key: 'low', label: 'Low Stock' },
    { key: 'good', label: 'Good' },
    { key: 'overstocked', label: 'Overstocked' }
  ];

  const lowStockCount = inventory.filter(item => getStockStatus(item) === 'low').length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.spaceBetween, { paddingTop: 20, marginBottom: 24 }]}>
          <View>
            <Text style={commonStyles.title}>Inventory</Text>
            <Text style={commonStyles.textSecondary}>
              {filteredInventory.length} item{filteredInventory.length !== 1 ? 's' : ''}
              {lowStockCount > 0 && ` • ${lowStockCount} low stock alert${lowStockCount !== 1 ? 's' : ''}`}
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
              {inventory.length}
            </Text>
            <Text style={commonStyles.textSecondary}>Total Items</Text>
          </View>
          <View style={[commonStyles.card, { flex: 1, marginLeft: 8, alignItems: 'center' }]}>
            <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.primary }]}>
              ${totalValue.toFixed(0)}
            </Text>
            <Text style={commonStyles.textSecondary}>Total Value</Text>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          <View style={[commonStyles.row, { paddingHorizontal: 4 }]}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    backgroundColor: selectedCategory === category ? colors.primary : colors.backgroundAlt,
                    borderWidth: 1,
                    borderColor: selectedCategory === category ? colors.primary : colors.border
                  }
                ]}
                onPress={() => {
                  console.log(`Filter by category: ${category}`);
                  setSelectedCategory(category);
                }}
              >
                <Text style={[
                  commonStyles.textSecondary,
                  {
                    color: selectedCategory === category ? colors.background : colors.text,
                    fontWeight: selectedCategory === category ? '600' : '400'
                  }
                ]}>
                  {category === 'all' ? 'All Categories' : category}
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

        {/* Add New Item Button */}
        <Button
          text="+ Add New Item"
          onPress={() => {
            console.log('Add new inventory item');
            Alert.alert(
              'Add New Item',
              'This feature will allow you to add new items to your inventory.',
              [{ text: 'OK' }]
            );
          }}
          style={{ marginBottom: 20 }}
        />

        {/* Inventory List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredInventory.length > 0 ? (
            filteredInventory.map(renderInventoryItem)
          ) : (
            <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
              <Icon name="cube" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, marginBottom: 8 }]}>
                No items found
              </Text>
              <Text style={commonStyles.textSecondary}>
                Try changing the filters or add a new item.
              </Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
