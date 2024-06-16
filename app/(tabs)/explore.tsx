import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Dimensions, Platform } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { WebView } from 'react-native-webview';

export default function SettingsScreen() {
  const [isFAQCollapsed, setIsFAQCollapsed] = useState(true);
  const [isFeedbackCollapsed, setIsFeedbackCollapsed] = useState(true);

  const toggleFAQ = () => {
    setIsFAQCollapsed(!isFAQCollapsed);
  };

  const toggleFeedback = () => {
    setIsFeedbackCollapsed(!isFeedbackCollapsed);
  };

  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleManageSubscription = () => {
    const url = Platform.select({
      ios: 'itms-apps://apps.apple.com/account/subscriptions',
      android: 'https://play.google.com/store/account/subscriptions',
    });
    if (url) {
      handleLink(url);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <TouchableOpacity onPress={toggleFAQ}>
          <Text style={styles.sectionHeader}>FAQ</Text>
        </TouchableOpacity>
        <Collapsible collapsed={isFAQCollapsed}>
          <View style={styles.faqContent}>
            <Text style={[styles.faqText, styles.question]}>Q: How do you identify the architectural styles of buildings?</Text>
            <Text style={styles.faqText}>A: We used AI systems trained on millions of images of buildings and architectural texts. We preprocess the photo to enhance features such as edges, shapes, and textures, and then extract the key features such as windows, roof styles, and building materials. We then classify the features and assign a probability to each architectural style that allows us to identify the architectural style with the most confidence.</Text>
            
            {/* Page break */}
            <View style={styles.pageBreak} />

            <Text style={[styles.faqText, styles.question]}>Q: How can I get the best responses?</Text>
            <Text style={styles.faqText}>A: Take a high-quality, full view image with minimal obstructions such as trees, cars, or people.</Text>
          </View>
        </Collapsible>

        <TouchableOpacity onPress={toggleFeedback}>
          <Text style={styles.sectionHeader}>Submit Feedback</Text>
        </TouchableOpacity>
        <Collapsible collapsed={isFeedbackCollapsed}>
          <WebView
            source={{ uri: 'https://docs.google.com/forms/d/e/1FAIpQLScu1r6KQ4NOUqcxIB1pCt6MX85rcrY8jEGgPzWyzgAMWYt7Vw/viewform?embedded=true' }}
            style={{ height: Dimensions.get('window').height - 100, width: Dimensions.get('window').width - 32 }}
          />
        </Collapsible>

        <TouchableOpacity onPress={handleManageSubscription}>
          <Text style={styles.sectionHeader}>Manage Subscription</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  faqContent: {
    paddingLeft: 10,
  },
  faqText: {
    fontSize: 16,
    marginBottom: 5,
  },
  question: {
    fontWeight: 'bold',
  },
  pageBreak: {
    marginVertical: 20, // Adjust the vertical margin to create a visual break
  },
});
