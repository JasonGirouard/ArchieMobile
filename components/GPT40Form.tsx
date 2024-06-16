import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import Markdown from 'react-native-markdown-display';
import * as FileSystem from "expo-file-system";

// Define the type for the question object
type Question = {
  question: string;
};

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: "user" | "system";
  imageUri?: string;
}

const screenWidth = Dimensions.get("window").width;

const GPT4OForm = () => {
  const [inputText, setInputText] = useState<string>("");
  const [response, setResponse] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string>("");
  const customQuestionInputRef = useRef<TextInput>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (messages) {
      console.log("messages: ", messages);
    }
  }, [messages]);

  useEffect(() => {
    console.log("isLoadingResponse:", isLoadingResponse);
  }, [isLoadingResponse]);

  const handleCustomQuestionChange = useCallback((text: string) => {
    setCustomQuestion(text);
  }, []);

  useEffect(() => {
    if (customQuestionInputRef.current) {
      customQuestionInputRef.current.focus();
    }
  }, [customQuestion]);

  // Function to add a message to the messages state
  const addMessage = (
    text: string,
    sender: "user" | "system",
    imageUri?: string
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      sender,
      imageUri,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleCustomQuestionSubmit = async () => {
    if (customQuestion.trim().length === 0) return;
    addMessage(customQuestion, "user");
    await sendFollowUpRequest(customQuestion);
    setCustomQuestion("");
  };

  // trigger stream request automatically after image upload or send
  useEffect(() => {
    if (imageUri) {
      console.log("Image URI updated:", imageUri.substring(5, 30));
      // Clear out the messages
      setMessages([]);
      addMessage("", "user", imageUri);

      handleSubmitStream(inputText, imageUri); // Trigger stream request automatically
    }
  }, [imageUri]);

  const handleImageUpload = async () => {
    setInputText("");
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
     // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow all media types including heic
      allowsEditing: true,
      quality: .7,
      base64: true,
    });
    // past set up 
  //   if (
  //     !pickerResult.canceled &&
  //     pickerResult.assets &&
  //     pickerResult.assets.length > 0
  //   ) {
  //     setImageUri(pickerResult.assets[0].uri);
  //     console.log(pickerResult.assets[0].uri.substring(5, 30));
  //   }
  // };

  if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
    setIsLoading(true)
    const selectedAsset = pickerResult.assets[0];
    try {
      let manipulatedImage;
      if (selectedAsset.uri.endsWith('.heic')) {
        manipulatedImage = await ImageManipulator.manipulateAsync(
          selectedAsset.uri,
          [],
          { format: ImageManipulator.SaveFormat.JPEG, base64: true, compress: 0 }
        );
      } else {
        manipulatedImage = await ImageManipulator.manipulateAsync(
          selectedAsset.uri,
          [],
          { base64: true, compress: 0 }
        );
      }

      if (manipulatedImage.base64) {
        const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;
        console.log(base64Image);

        // Save the manipulated image locally -- for testing 
        // const fileUri = FileSystem.documentDirectory + 'image.jpg';
        // await FileSystem.writeAsStringAsync(fileUri, manipulatedImage.base64, { encoding: FileSystem.EncodingType.Base64 });

        // // Save the image to the user's photos
        // const asset = await MediaLibrary.createAssetAsync(fileUri);
        // await MediaLibrary.createAlbumAsync('Expo', asset, false);

        // Alert.alert("Image saved", "Image has been saved to your photos.");

        setImageUri(base64Image);
      } else {
        console.error("No base64 data found in manipulated image.");
      }
    } catch (error) {
      console.error("Error manipulating image:", error);
      Alert.alert("Error", "Failed to manipulate the image.");
    }
  }
};

 

  const handleTakePhoto = async () => {
    setInputText("");
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "Permission to access camera is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
     // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow all media types including heic
      allowsEditing: true,
      quality: .7,
      base64: true,
    });

    // previous methodology
  //   if (
  //     !pickerResult.canceled &&
  //     pickerResult.assets &&
  //     pickerResult.assets.length > 0
  //   ) {
  //     setImageUri(pickerResult.assets[0].uri);
  //     console.log(pickerResult.assets[0].uri.substring(5, 30));
  //   }
  // };
  if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
    setIsLoading(true)
    const selectedAsset = pickerResult.assets[0];
    try {
      let manipulatedImage;
      if (selectedAsset.uri.endsWith('.heic')) {
        manipulatedImage = await ImageManipulator.manipulateAsync(
          selectedAsset.uri,
          [],
          { format: ImageManipulator.SaveFormat.JPEG, base64: true, compress: 0 }
        );
      } else {
        manipulatedImage = await ImageManipulator.manipulateAsync(
          selectedAsset.uri,
          [],
          { base64: true, compress: 0 }
        );
      }
      setImageUri(`data:image/jpeg;base64,${manipulatedImage.base64}`);
    } catch (error) {
      console.error("Error manipulating image:", error);
      Alert.alert("Error", "Failed to manipulate the image.");
    }
  }
};


  const handleSubmitStream = async (
    inputText: string,
    imageUri: string | null
  ) => {
    console.log("Starting submission...");
    setIsLoading(true); // Start loading indicator
    let imageUrl = "";
    if (imageUri) {
      try {
        console.log("Fetching image blob from URI...");
        const blob = await fetch(imageUri).then((res) => res.blob());
        console.log("Image blob fetched, converting to base64...");

        const base64 = await new Promise<string>((resolve, reject) => {
          console.log("in the base64 function");
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result.split(",")[1]);
            } else {
              reject(new Error("FileReader result is not a string"));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        imageUrl = `data:image/jpeg;base64,${base64}`;
        console.log("Image converted to base64:", imageUrl.substring(5, 30));
      } catch (error) {
        console.error("Error converting image to base64:", error);
        Alert.alert("Error", "Failed to convert image to base64.");
        setIsLoading(false);
        return;
      }
    }

    console.log("Sending stream request with image URL...");
    await sendStreamRequest(imageUrl, inputText);
  };

  const handleQuestionClick = async (question: string) => {
    addMessage(question, "user");
    setInputText(question);
    await sendFollowUpRequest(question);
  };

  const sendStreamRequest = async (imageUrl = "", inputText: string) => {
    setQuestions(null);
    setIsLoadingResponse(true);

    try {
      const response = await axios.post(
        "https://api.thearchitectureapp.com/api/gpt4oStream",
        {
          inputText,
          imageUrl,
        },
        {
          onDownloadProgress: (progressEvent) => {
            setIsLoading(false);
            // console.log('progressEvent:', progressEvent) ;
            const responseData = progressEvent.event.target.responseText;
            // console.log('ResponseData:', responseData);
            setResponse(responseData);
          },
          responseType: "text",
        }
      );
      //console.log(response);
      setIsLoadingResponse(false);

      // Extract the response data to use as the message text
      const responseData = response.data;
      // Add the complete response message to the chat
      addMessage(responseData, "system");

      // Call sendRequestQuestions with the response data
      await sendRequestQuestions(responseData);

      setResponse("");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Unable to get response from the server.");
      addMessage("Error: Unable to get response from the server.", "system");
      setIsLoadingResponse(false);
    }
  };

  const sendFollowUpRequest = async (inputText: string) => {
    setQuestions(null);
    setIsLoadingResponse(true);

    try {
      const response = await axios.post(
        "https://api.thearchitectureapp.com/api/gpt4oStreamFollowUp",
        {
          inputText
        },
        {
          onDownloadProgress: (progressEvent) => {
            setIsLoading(false);
            // console.log('progressEvent:', progressEvent) ;
            const responseData = progressEvent.event.target.responseText;
            // console.log('ResponseData:', responseData);
            setResponse(responseData);
          },
          responseType: "text",
        }
      );
      console.log(response);
      setIsLoadingResponse(false);

      // Extract the response data to use as the message text
      const responseData = response.data;
      // Add the complete response message to the chat
      addMessage(responseData, "system");

      // Call sendRequestQuestions with the response data
      await sendRequestQuestions(responseData);

      setResponse("");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Unable to get follow-up response from the server.");
      addMessage("Error: Unable to get follow-up response from the server.", "system");
      setIsLoadingResponse(false);
    }
  };

  const sendRequestQuestions = async (data: string) => {
    try {
      const response = await axios.post(
        "https://api.thearchitectureapp.com/api/gpt4oQuestions",
        {
          inputText: data,
        }
      );
     // console.log("questions response:", response.data.response);

    // Parse the JSON string to an array
    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(response.data.response);
      setQuestions(parsedQuestions);
    } catch (jsonError) {
      //console.error("JSON Parse Error:", jsonError);
     // Alert.alert("Error", "Failed to parse the questions response.");
      setQuestions([]);
    }
  } catch (error) {
  //  console.error("Error:", error);
    Alert.alert("Error", "Something went wrong while fetching questions.");
  }
};

  const renderItem = ({ item }: { item: Message }) => (
    <ScrollView>
      {item.imageUri ? (
        ""
      ) : (
        <View
          style={
            item.sender === "user" && !item.imageUri
              ? styles.userMessageContainer
              : item.sender === "system"
              ? styles.systemMessageContainer
              : null
          }
        >
          <Markdown
          >
            {item.text}
          </Markdown>
        </View>
      )}
    </ScrollView>
  );

  const renderFooter = () => {
    return (
      <ScrollView>
        {isLoadingResponse && (
          <View style={styles.systemMessageContainer}>
          <ScrollView>
            <Markdown style={styles.systemMessageText}>
              {response}
            </Markdown>
          </ScrollView>
        </View>
        )}
        <FlatList
          data={questions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleQuestionClick(item.question)}
            >
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{item.question}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.formContainer}
          scrollEnabled={false}
        />
      </ScrollView>
    );
  };

  return (
    <>
      <KeyboardAwareScrollView>
        <>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handleImageUpload}>
              <Image
                source={require("@/assets/images/images.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTakePhoto}>
              <Image
                source={require("@/assets/images/camera.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </>
        {!imageUri && (
          <View style={styles.introMessageContainer}>
            <Text style={styles.introText}>
              Upload or take a photo to start learning about Architecture
            </Text>
          </View>
        )}

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: 200, marginTop: 10 }}
            resizeMode="contain"
          />
        )}

        {isLoading && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color="#686963" />
          </View>
        )}

        <FlatList
          // ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.formContainer}
          scrollEnabled={false}
        />

        {questions && questions.length > 0 && (
          // <View style={[styles.customQuestionContainer, { width: screenWidth }]}>
          <View style={styles.customQuestionContainer}>
            <TextInput
              ref={customQuestionInputRef}
              style={styles.customQuestionTextInput}
              value={customQuestion}
              onChangeText={handleCustomQuestionChange}
              placeholder="Ask your own question..."
              placeholderTextColor="#000000"
              multiline
              selection={{
                start: customQuestion.length,
                end: customQuestion.length,
              }}
            />
            <Pressable
              style={styles.submitButton}
              onPress={handleCustomQuestionSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  introMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the content horizontally
    width: "100%", // Ensure the container takes up full width
    padding: 20, // Optional: add padding if needed
  },
  introText: {
    fontSize: 18,
    fontWeight: "bold", // Make the text bold
    textAlign: "center", // Center the text
  },
  questionContainer: {
    borderRadius: 10,
    marginBottom: 5,
    padding: 10,
    borderColor: "#3D5467",
    borderWidth: 1,
  },
  questionText: {
    fontSize: 16,
  },
  customQuestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customQuestionTextInput: {
    borderColor: "#3D5467",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 5,
    fontSize: 16,
    textAlignVertical: "center", // For Android
    paddingTop: Platform.OS === "ios" ? 14 : 10, // For iOS, adjust padding to vertically center text
    paddingBottom: Platform.OS === "ios" ? 14 : 10, // For iOS, adjust padding to vertically center text
    width: "75%",
  },

  submitButton: {
    backgroundColor: "#3D5467",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  formContainer: {
    marginTop: 20,
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },

  systemMessageText: {
    //  fontSize: 16,
    // lineHeight: 24,
  },
  userMessageText: {
    // fontSize: 16,
  },

  icon: {
    width: 50,
    height: 50,
  },
  userMessageContainer: {
    backgroundColor: "#F1EDEE",
    marginLeft: 90,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },

  systemMessageContainer: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  activityIndicatorContainer: {
    padding: 20, // Adjust the padding as needed
  },
});

export default GPT4OForm;
