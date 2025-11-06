import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalEntries: 0,
    favoriteEmotion: "-",
    daysActive: 0,
    lastEntry: null,
  });

  // Carrega estatísticas do usuário
  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    try {
      if (user?.email) {
        // Carregar entradas do diário
        const entriesData = await AsyncStorage.getItem(
          `diary_entries_${user.email}`
        );
        const entries = entriesData ? JSON.parse(entriesData) : [];

        // Calcular estatísticas
        const totalEntries = entries.length;

        // Emoção mais frequente
        const emotions = entries
          .map((entry) => entry.emotion)
          .filter((emotion) => emotion);
        const emotionCount = {};
        emotions.forEach((emotion) => {
          emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
        });
        const favoriteEmotion =
          Object.keys(emotionCount).length > 0
            ? Object.keys(emotionCount).reduce((a, b) =>
                emotionCount[a] > emotionCount[b] ? a : b
              )
            : "-";

        // Dias ativos (diferentes datas de entrada)
        const uniqueDates = new Set(
          entries.map((entry) =>
            new Date(entry.date).toLocaleDateString("pt-BR")
          )
        );
        const daysActive = uniqueDates.size;

        // Última entrada
        const lastEntry =
          entries.length > 0
            ? new Date(entries[entries.length - 1].date)
            : null;

        setStats({
          totalEntries,
          favoriteEmotion,
          daysActive,
          lastEntry,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => signOut(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleClearData = () => {
    Alert.alert(
      "Limpar dados",
      "Isso irá apagar todas as suas entradas do diário. Esta ação não pode ser desfeita!",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(`diary_entries_${user.email}`);
              setStats({
                totalEntries: 0,
                favoriteEmotion: "-",
                daysActive: 0,
                lastEntry: null,
              });
              Alert.alert("Sucesso", "Dados limpos com sucesso!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível limpar os dados.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com Avatar */}
      <View style={styles.header}>
        {/* Logo do App */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
          </View>
          <View style={styles.onlineIndicator} />
        </View>
        <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
        <Text style={styles.userEmail}>{user?.email || ""}</Text>
        <Text style={styles.memberSince}>
          Membro desde {formatDate(new Date(user?.createdAt))}
        </Text>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Suas Estatísticas</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="book-outline" size={32} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.totalEntries}</Text>
            <Text style={styles.statLabel}>Entradas</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={32} color="#2196F3" />
            <Text style={styles.statNumber}>{stats.daysActive}</Text>
            <Text style={styles.statLabel}>Dias Ativos</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="happy-outline" size={32} color="#FF9800" />
            <Text style={styles.statNumber}>
              {stats.favoriteEmotion.length > 8
                ? stats.favoriteEmotion.substring(0, 8) + "..."
                : stats.favoriteEmotion}
            </Text>
            <Text style={styles.statLabel}>Emoção Favorita</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={32} color="#9C27B0" />
            <Text style={styles.statNumberSmall}>
              {stats.lastEntry ? formatDate(stats.lastEntry).split(" ")[0] : "-"}
            </Text>
            <Text style={styles.statLabel}>Última Entrada</Text>
          </View>
        </View>
      </View>

      {/* Informações da Conta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Informações da Conta</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{user?.name || "-"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={24} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || "-"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>ID da Conta</Text>
              <Text style={styles.infoValue}>
                #{user?.id?.substring(0, 8) || "-"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Sobre o Diário */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📖 Sobre o Diário</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>
            Este é seu espaço pessoal para registrar momentos importantes,
            anotar sentimentos e organizar suas experiências. Cada entrada é
            privada e segura, proporcionando um ambiente confiável para
            expressar suas emoções.
          </Text>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Configurações</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Alert.alert(
              "Editar Perfil",
              "Funcionalidade em desenvolvimento. Em breve você poderá editar suas informações!"
            )
          }
        >
          <Ionicons name="create-outline" size={24} color="#2196F3" />
          <Text style={styles.actionButtonText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Alert.alert(
              "Privacidade",
              "Suas informações estão protegidas e armazenadas localmente no seu dispositivo. Nenhum dado é compartilhado com terceiros."
            )
          }
        >
          <Ionicons name="lock-closed-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionButtonText}>Privacidade e Segurança</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleClearData}>
          <Ionicons name="trash-outline" size={24} color="#FF9800" />
          <Text style={styles.actionButtonText}>Limpar Dados do Diário</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#F44336" />
          <Text style={[styles.actionButtonText, styles.logoutText]}>
            Sair da Conta
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Aconteceu Hoje - Diário Digital</Text>
        <Text style={styles.footerVersion}>Versão 1.0.0</Text>
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
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  statNumberSmall: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  aboutCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    textAlign: "justify",
  },
  actionButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    fontWeight: "500",
  },
  logoutButton: {
    borderColor: "#F44336",
    borderWidth: 1,
  },
  logoutText: {
    color: "#F44336",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  footerVersion: {
    fontSize: 12,
    color: "#ccc",
  },
});
