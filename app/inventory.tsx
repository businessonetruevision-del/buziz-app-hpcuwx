
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
}

export default function InventoryScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'low-stock' | 'out-of-stock'>('all');
  
  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Printer Paper',
      category: 'Office Supplies',
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      unit: 'packs',
      supplier: 'Office Depot',
      lastUpdated: '2024-01-10',
      cost: 12.99
    },
    {
      id: '2',
      name: 'Coffee Beans',
      category: 'Beverages',
      currentStock: 0,
      minStock: 5,
      maxStock: 20,
      unit: 'bags',
      supplier: 'Local Roastery',
      lastUpdated: '2024-01-08',
      cost: 15.50
    },
    {
      id: '3',
      name: 'Hand Sanitizer',
      category: 'Health & Safety',
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unit: 'bottles',
      supplier: 'Medical Supply Co',
      lastUpdated: '2024-01-12',
      cost: 3.99
    },
    {
      id: '4',
      name: 'Cleaning Supplies',
      category: 'Maintenance',
      currentStock: 3,
      minStock: 8,
      maxStock: 25,
      unit: 'sets',
      supplier: 'Janitorial Plus',
      lastUpdated: '2024-01-09',
      cost: 24.99
    }
  ]);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'out-of-stock';
    if (item.currentStock <= item.minStock) return 'low-stock';
    return 'in-stock';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'out-of-stock':
        return colors.error;
      case 'low-stock':
        return colors.warning;
      default:
        return colors.success;
    }
  };

  const getStockText = (status: string) => {
    switch (status) {
      case 'out-of-stock':
        return 'Out of Stock';
      case 'low-stock':
        return 'Low Stock';
      default:
        return 'In Stock';
    }
  };

  const filteredInventory = inventory.filter(item => {
    const status = getStockStatus(item);
    if (activeFilter === 'all') return true;
    return status === activeFilter;
  });

  const renderInventoryItem = (item: InventoryItem) => {
    const status = getStockStatus(item);
    
    return (
      <TouchableOpacity
        key={item.id}
        style={commonStyles.card}
        onPress={() => {
          console.log('View item details:', item.id);
          Alert.alert(
            'Item Details', 
            `${item.name}\nCurrent Stock: ${item.currentStock} ${item.unit}\nMin Stock: ${item.minStock} ${item.unit}\nCost: $${item.cost}`
          );
        }}
        activeOpacity={0.7}
      >
        <View style={[commonStyles.spaceBetween, { marginBottom: 8 }]}>
          <Text style={[commonStyles.text, { fontWeight: '600' }]}>
            {item.name}
          </Text>
          <View style={[commonStyles.badge, { backgroundColor: getStockColor(status) }]}>
            <Text style={commonStyles.badgeText}>
              {getStockText(status)}
            </Text>
          </View>
        </View>
        
        <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>
          {item.category}
        </Text>

        <View style={[commonStyles.row, { marginBottom: 8 }]}>
          <Icon name="cube" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
            Stock: {item.currentStock} / {item.maxStock} {item.unit}
          </Text>
        </View>

        {item.supplier && (
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Icon name="business" size={16} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
              Supplier: {item.supplier}
            </Text>
          </View>
        )}

        <View style={[commonStyles.spaceBetween]}>
          <View style={commonStyles.row}>
            <Icon name="pricetag" size={16} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
              ${item.cost} per {item.unit.slice(0, -1)}
            </Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            Updated: {item.lastUpdated}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filterButtons = [
    { key: 'all', label: 'All Items', count: inventory.length },
    { key: 'low-stock', label: 'Low Stock', count: inventory.filter(i => getStockStatus(i) === 'low-stock').length },
    { key: 'out-of-stock', label: 'Out of Stock', count: inventory.filter(i => getStockStatus(i) === 'out-of-stock').length }
  ];

  const lowStockCount = inventory.filter(i => getStockStatus(i) === 'low-stock').length;
  const outOfStockCount = inventory.filter(i => getStockStatus(i) === 'out-of-stock').length;

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
            <Text style={commonStyles.title}>Inventory</Text>
          </View>
          <Button
            text="+ Add"
            onPress={() => {
              console.log('Add new inventory item');
              Alert.alert('Add Item', 'This will open the item creation form');
            }}
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
          />
        </View>

        {/* Alerts Summary */}
        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <View style={[commonStyles.card, { marginBottom: 24, backgroundColor: colors.backgroundAlt }]}>
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <Icon name="warning" size={20} color={colors.warning} />
              <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>
                Stock Alerts
              </Text>
            </View>
            {outOfStockCount > 0 && (
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
                • {outOfStockCount} item{outOfStockCount > 1 ? 's' : ''} out of stock
              </Text>
            )}
            {lowStockCount > 0 && (
              <Text style={commonStyles.textSecondary}>
                • {lowStockCount} item{lowStockCount > 1 ? 's' : ''} running low
              </Text>
            )}
          </View>
        )}

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

        {/* Inventory List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: 40 }}>
            {filteredInventory.length > 0 ? (
              filteredInventory.map(renderInventoryItem)
            ) : (
              <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
                <Icon name="cube" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                  No items found
                </Text>
                <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
                  {activeFilter === 'all' 
                    ? 'Add your first inventory item to get started'
                    : `No items matching "${activeFilter}" filter`
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
