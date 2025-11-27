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
  TextInput,
  Modal,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();
  const [stats, setStats] = useState({
    totalEntries: 0,
    favoriteEmotion: "-",
    daysActive: 0,
    lastEntry: null,
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleEditProfile = () => {
    setEditedName(user?.name || "");
    setEditedEmail(user?.email || "");
    setEditedPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    // Validações
    if (!editedName.trim()) {
      Alert.alert("Erro", "O nome não pode estar vazio.");
      return;
    }

    if (!editedEmail.trim()) {
      Alert.alert("Erro", "O email não pode estar vazio.");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedEmail)) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }

    // Se está tentando mudar senha, validar
    if (editedPassword || confirmPassword) {
      if (editedPassword.length < 6) {
        Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
        return;
      }
      if (editedPassword !== confirmPassword) {
        Alert.alert("Erro", "As senhas não coincidem.");
        return;
      }
    }

    try {
      const usersData = await AsyncStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Verificar se o email já existe (se mudou)
      if (editedEmail !== user.email) {
        const emailExists = users.some(
          (u) => u.email === editedEmail && u.email !== user.email
        );
        if (emailExists) {
          Alert.alert("Erro", "Este email já está sendo usado por outra conta.");
          return;
        }
      }
      
      // Atualizar os dados do usuário
      const updatedUsers = users.map((u) => {
        if (u.email === user.email) {
          const updatedUser = { 
            ...u, 
            name: editedName.trim(),
            email: editedEmail.trim()
          };
          // Se forneceu nova senha, atualizar
          if (editedPassword) {
            updatedUser.password = editedPassword;
          }
          return updatedUser;
        }
        return u;
      });
      
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      
      // Se mudou o email, precisamos atualizar as entradas do diário
      if (editedEmail !== user.email) {
        const oldEntriesKey = `diary_entries_${user.email}`;
        const newEntriesKey = `diary_entries_${editedEmail}`;
        
        const entries = await AsyncStorage.getItem(oldEntriesKey);
        if (entries) {
          await AsyncStorage.setItem(newEntriesKey, entries);
          await AsyncStorage.removeItem(oldEntriesKey);
        }
      }
      
      // Atualizar o usuário atual (sem a senha)
      const currentUser = updatedUsers.find((u) => u.email === editedEmail.trim());
      const { password: _, ...userWithoutPassword } = currentUser;
      
      // Atualizar o contexto
      if (updateUser) {
        updateUser(userWithoutPassword);
      }
      
      // Recarregar estatísticas se mudou o email
      if (editedEmail !== user.email) {
        await loadUserStats();
      }
      
      setIsEditModalVisible(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: signOut,
      },
    ]);
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
            <Ionicons name="book-outline" size={32} color="#dddd" />
            <Text style={styles.statNumber}>{stats.totalEntries}</Text>
            <Text style={styles.statLabel}>Entradas</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={32} color="#dddd" />
            <Text style={styles.statNumber}>{stats.daysActive}</Text>
            <Text style={styles.statLabel}>Dias Ativos</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="happy-outline" size={32} color="#dddd" />
            <Text style={styles.statNumber}>
              {stats.favoriteEmotion.length > 8
                ? stats.favoriteEmotion.substring(0, 8) + "..."
                : stats.favoriteEmotion}
            </Text>
            <Text style={styles.statLabel}>Emoção Favorita</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={32} color="#dddd" />
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
            <Ionicons name="person-outline" size={24} color="#9F9F9F" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{user?.name || "-"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={24} color="#9F9F9F" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || "-"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#9F9F9F" />
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
          onPress={handleEditProfile}
        >
          <Ionicons name="create-outline" size={24} color="#dddd" />
          <Text style={styles.actionButtonText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={24} color="#9F9F9F" />
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
          <Ionicons name="lock-closed-outline" size={24} color="#dddd" />
          <Text style={styles.actionButtonText}>Privacidade e Segurança</Text>
          <Ionicons name="chevron-forward" size={24} color="#9F9F9F" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleClearData}>
          <Ionicons name="trash-outline" size={24} color="#dddd" />
          <Text style={styles.actionButtonText}>Limpar Dados do Diário</Text>
          <Ionicons name="chevron-forward" size={24} color="#9F9F9F" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#F44336" />
          <Text style={[styles.actionButtonText, styles.logoutText]}>
            Sair da Conta
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#9F9F9F" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Aconteceu Hoje - Diário Digital</Text>
        <Text style={styles.footerVersion}>Versão 1.0.0</Text>
      </View>

      {/* Modal de Edição de Perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#dddd" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Digite seu nome"
                placeholderTextColor="#999"
              />

              <Text style={[styles.inputLabel, { marginTop: 20 }]}>Email</Text>
              <TextInput
                style={styles.input}
                value={editedEmail}
                onChangeText={setEditedEmail}
                placeholder="Digite seu email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={[styles.inputLabel, { marginTop: 20 }]}>Nova Senha (opcional)</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={editedPassword}
                  onChangeText={setEditedPassword}
                  placeholder="Digite a nova senha"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>

              {editedPassword ? (
                <>
                  <Text style={[styles.inputLabel, { marginTop: 15 }]}>Confirmar Nova Senha</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirme a nova senha"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                </>
              ) : null}

              <Text style={styles.helperText}>
                {editedPassword
                  ? "A senha deve ter pelo menos 6 caracteres"
                  : "Deixe em branco para manter a senha atual"}
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    backgroundColor: "#D9D3CC",
    borderRadius: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#676767",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#D9D3CC",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#dddd",
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
    borderColor: "#403E3E",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#dddd",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#9F9F9F",
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: "#9F9F9F",
    fontStyle: "italic",
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dddd",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#676767",
    width: "48%",
    padding: 20,
    borderRadius: 23,
    alignItems: "center",
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#dddd",
    marginTop: 10,
    marginBottom: 5,
  },
  statNumberSmall: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dddd",
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#9F9F9F",
    textAlign: "center",
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  infoCard: {
    backgroundColor: "#676767",
    borderRadius: 23,
    padding: 15,
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
    color: "#9F9F9F",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: "#dddd",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#555",
  },
  aboutCard: {
    backgroundColor: "#676767",
    borderRadius: 23,
    padding: 20,
  },
  aboutText: {
    fontSize: 15,
    color: "#9F9F9F",
    lineHeight: 24,
    textAlign: "justify",
  },
  actionButton: {
    backgroundColor: "#676767",
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 23,
    marginBottom: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#dddd",
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
    color: "#9F9F9F",
    marginBottom: 5,
  },
  footerVersion: {
    fontSize: 12,
    color: "#676767",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#403E3E",
    borderRadius: 30,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#dddd",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dddd",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#9F9F9F",
    borderRadius: 23,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
    padding: 5,
  },
  helperText: {
    fontSize: 13,
    color: "#9F9F9F",
    marginTop: 8,
    marginBottom: 20,
    fontStyle: "italic",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#555",
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 23,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#9F9F9F",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#676767",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dddd",
  },
});
