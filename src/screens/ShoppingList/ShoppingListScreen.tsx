import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { useMealPlanStore } from '../../store/useMealPlanStore';
import { useRecipeStore } from '../../store/useRecipeStore';
import { usePantryStore } from '../../store/usePantryStore';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { ShoppingListItem } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const ShoppingListScreen = () => {
  const { shoppingList, addShoppingItem, toggleBought, deleteShoppingItem, setShoppingList } = useShoppingListStore();
  const { plannedMeals } = useMealPlanStore();
  const { recipes } = useRecipeStore();
  const { pantryItems } = usePantryStore();

  const [newItemName, setNewItemName] = useState('');

  const handleManualAdd = () => {
    if (!newItemName) return;
    addShoppingItem({
      name: newItemName,
      quantity: 1,
      unit: 'pz',
      isBought: false,
    });
    setNewItemName('');
  };

  // FEATURE AVANZATA: Generazione Automatica Lista della Spesa
  const generateShoppingList = () => {
    Alert.alert(
      "Genera Lista della Spesa",
      "Vuoi generare la lista della spesa basata sui pasti pianificati? Gli ingredienti già presenti in dispensa non verranno aggiunti.",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Genera", 
          onPress: () => {
            const requiredIngredients: Record<string, { quantity: number, unit: string }> = {};

            // 1. Raccogliamo tutti gli ingredienti necessari
            plannedMeals.forEach(meal => {
              const recipe = recipes.find(r => r.id === meal.recipeId);
              if (recipe) {
                recipe.ingredients.forEach(ing => {
                  const key = `${ing.name.toLowerCase()}_${ing.unit}`;
                  if (requiredIngredients[key]) {
                    requiredIngredients[key].quantity += ing.quantity;
                  } else {
                    requiredIngredients[key] = { quantity: ing.quantity, unit: ing.unit };
                  }
                });
              }
            });

            // 2. Sottraiamo gli ingredienti già in dispensa
            pantryItems.forEach(item => {
              const key = `${item.name.toLowerCase()}_${item.unit}`;
              if (requiredIngredients[key]) {
                requiredIngredients[key].quantity -= item.quantity;
                if (requiredIngredients[key].quantity <= 0) {
                  delete requiredIngredients[key];
                }
              }
            });

            // 3. Creiamo la nuova lista mantenendo gli elementi aggiunti manualmente
            const manualItems = shoppingList.filter(item => !item.fromMealPlan && !item.isBought);
            
            const generatedItems: ShoppingListItem[] = Object.keys(requiredIngredients).map(key => ({
              id: uuidv4(),
              name: key.split('_')[0], // Rende la prima lettera maiuscola per l'UI dopo
              quantity: requiredIngredients[key].quantity,
              unit: requiredIngredients[key].unit as any,
              isBought: false,
              fromMealPlan: true
            }));

            // Format names to capitalize first letter
            generatedItems.forEach(item => {
               item.name = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            });

            setShoppingList([...manualItems, ...generatedItems]);
          }
        }
      ]
    );
  };

  const transferToPantry = () => {
    const boughtItems = shoppingList.filter(item => item.isBought);
    if (boughtItems.length === 0) {
      Alert.alert("Nessun articolo", "Non hai spuntato nessun articolo come acquistato.");
      return;
    }

    boughtItems.forEach(item => {
      // Controllo se l'ingrediente esiste già in dispensa (stesso nome e unità)
      const existingItem = pantryItems.find(p => p.name.toLowerCase() === item.name.toLowerCase() && p.unit === item.unit);
      
      if (existingItem) {
        usePantryStore.getState().updatePantryItem(existingItem.id, {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity
        });
      } else {
        usePantryStore.getState().addPantryItem({
          name: item.name,
          category: 'Generico',
          quantity: item.quantity,
          unit: item.unit
        });
      }
    });

    // Rimuovi dalla lista della spesa
    setShoppingList(shoppingList.filter(item => !item.isBought));
    Alert.alert("Trasferimento completato", "Gli articoli acquistati sono stati aggiunti alla dispensa.");
  };

  const renderItem = ({ item }: { item: ShoppingListItem }) => (
    <View style={styles.listItem}>
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={() => toggleBought(item.id)}
      >
        <Ionicons 
          name={item.isBought ? "checkmark-circle" : "ellipse-outline"} 
          size={28} 
          color={item.isBought ? theme.colors.success : theme.colors.textSecondary} 
        />
      </TouchableOpacity>
      
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, item.isBought && styles.itemBoughtText]}>
          {item.name}
        </Text>
        <View style={styles.itemMetaRow}>
          <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
          {item.fromMealPlan && (
            <View style={styles.autoBadge}>
              <Ionicons name="flash" size={12} color={theme.colors.secondary} />
              <Text style={styles.autoText}>Auto</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={() => deleteShoppingItem(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Auto Generate Button (Feature Avanzata) */}
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.generateBtn} onPress={generateShoppingList}>
          <Ionicons name="color-wand" size={20} color={theme.colors.surface} />
          <Text style={styles.generateBtnText}>Genera da Meal Plan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.generateBtn, { backgroundColor: theme.colors.primary, marginTop: 10 }]} onPress={transferToPantry}>
          <Ionicons name="log-in-outline" size={20} color={theme.colors.surface} />
          <Text style={styles.generateBtnText}>Sposta acquistati in Dispensa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={shoppingList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Lista della spesa vuota.</Text>
        }
      />

      {/* Manual Add Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Aggiungi prodotto..."
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={handleManualAdd}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleManualAdd}>
          <Ionicons name="add" size={24} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerArea: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
  },
  generateBtn: {
    flexDirection: 'row',
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateBtnText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: theme.spacing.s,
  },
  list: {
    padding: theme.spacing.m,
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
    ...theme.shadows.card,
  },
  checkbox: {
    marginRight: theme.spacing.m,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...theme.typography.body,
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemBoughtText: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemQuantity: {
    ...theme.typography.bodySmall,
    color: theme.colors.primaryDark,
  },
  autoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: theme.spacing.s,
  },
  autoText: {
    fontSize: 10,
    color: theme.colors.secondary,
    marginLeft: 2,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    marginRight: theme.spacing.m,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
