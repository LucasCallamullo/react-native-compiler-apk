import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  // Estado para controlar qué pantalla mostrar
  const [showSecondScreen, setShowSecondScreen] = useState(false);

  // Función para cambiar a la segunda pantalla
  const goToSecondScreen = () => {
    setShowSecondScreen(true);
  };

  // Función para volver a la pantalla principal
  const goBack = () => {
    setShowSecondScreen(false);
  };

  // Pantalla principal
  if (!showSecondScreen) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se permiten Lucas</Text>
        <Text style={styles.subtitle}>Versión 0.1 - Prototipo</Text>
        
        {/* Botón principal */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={goToSecondScreen}
        >
          <Text style={styles.buttonText}>Banear Lucas!</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    );
  }

  // Segunda pantalla
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cantidad actual de Lucas: 1</Text>
      <Text style={styles.subtitle}>Desgraciadamente no te vas a salvar de algún Lucas</Text>
      
      {/* Botón para volver */}
      <TouchableOpacity 
        style={[styles.button, styles.buttonSecondary]} 
        onPress={goBack}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});