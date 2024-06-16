// components/explainer.tsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Explainer = () => {
  const router = useRouter();
  console.log('in explainer')

  const handleDone = async () => {
    console.log('in handle done')
    await AsyncStorage.setItem('hasLaunched', 'true');
    router.push('/'); // Navigate to the home screen
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Text style={styles.text}>Here's how to use the app...</Text>
      <Button title="Got it!" onPress={handleDone} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  text: {
    fontSize: 16,
    marginVertical: 20,
    color: 'white'
  },
});

export default Explainer;
