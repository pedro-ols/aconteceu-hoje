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
        <Ionicons name="quote" size={24} color="#dddd" />
        <Text style={styles.quoteText}>{quote}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="book" size={32} color="#dddd" />
          <Text style={styles.statNumber}>{stats.totalEntries}</Text>
          <Text style={styles.statLabel}>Entradas</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="flame" size={32} color="#dddd" />
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
          color="#dddd"
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
          <View style={[styles.actionIcon, { backgroundColor: "#9F9F9F" }]}>
            <Ionicons name="create" size={28} color="#403E3E" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Nova Entrada</Text>
            <Text style={styles.actionSubtitle}>
              Escreva sobre seu dia
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9F9F9F" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(tabs)/list")}
        >
          <View style={[styles.actionIcon, { backgroundColor: "#9F9F9F" }]}>
            <Ionicons name="list" size={28} color="#403E3E" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Ver Entradas</Text>
            <Text style={styles.actionSubtitle}>
              Reveja suas memórias
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9F9F9F" />
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
    backgroundColor: "#403E3E",
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
  quoteCard: {
    backgroundColor: "#676767",
    margin: 20,
    padding: 20,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
  },
  quoteText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    color: "#dddd",
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
    backgroundColor: "#676767",
    padding: 20,
    borderRadius: 23,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#dddd",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: "#9F9F9F",
    marginTop: 5,
  },
  todayCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 23,
    marginBottom: 30,
  },
  todayCardDone: {
    backgroundColor: "#676767",
  },
  todayCardPending: {
    backgroundColor: "#676767",
  },
  todayContent: {
    flex: 1,
    marginLeft: 15,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dddd",
    marginBottom: 5,
  },
  todaySubtitle: {
    fontSize: 14,
    color: "#9F9F9F",
    lineHeight: 20,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dddd",
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: "#676767",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 23,
    marginBottom: 12,
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
    color: "#dddd",
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 14,
    color: "#9F9F9F",
  },
});
