import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRecipeStore } from '../store/useRecipeStore';
import { usePantryStore } from '../store/usePantryStore';
import { useMealPlanStore } from '../store/useMealPlanStore';
import { theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const DashboardScreen = () => {
  const recipes = useRecipeStore(state => state.recipes);
  const pantryItems = usePantryStore(state => state.pantryItems);
  const plannedMeals = useMealPlanStore(state => state.plannedMeals);
  const navigation = useNavigation<any>();

  // Statistics calculations
  const totalRecipes = recipes.length;
  
  // Meals planned for this week (simplified: just counting all future ones or total)
  const totalPlannedMeals = plannedMeals.length;
  
  // Today's meals
  const today = new Date().toISOString().split('T')[0];
  const todaysMeals = plannedMeals.filter(m => m.date === today);

  // Expiring items (simplified logic: items with expiration date set and within 30 days)
  const expiringItems = pantryItems.filter(item => {
    if (!item.expirationDate) return false;
    const expDate = new Date(item.expirationDate);
    const timeDiff = expDate.getTime() - new Date().getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff >= 0 && daysDiff <= 30; // Expiring in next 30 days
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.headerContainer}>
        <Text style={theme.typography.h1}>Ciao Marco, {'\n'}ecco il tuo riepilogo.</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.primaryLight }]}>
          <Ionicons name="book" size={24} color={theme.colors.primaryDark} />
          <Text style={styles.statValue}>{totalRecipes}</Text>
          <Text style={styles.statLabel}>Ricette</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF9C4' }]}>
          <Ionicons name="calendar" size={24} color="#F57F17" />
          <Text style={[styles.statValue, { color: '#F57F17' }]}>{totalPlannedMeals}</Text>
          <Text style={styles.statLabel}>Pasti Previsti</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFCCBC' }]}>
          <Ionicons name="alert-circle" size={24} color="#D84315" />
          <Text style={[styles.statValue, { color: '#D84315' }]}>{expiringItems.length}</Text>
          <Text style={styles.statLabel}>In Scadenza</Text>
        </View>
      </View>

      {/* Today's Meals Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={theme.typography.h2}>Pasti di Oggi</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Meal Plan')}>
            <Text style={styles.linkText}>Vedi tutti</Text>
          </TouchableOpacity>
        </View>
        
        {todaysMeals.length > 0 ? (
          todaysMeals.map(meal => {
            const recipe = recipes.find(r => r.id === meal.recipeId);
            return (
              <TouchableOpacity 
                key={meal.id} 
                style={styles.mealCard}
                onPress={() => {
                  if (recipe) {
                    navigation.navigate('Ricette', { screen: 'RecipeDetail', params: { id: recipe.id } });
                  } else {
                    navigation.navigate('Meal Plan');
                  }
                }}
              >
                <View style={styles.mealInfo}>
                  <Text style={styles.mealType}>{meal.mealType}</Text>
                  <Text style={styles.mealRecipeName}>{recipe?.name || 'Ricetta rimossa'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={theme.typography.bodySmall}>Nessun pasto pianificato per oggi.</Text>
          </View>
        )}
      </View>

      {/* Expiring Soon Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={theme.typography.h2}>Prodotti in Scadenza</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Dispensa')}>
            <Text style={styles.linkText}>Vai a Dispensa</Text>
          </TouchableOpacity>
        </View>

        {expiringItems.length > 0 ? (
          expiringItems.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.pantryCard}
              onPress={() => navigation.navigate('Dispensa')}
            >
              <View style={styles.pantryIconContainer}>
                <Ionicons name="basket" size={20} color={theme.colors.error} />
              </View>
              <View style={styles.pantryInfo}>
                <Text style={styles.pantryName}>{item.name}</Text>
                <Text style={styles.pantryExp}>Scade: {item.expirationDate}</Text>
              </View>
              <Text style={styles.pantryQty}>{item.quantity} {item.unit}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={theme.typography.bodySmall}>Nessun prodotto in scadenza a breve.</Text>
          </View>
        )}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.m,
  },
  headerContainer: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
    ...theme.shadows.card,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    ...theme.typography.label,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  mealRecipeName: {
    ...theme.typography.h3,
    fontSize: 16,
  },
  emptyState: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pantryCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
    ...theme.shadows.card,
  },
  pantryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  pantryInfo: {
    flex: 1,
  },
  pantryName: {
    ...theme.typography.h3,
    fontSize: 16,
  },
  pantryExp: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    marginTop: 2,
  },
  pantryQty: {
    ...theme.typography.h3,
    fontSize: 16,
    color: theme.colors.primary,
  }
});
