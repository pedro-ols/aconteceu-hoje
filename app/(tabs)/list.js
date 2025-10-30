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
  Dimensions
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDiaryEntryTemplate, loadDiaryEntries as loadEntries } from "../../utils/diaryTemplate";

export default function ListScreen() {
  const { user } = useAuth();
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      {/* Linhas do diário com o texto */}
      <View style={styles.linesContainer}>
        {(() => {
          // Divide o texto em palavras e distribui nas linhas
          const words = entry.content.split(' ');
          const lines = [];
          let currentLine = '';
          const maxWordsPerLine = isLargeScreen ? 12 : isTablet ? 10 : 8; // Usar valor responsivo
          
          words.forEach((word, index) => {
            if (currentLine.split(' ').length < maxWordsPerLine) {
              currentLine += (currentLine ? ' ' : '') + word;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          });
          
          // Adiciona a última linha se houver conteúdo
          if (currentLine) {
            lines.push(currentLine);
          }
          
          // Renderiza as linhas com texto
          return lines.map((line, lineIndex) => (
            <View key={lineIndex} style={styles.diaryLine}>
              <View style={styles.bulletPoint} />
              <Text style={styles.lineText}>{line}</Text>
              <View style={styles.underline} />
            </View>
          ));
        })()}
        
        {/* Linhas extras vazias para completar o visual */}
        {(() => {
          const maxWordsPerLineLocal = isLargeScreen ? 12 : isTablet ? 10 : 8;
          const textLines = Math.ceil(entry.content.split(' ').length / maxWordsPerLineLocal);
          const emptyLines = Math.max(0, 8 - textLines);
          
          return Array.from({ length: emptyLines }).map((_, emptyIndex) => (
            <View key={`empty-${emptyIndex}`} style={styles.diaryLine}>
              <View style={styles.bulletPoint} />
              <Text style={styles.lineText}></Text>
              <View style={styles.underline} />
            </View>
          ));
        })()}
      </View>
    </View>
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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      bounces={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.header, dynamicStyles.headerPadding]}>
        <View style={styles.logoContainer}>
          {/* Você pode substituir este View por uma Image quando tiver a logo salva */}
          <View style={styles.logoPlaceholder}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={[styles.logo, dynamicStyles.logoSize]}
          />
         
          </View>
          
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
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
  );
}

// Obter dimensões da tela para responsividade
const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#434440",
  },
  header: {
    backgroundColor: "#82837fff",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
    color: "#fff",
    letterSpacing: 2,
    marginBottom: 2,
  },
  logoSubtext: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d1d1d1",
    letterSpacing: 1,
  },
  logo: {
    // Dimensões são definidas dinamicamente
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#d1d1d1",
    textAlign: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: isTablet ? 22 : 18,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  entriesList: {
    // Padding é definido dinamicamente
  },
  diaryPage: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    shadowColor: "#434440",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#494a44",
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
    borderWidth: 1,
    borderColor: "#494a44",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f5f5f5",
  },
  dateLabel: {
    fontSize: 14,
    color: "#434440",
    marginRight: 8,
    fontWeight: "500",
  },
  dateValue: {
    fontSize: 14,
    color: "#2c2c2a",
    fontWeight: "600",
  },
  emotionField: {
    borderWidth: 1,
    borderColor: "#494a44",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#fff",
    minWidth: 80,
    alignItems: "center",
  },
  emotionValue: {
    fontSize: 14,
    color: "#434440",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  titleSection: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#494a44",
    paddingBottom: 5,
  },
  titleText: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "bold",
    color: "#2c2c2a",
    textAlign: "center",
  },
  linesContainer: {
    marginBottom: 15,
  },
  diaryLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    minHeight: 24,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#494a44",
    marginRight: 12,
    marginTop: 2,
  },
  lineText: {
    flex: 1,
    fontSize: isTablet ? 17 : 15,
    color: "#2c2c2a",
    lineHeight: isTablet ? 26 : 22,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  underline: {
    position: "absolute",
    bottom: 0,
    left: 18,
    right: 0,
    height: 1,
    backgroundColor: "#494a44",
    opacity: 0.4,
  },
  noEntriesContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
    backgroundColor: "#fafafa",
    marginHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#494a44",
  },
  noEntriesText: {
    fontSize: 60,
    marginBottom: 20,
  },
  noEntriesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c2c2a",
    marginBottom: 10,
    textAlign: "center",
  },
  noEntriesSubtitle: {
    fontSize: 16,
    color: "#434440",
    textAlign: "center",
    lineHeight: 24,
    fontStyle: "italic",
  },
});
