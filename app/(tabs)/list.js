import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDiaryEntryTemplate, loadDiaryEntries as loadEntries } from "../../utils/diaryTemplate";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ListScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const imagemDeFundo = require('../../assets/images/diary-background.png');

  // Função para carregar entradas do diário do AsyncStorage
  const loadDiaryEntries = async () => {
    try {
      setLoading(true);

      if (user?.email) {
        const entries = await loadEntries(user.email);
        setDiaryEntries(entries);
      } else {
        setDiaryEntries([]);
      }
    } catch (error) {
      console.error('Erro ao carregar entradas do diário:', error);
      setDiaryEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para refresh da lista
  const onRefresh = async () => {
    setRefreshing(true);
    await loadDiaryEntries();
    setRefreshing(false);
  };

  // Função para criar entrada de exemplo
  const createSampleEntry = async () => {
    const sampleEntry = createDiaryEntryTemplate({
      id: "sample-1",
      title: "Meu primeiro dia no diário",
      content: "Hoje foi um dia especial! Comecei a usar este diário digital e me sinto esperançoso sobre essa nova jornada de autoconhecimento. É incrível como escrever pode nos ajudar a organizar os pensamentos. Este novo formato me lembra dos diários antigos que eu tinha quando era mais jovem. Estou animado para continuar escrevendo aqui todos os dias e documentar minha vida.",
      emotion: "esperançoso"
    });

    try {
      await AsyncStorage.setItem(`diary_entries_${user?.email}`, JSON.stringify([sampleEntry]));
    } catch (error) {
      console.error('Erro ao criar entrada de exemplo:', error);
    }
  };

  // Carrega as entradas ao montar o componente
  useEffect(() => {
    const initializeDiary = async () => {
      if (user?.email) {
        const savedEntries = await AsyncStorage.getItem(`diary_entries_${user?.email}`);
        if (!savedEntries) {
          await createSampleEntry();
        }
        loadDiaryEntries();
      }
    };

    initializeDiary();
  }, [user]);

  // Recarrega as entradas sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      if (user?.email) {
        loadDiaryEntries();
      }
    }, [user])
  );

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para obter cor da emoção
  const getEmotionColor = (emotion) => {
    const emotionColors = {
      'feliz': '#4CAF50',
      'triste': '#2196F3',
      'ansioso': '#FF9800',
      'calmo': '#9C27B0',
      'irritado': '#F44336',
      'esperançoso': '#00BCD4',
      'nostálgico': '#795548',
      'energético': '#CDDC39'
    };
    return emotionColors[emotion?.toLowerCase()] || '#757575';
  };

  // Criar estilos dinâmicos baseados no tamanho da tela
  const dynamicStyles = StyleSheet.create({
    logoSize: {
      width: isTablet ? 280 : 200,
      height: isTablet ? 210 : 150,
    },
    headerPadding: {
      paddingVertical: isTablet ? 40 : 30,
      paddingHorizontal: isTablet ? 40 : 20,
    },
    entriesContainer: {
      paddingHorizontal: isLargeScreen ? screenWidth * 0.15 : isTablet ? 30 : 15,
      paddingBottom: 30,
      paddingTop: 10,
    },
    diaryPagePadding: {
      padding: isTablet ? 30 : 20,
      marginBottom: isTablet ? 30 : 20,
    },
  });

  const maxWordsPerLine = isLargeScreen ? 12 : isTablet ? 10 : 8;

  // Renderiza cada entrada do diário
  const renderDiaryEntry = (entry, index) => (
    <View key={entry.id || index} style={[styles.diaryPage, dynamicStyles.diaryPagePadding]}>
      {/* Header da página do diário */}
      <View style={styles.pageHeader}>
        <View style={styles.dateField}>
          <Text style={styles.dateLabel}>Data:</Text>
          <Text style={styles.dateValue}>{formatDate(entry.date)}</Text>
        </View>

        {entry.emotion && (
          <View style={styles.emotionField}>
            <Text style={styles.emotionValue}>{entry.emotion}</Text>
          </View>
        )}
      </View>

      {/* Título se existir */}
      {entry.title && (
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>{entry.title}</Text>
        </View>
      )}

      <ImageBackground
        source={imagemDeFundo}
        style={styles.contentContainer}
        resizeMode="cover"
      >
        <Text style={styles.contentText} numberOfLines={0}>
          {entry.content}
        </Text>
      </ImageBackground>
    </View> // Esta é a </View> externa que já estava no seu código
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando seu diário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.greeting}>Olá, {user?.name?.split(" ")[0]}! 👋</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
        </View>

        <View style={[styles.entriesList, dynamicStyles.entriesContainer]}>
          {diaryEntries.length > 0 ? (
            diaryEntries.map((entry, index) => renderDiaryEntry(entry, index))
          ) : (
            <View style={styles.noEntriesContainer}>
              <Text style={styles.noEntriesText}>📝</Text>
              <Text style={styles.noEntriesTitle}>Nenhuma entrada ainda</Text>
              <Text style={styles.noEntriesSubtitle}>
                Que tal começar a escrever sobre seus pensamentos e emoções do dia?
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botão Flutuante para Criar Nova Entrada */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/create')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#dddd" />
      </TouchableOpacity>
    </View>
  );
}

// Obter dimensões da tela para responsividade
const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#403E3E",
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#403E3E",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#9F9F9F",
  },
  header: {
    backgroundColor: "#403E3E",
    marginBottom: 20,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logoPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  bookIcon: {
    backgroundColor: "rgba(83, 73, 73, 0.1)",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  bookEmoji: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#dddd",
    letterSpacing: 2,
    marginBottom: 2,
  },
  logoSubtext: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9F9F9F",
    letterSpacing: 1,
  },
  
  header: {
    backgroundColor: "#403E3E",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
    backgroundColor: "#D9D3CC",
    borderRadius: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#dddd",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: "#9F9F9F",
    textTransform: "capitalize",
  },
  diaryPage: {
    backgroundColor: "#676767",
    borderRadius: 23,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    // Padding e margin são definidos dinamicamente
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#9F9F9F",
  },
  dateLabel: {
    fontSize: 14,
    color: "#333",
    marginRight: 8,
    fontWeight: "500",
  },
  dateValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  emotionField: {
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#9F9F9F",
    minWidth: 80,
    alignItems: "center",
  },
  emotionValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  titleSection: {
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#555",
    paddingBottom: 10,
  },
  titleText: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "bold",
    color: "#dddd",
    textAlign: "center",
  },
  contentContainer: {
    backgroundColor: "#9F9F9F",
    borderRadius: 15,
    width: '100%',
    height: '14rem',
  },
  contentText: {
    fontSize: isTablet ? 17 : 15,
    color: "#333",
    lineHeight: isTablet ? 13 : 20,
    textAlign: "justify",
    marginTop: 7,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  noEntriesContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
    backgroundColor: "#676767",
    marginHorizontal: 15,
    borderRadius: 23,
  },
  noEntriesText: {
    fontSize: 60,
    marginBottom: 20,
  },
  noEntriesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dddd",
    marginBottom: 10,
    textAlign: "center",
  },
  noEntriesSubtitle: {
    fontSize: 16,
    color: "#9F9F9F",
    textAlign: "center",
    lineHeight: 24,
    fontStyle: "italic",
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#676767',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
