import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEntries: 0,
    todayEntry: false,
    currentStreak: 0,
  });
  const [quote, setQuote] = useState("");

  const motivationalQuotes = [
    "A escrita é a pintura da voz. - Voltaire",
    "Escrever é uma forma de terapia. - Graham Greene",
    "Um diário é um amigo que nunca julga. - Anônimo",
    "Suas palavras têm poder. Use-as com sabedoria.",
    "Cada página é uma nova oportunidade de se conhecer melhor.",
    "A vida acontece agora. Registre este momento.",
    "Seus pensamentos merecem ser lembrados.",
  ];

  useEffect(() => {
    setQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);

  const loadStats = async () => {
    try {
      if (user?.email) {
        const entriesData = await AsyncStorage.getItem(
          `diary_entries_${user.email}`
        );
        const entries = entriesData ? JSON.parse(entriesData) : [];

        const totalEntries = entries.length;

        // Verificar se já escreveu hoje
        const today = new Date().toDateString();
        const todayEntry = entries.some(
          (entry) => new Date(entry.date).toDateString() === today
        );

        // Calcular sequência de dias
        let currentStreak = 0;
        if (entries.length > 0) {
          const sortedDates = entries
            .map((e) => new Date(e.date).toDateString())
            .sort((a, b) => new Date(b) - new Date(a));

          const uniqueDates = [...new Set(sortedDates)];
          let checkDate = new Date();

          for (let date of uniqueDates) {
            const entryDate = new Date(date);
            if (
              entryDate.toDateString() === checkDate.toDateString() ||
              entryDate.toDateString() ===
                new Date(checkDate.getTime() - 86400000).toDateString()
            ) {
              currentStreak++;
              checkDate = new Date(checkDate.getTime() - 86400000);
            } else {
              break;
            }
          }
        }

        setStats({ totalEntries, todayEntry, currentStreak });
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [user])
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
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

      {/* Quote Card */}
      <View style={styles.quoteCard}>
        <Ionicons name="quote" size={24} color="#4CAF50" />
        <Text style={styles.quoteText}>{quote}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="book" size={32} color="#4CAF50" />
          <Text style={styles.statNumber}>{stats.totalEntries}</Text>
          <Text style={styles.statLabel}>Entradas</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="flame" size={32} color="#FF9800" />
          <Text style={styles.statNumber}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Dias Seguidos</Text>
        </View>
      </View>

      {/* Today's Status */}
      <View
        style={[
          styles.todayCard,
          stats.todayEntry ? styles.todayCardDone : styles.todayCardPending,
        ]}
      >
        <Ionicons
          name={stats.todayEntry ? "checkmark-circle" : "time"}
          size={40}
          color={stats.todayEntry ? "#4CAF50" : "#FF9800"}
        />
        <View style={styles.todayContent}>
          <Text style={styles.todayTitle}>
            {stats.todayEntry
              ? "Você já escreveu hoje! 🎉"
              : "Ainda não escreveu hoje"}
          </Text>
          <Text style={styles.todaySubtitle}>
            {stats.todayEntry
              ? "Continue assim! Sua jornada de autoconhecimento está incrível."
              : "Que tal registrar como foi seu dia?"}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(tabs)/create")}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#E8F5E9" }]}>
            <Ionicons name="create" size={28} color="#4CAF50" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Nova Entrada</Text>
            <Text style={styles.actionSubtitle}>
              Escreva sobre seu dia
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(tabs)/list")}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#E3F2FD" }]}>
            <Ionicons name="list" size={28} color="#2196F3" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Ver Entradas</Text>
            <Text style={styles.actionSubtitle}>
              Reveja suas memórias
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#F3E5F5" }]}>
            <Ionicons name="person" size={28} color="#9C27B0" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Meu Perfil</Text>
            <Text style={styles.actionSubtitle}>
              Estatísticas e configurações
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#82837fff",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textTransform: "capitalize",
  },
  quoteCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  todayCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayCardDone: {
    backgroundColor: "#E8F5E9",
  },
  todayCardPending: {
    backgroundColor: "#FFF3E0",
  },
  todayContent: {
    flex: 1,
    marginLeft: 15,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  todaySubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
    marginLeft: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
