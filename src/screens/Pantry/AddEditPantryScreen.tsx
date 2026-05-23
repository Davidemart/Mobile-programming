import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePantryStore } from '../../store/usePantryStore';
import { theme } from '../../utils/theme';
import { RecipeCategory, Unit } from '../../types';

export const AddEditPantryScreen = () => {
  const navigation = useNavigation<any>();
  const { addPantryItem } = usePantryStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<RecipeCategory | 'Generico'>('Generico');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<Unit>('g');
  const [expirationDate, setExpirationDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!name || !quantity) {
      Alert.alert('Errore', 'Inserisci nome e quantità');
      return;
    }

    addPantryItem({
      name,
      category,
      quantity: parseFloat(quantity) || 0,
      unit,
      expirationDate: expirationDate || undefined,
      notes
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome Prodotto *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Es. Pasta" />

      <Text style={styles.label}>Categoria</Text>
      <TextInput style={styles.input} value={category} onChangeText={(t) => setCategory(t as any)} placeholder="Es. Generico" />

      <View style={styles.row}>
        <View style={styles.halfCol}>
          <Text style={styles.label}>Quantità *</Text>
          <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="500" />
        </View>
        <View style={styles.halfCol}>
          <Text style={styles.label}>Unità (g, ml, pz)</Text>
          <TextInput style={styles.input} value={unit} onChangeText={(t) => setUnit(t as any)} placeholder="g" />
        </View>
      </View>

      <Text style={styles.label}>Data Scadenza (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={expirationDate} onChangeText={setExpirationDate} placeholder="2025-12-31" />

      <Text style={styles.label}>Note</Text>
      <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} multiline placeholder="Note opzionali..." />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salva in Dispensa</Text>
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
  saveButton: {
    backgroundColor: theme.colors.primary,
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
