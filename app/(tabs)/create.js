import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CreateEntryScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");

  const emotions = [
    { label: "Feliz", value: "feliz", icon: "happy", color: "#4CAF50" },
    { label: "Triste", value: "triste", icon: "sad", color: "#2196F3" },
    { label: "Ansioso", value: "ansioso", icon: "alert-circle", color: "#FF9800" },
    { label: "Calmo", value: "calmo", icon: "flower", color: "#9C27B0" },
    { label: "Irritado", value: "irritado", icon: "flame", color: "#F44336" },
    { label: "Esperançoso", value: "esperançoso", icon: "sunny", color: "#00BCD4" },
    { label: "Nostálgico", value: "nostálgico", icon: "time", color: "#795548" },
    { label: "Energético", value: "energético", icon: "flash", color: "#CDDC39" },
  ];

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert("Atenção", "Por favor, escreva algo no diário!");
      return;
    }

    try {
      const newEntry = {
        id: Date.now().toString(),
        title: title.trim() || "Sem título",
        content: content.trim(),
        emotion: selectedEmotion,
        date: new Date().toISOString(),
      };

      const storageKey = `diary_entries_${user?.email}`;
      console.log("=== SALVANDO ENTRADA ===");
      console.log("Chave de armazenamento:", storageKey);
      
      const existingData = await AsyncStorage.getItem(storageKey);
      const entries = existingData ? JSON.parse(existingData) : [];
      console.log("Entradas existentes antes de salvar:", entries.length);
      
      entries.push(newEntry);
      console.log("Total de entradas após adicionar nova:", entries.length);
      
      await AsyncStorage.setItem(storageKey, JSON.stringify(entries));
      console.log("Entrada salva com sucesso!");

      // Limpar campos
      setTitle("");
      setContent("");
      setSelectedEmotion("");

      Alert.alert("Sucesso!", "Sua entrada foi salva no diário.", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/list"),
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar entrada:", error);
      Alert.alert("Erro", "Não foi possível salvar sua entrada.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>✍️ Nova Entrada</Text>
          <Text style={styles.headerSubtitle}>
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título (opcional)</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Ex: Um dia especial..."
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Como você está se sentindo?</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.emotionsContainer}
            >
              {emotions.map((emotion) => (
                <TouchableOpacity
                  key={emotion.value}
                  style={[
                    styles.emotionButton,
                    selectedEmotion === emotion.value && {
                      backgroundColor: emotion.color,
                      borderColor: emotion.color,
                    },
                  ]}
                  onPress={() => setSelectedEmotion(emotion.value)}
                >
                  <Ionicons
                    name={emotion.icon}
                    size={24}
                    color={
                      selectedEmotion === emotion.value ? "#fff" : emotion.color
                    }
                  />
                  <Text
                    style={[
                      styles.emotionLabel,
                      selectedEmotion === emotion.value && {
                        color: "#fff",
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {emotion.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>O que aconteceu hoje?</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Escreva seus pensamentos, sentimentos e experiências do dia..."
              placeholderTextColor="#999"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />
            <Text style={styles.charCount}>{content.length} / 5000</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={24} color="#dddd" />
            <Text style={styles.saveButtonText}>Salvar no Diário</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#403E3E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#403E3E",
    padding: 30,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#dddd",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#9F9F9F",
    textTransform: "capitalize",
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dddd",
    marginBottom: 10,
  },
  titleInput: {
    backgroundColor: "#9F9F9F",
    borderRadius: 23,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  emotionsContainer: {
    flexDirection: "row",
  },
  emotionButton: {
    backgroundColor: "#676767",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#676767",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emotionLabel: {
    fontSize: 14,
    color: "#dddd",
  },
  contentInput: {
    backgroundColor: "#9F9F9F",
    borderRadius: 23,
    padding: 15,
    fontSize: 16,
    minHeight: 250,
    color: "#333",
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#9F9F9F",
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#676767",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 23,
    marginTop: 10,
    gap: 10,
  },
  saveButtonText: {
    color: "#dddd",
    fontSize: 18,
    fontWeight: "bold",
  },
});
