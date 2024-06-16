import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, Slot } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (!hasLaunched) {
        setInitialRoute('explainer');
      } else {
        setInitialRoute('(tabs)');
      }
      if (loaded) {
        SplashScreen.hideAsync();
      }
    };

    checkFirstLaunch();
  }, [loaded]);

  useEffect(() => {
    if (initialRoute) {
      // Wait for the next tick to ensure the layout is fully rendered
      setTimeout(() => {
        router.push(initialRoute);
      }, 0);
    }
  }, [initialRoute]);

  if (!loaded || initialRoute === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="explainer" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
