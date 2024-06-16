import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Explainer: undefined;
  Home: undefined;
};

type ExplainerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Explainer'>;

const ExplainerScreen: React.FC = () => {
  const navigation = useNavigation<ExplainerScreenNavigationProp>();

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenExplainer', 'true');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to our App!</Text>
      <Button title="Skip" onPress={handleSkip} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExplainerScreen;
