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
  Platform
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { saveDiaryEntry, availableEmotions } from "../../utils/diaryTemplate";

export default function HomeScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");

  const handleSaveEntry = async () => {
    // Validação
    if (!content.trim()) {
      Alert.alert("Atenção", "Por favor, escreva algo sobre o seu dia!");
      return;
    }

    if (!selectedEmotion) {
      Alert.alert("Atenção", "Por favor, selecione como você está se sentindo!");
      return;
    }

    try {
      const result = await saveDiaryEntry(user?.email, {
        title: title.trim(),
        content: content.trim(),
        emotion: selectedEmotion
      });

      if (result.success) {
        Alert.alert(
          "Sucesso! 🎉", 
          "Sua entrada foi salva no diário. Vá para a aba 'Listagem' para visualizar!",
          [{ text: "OK" }]
        );
        
        // Limpa os campos
        setTitle("");
        setContent("");
        setSelectedEmotion("");
      } else {
        Alert.alert("Erro", "Não foi possível salvar a entrada. Tente novamente.");
      }
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar a entrada.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo(a)!</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>📝 Como foi seu dia?</Text>
          
          {/* Campo de Título (Opcional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título (opcional)</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Ex: Primeiro dia de trabalho"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* Campo de Conteúdo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Conte sobre seu dia *</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Escreva aqui sobre seus pensamentos e experiências do dia..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text style={styles.charCount}>{content.length}/1000</Text>
          </View>

          {/* Seletor de Emoção */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Como você está se sentindo? *</Text>
            <View style={styles.emotionsContainer}>
              {availableEmotions.map((emotion) => (
                <TouchableOpacity
                  key={emotion}
                  style={[
                    styles.emotionButton,
                    selectedEmotion === emotion && styles.emotionButtonSelected
                  ]}
                  onPress={() => setSelectedEmotion(emotion)}
                >
                  <Text
                    style={[
                      styles.emotionText,
                      selectedEmotion === emotion && styles.emotionTextSelected
                    ]}
                  >
                    {emotion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveEntry}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>💾 Salvar Entrada</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "#82837fff",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  userName: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#494a44",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  contentInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#494a44",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 150,
  },
  charCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 5,
  },
  emotionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  emotionButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#494a44",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  emotionButtonSelected: {
    backgroundColor: "#82837fff",
    borderColor: "#82837fff",
  },
  emotionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  emotionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#82837fff",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
