import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  // Dados fictícios para demonstração
  const profileData = {
    name: user?.name || "Usuário",
    email: user?.email || "email@exemplo.com",
    birthDate: "15/03/1990",
    profileImage: "https://via.placeholder.com/150",
  };

  const diaryStats = {
    totalEntries: 47,
    lastEntryDate: "25/01/2025",
    mostFrequentMood: "Feliz 😊",
  };

  const recentEntries = [
    {
      id: 1,
      title: "Um dia incrível no parque",
      date: "25/01/2025",
      excerpt: "Hoje foi um dia maravilhoso. O sol estava brilhando e decidi fazer uma caminhada no parque..."
    },
    {
      id: 2,
      title: "Reflexões sobre o trabalho",
      date: "24/01/2025",
      excerpt: "Passei o dia pensando sobre minha carreira e os próximos passos que preciso dar..."
    },
    {
      id: 3,
      title: "Jantar em família",
      date: "23/01/2025",
      excerpt: "Reunimos toda a família para um jantar especial. Foi muito bom rever todos..."
    },
    {
      id: 4,
      title: "Novo projeto iniciado",
      date: "22/01/2025",
      excerpt: "Comecei um novo projeto hoje. Estou animado com as possibilidades que ele traz..."
    },
    {
      id: 5,
      title: "Dia de descanso",
      date: "21/01/2025",
      excerpt: "Decidi tirar o dia para relaxar e não fazer absolutamente nada produtivo..."
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A5568" />
      
      {/* Cabeçalho com gradiente e logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {/* Temporariamente use uma View com texto até adicionar a logo */}
          {/* <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}
          <View style={styles.logoPlaceholder}>
           <Image
             source={require('../../assets/logo.png')}
             style={styles.logo}
             resizeMode="contain"
           />
          </View>
        </View>
        <Text style={styles.welcomeText}>Bem-vindo ao seu diário</Text>
        <Text style={styles.userName}>{profileData.name}!</Text>
      </View>

      {/* Seção de informações básicas do perfil */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Perfil</Text>
        
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: profileData.profileImage }}
            style={styles.profileImage}
          />
          <View style={styles.profileImageBorder} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValue}>{profileData.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>E-mail:</Text>
            <Text style={styles.infoValue}>{profileData.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data de Nascimento:</Text>
            <Text style={styles.infoValue}>{profileData.birthDate}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Seção de estatísticas do diário */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Estatísticas do Diário</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{diaryStats.totalEntries}</Text>
            <Text style={styles.statLabel}>Total de Entradas</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statDate}>{diaryStats.lastEntryDate}</Text>
            <Text style={styles.statLabel}>Última Entrada</Text>
          </View>

          <View style={[styles.statCard, styles.statCardWide]}>
            <Text style={styles.statMood}>{diaryStats.mostFrequentMood}</Text>
            <Text style={styles.statLabel}>Humor Mais Frequente</Text>
          </View>
        </View>
      </View>

      {/* Lista das últimas 5 entradas */}
      <View style={styles.entriesSection}>
        <Text style={styles.sectionTitle}>Últimas Entradas</Text>

        {recentEntries.map((entry) => (
          <TouchableOpacity key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>
            <Text style={styles.entryExcerpt} numberOfLines={2}>
              {entry.excerpt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão de logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    backgroundColor: '#4A5568',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoContainer: {
    backgroundColor: '#F7FAFC',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    letterSpacing: 1,
  },
  logoSubtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 18,
    color: '#E2E8F0',
    fontWeight: '300',
    marginBottom: 5,
  },
  userName: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 30,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profileImageBorder: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#D4AF37',
    borderStyle: 'dashed',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F7FAFC',
    marginBottom: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  infoLabel: {
    fontSize: 15,
    color: '#4A5568',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    color: '#2D3748',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  editButton: {
    backgroundColor: '#4A5568',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#F7FAFC',
    width: '48%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  statCardWide: {
    width: '100%',
    backgroundColor: '#FFF5E6',
    borderColor: '#D4AF37',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 5,
  },
  statDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 5,
  },
  statMood: {
    fontSize: 24,
    fontWeight: '600',
    color: '#D4AF37',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
  },
  entriesSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  entryCard: {
    backgroundColor: '#F7FAFC',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    flex: 1,
    marginRight: 10,
  },
  entryDate: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
  entryExcerpt: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#E53E3E',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    height: 30,
  },
});
