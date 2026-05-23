import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecipeStore } from '../../store/useRecipeStore';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { Ingredient, RecipeCategory, Difficulty, Unit } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const AddEditRecipeScreen = () => {
  const navigation = useNavigation<any>();
  const { addRecipe } = useRecipeStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('Primo');
  const [prepTime, setPrepTime] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Facile');
  const [portions, setPortions] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Form for new ingredient
  const [ingName, setIngName] = useState('');
  const [ingQty, setIngQty] = useState('');
  const [ingUnit, setIngUnit] = useState<Unit>('g');

  const handleAddIngredient = () => {
    if (!ingName || !ingQty) return;
    const newIng: Ingredient = {
      id: uuidv4(),
      name: ingName,
      quantity: parseFloat(ingQty) || 0,
      unit: ingUnit,
    };
    setIngredients([...ingredients, newIng]);
    setIngName('');
    setIngQty('');
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const handleSave = () => {
    if (!name || !prepTime || !portions) {
      Alert.alert('Errore', 'Compila i campi obbligatori (Nome, Tempo, Porzioni)');
      return;
    }

    addRecipe({
      name,
      description,
      category,
      prepTime: parseInt(prepTime) || 0,
      difficulty,
      portions: parseInt(portions) || 1,
      ingredients,
      notes,
      imageUrl: imageUrl || undefined
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome Ricetta *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Es. Pasta al Pomodoro" />

      <Text style={styles.label}>Descrizione</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline placeholder="Breve descrizione..." />

      <View style={styles.row}>
        <View style={styles.halfCol}>
          <Text style={styles.label}>Tempo (min) *</Text>
          <TextInput style={styles.input} value={prepTime} onChangeText={setPrepTime} keyboardType="numeric" placeholder="15" />
        </View>
        <View style={styles.halfCol}>
          <Text style={styles.label}>Porzioni *</Text>
          <TextInput style={styles.input} value={portions} onChangeText={setPortions} keyboardType="numeric" placeholder="2" />
        </View>
      </View>

      <Text style={styles.label}>URL Immagine</Text>
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." />

      <View style={styles.sectionDivider} />

      <Text style={theme.typography.h2}>Ingredienti</Text>
      {ingredients.map(ing => (
        <View key={ing.id} style={styles.ingredientItem}>
          <Text style={styles.ingText}>{ing.name} - {ing.quantity} {ing.unit}</Text>
          <TouchableOpacity onPress={() => handleRemoveIngredient(ing.id)}>
            <Ionicons name="close-circle" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.addIngredientContainer}>
        <TextInput style={[styles.input, { flex: 2, marginRight: 8 }]} value={ingName} onChangeText={setIngName} placeholder="Ingrediente" />
        <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} value={ingQty} onChangeText={setIngQty} keyboardType="numeric" placeholder="Qtà" />
        <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
          <Ionicons name="add" size={20} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.label}>Note</Text>
      <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} multiline placeholder="Note aggiuntive..." />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salva Ricetta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.m,
  },
  label: {
    ...theme.typography.label,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.s,
  },
  input: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.s,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCol: {
    flex: 0.48,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.l,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.s,
    marginBottom: theme.spacing.xs,
  },
  ingText: {
    ...theme.typography.body,
  },
  addIngredientContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.s,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
  },
  saveButton: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: 40,
  },
  saveButtonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
