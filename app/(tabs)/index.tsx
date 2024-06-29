// app/(tabs)/index.tsx
import { Image, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useRef } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import GPT4OForm, { GPT4OFormRef } from '@/components/GPT40Form';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const gpt4oFormRef = useRef<GPT4OFormRef>(null);

  const handleCameraPress = () => {
    gpt4oFormRef.current?.handleTakePhoto();
  };

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#E3CAA1', dark: '#E3CAA1' }}
        headerImage={
          <View style={styles.headerImageContainer}>
            <Image
              source={require('@/assets/images/adaptive-archie.png')}
              style={styles.reactLogo}
            />
          </View>
        }
      >
        <View style={styles.headerExtension}>
          <View style={styles.lineContainer}>
            <View style={styles.leftLine} />
            <View style={styles.rightLine} />
          </View>
          <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
            <Ionicons name="camera" size={40} color="white" />
          </TouchableOpacity>
        </View>
        <GPT4OForm ref={gpt4oFormRef} />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
  },
  headerExtension: {
    height: 40, // Half the height of the camera button
    backgroundColor: '#E3CAA1', // Same as header background
    position: 'relative',
  },
  lineContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  leftLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#3D5467',
  },
  rightLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#3D5467',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -40, // Half the height of the button
    left: screenWidth / 2 - 40, // Half the width of the button
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3D5467',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});