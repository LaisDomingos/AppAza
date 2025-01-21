// LoadingScreen.tsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={styles.text}>Cargando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#17519A',
  },
  text: {
    marginTop: 16,
    fontSize: 20,
    color: '#ffffff',
  },
});

export default LoadingScreen;
