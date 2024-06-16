// app/(tabs)/index.tsx

import { Image, StyleSheet, Platform, View } from 'react-native';
import React from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import GPT4OForm from '@/components/GPT40Form';

export default function HomeScreen() {
  return (
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
      <GPT4OForm />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
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
});
