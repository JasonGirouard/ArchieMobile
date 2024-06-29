import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Explainer = () => {
  const router = useRouter();

  const handleDone = async () => {
    console.log('in handle done');
    await AsyncStorage.setItem('hasLaunched', 'true');
    router.push('/'); // Navigate to the home screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <TouchableOpacity style={styles.readyButton} onPress={handleDone}>
          <Text style={styles.readyButtonText}>I'm ready</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Welcome to Archie</Text>
        <Text style={styles.subtitle}>
          Learn about the world around you with{'\n'}AI-powered recognition.
        </Text>
        {/* <View style={styles.imageContainer}> */}
          {/* Replace this View with an Image component when you have the actual image */}
          {/* <View style={styles.placeholderImage} /> */}
          <Image 
            source={require('@/assets/images/archie-screenshot.png')}
            style={styles.image}
            resizeMode="contain"
          />
        {/* </View> */}
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5e6d3', // Light tan background
  },
  content: {
    flex: 1,
    padding: 20,
  },
  readyButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#3D5467',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  readyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3D5467',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#3D5467',
    marginBottom: 20,
  },
  // imageContainer: {
  //   // flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  image: {
    // flexBasis: 0,
    padding: 0,
    margin: 0,
    
  //  alignSelf: 'flex-stretch',
    width: '100%',
    height: '100%',
    // borderRadius: 10,
    // borderWidth: 5,
    borderColor: '#4a6fa5',
  },
});

export default Explainer;