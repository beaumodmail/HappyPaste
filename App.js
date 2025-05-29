import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem('messages');
      if (stored) setMessages(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  };

  const saveMessages = async (msgs) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(msgs));
    } catch (e) {
      console.error(e);
    }
  };

  const addMessage = () => {
    if (!message.trim()) return;
    const newMessages = [...messages, message.trim()];
    setMessages(newMessages);
    saveMessages(newMessages);
    setMessage('');
  };

  const pasteMessage = (text) => {
    setMessage(text);
  };

  const deleteMessage = (index) => {
    const updated = messages.filter((_, i) => i !== index);
    setMessages(updated);
    saveMessages(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PasteKeyboard</Text>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
      />
      <Button title="Save Message" onPress={addMessage} />
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.messageItem}>
            <TouchableOpacity style={styles.pasteButton} onPress={() => pasteMessage(item)}>
              <Text style={styles.buttonText}>{item}</Text>
            </TouchableOpacity>
            <Button title="X" color="red" onPress={() => deleteMessage(index)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  messageItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  pasteButton: { flex: 1, marginRight: 10, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5 },
  buttonText: { fontSize: 16 }
});