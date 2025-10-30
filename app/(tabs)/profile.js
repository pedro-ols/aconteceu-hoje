import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
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
    <ScrollView>
      <View>
        {/* Cabeçalho com saudação */}
        <View>
          <Text>Bem-vindo ao seu diário, {profileData.name}!</Text>
        </View>

        {/* Seção de informações básicas do perfil */}
        <View>
          <Text>Perfil</Text>
          
          <View>
            <Image
              source={{ uri: profileData.profileImage }}
              style={{ width: 150, height: 150 }}
            />
          </View>

          <View>
            <Text>Nome:</Text>
            <Text>{profileData.name}</Text>
          </View>

          <View>
            <Text>E-mail:</Text>
            <Text>{profileData.email}</Text>
          </View>

          <View>
            <Text>Data de Nascimento:</Text>
            <Text>{profileData.birthDate}</Text>
          </View>

          <TouchableOpacity>
            <Text>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Seção de estatísticas do diário */}
        <View>
          <Text>Estatísticas do Diário</Text>

          <View>
            <Text>Total de Entradas</Text>
            <Text>{diaryStats.totalEntries}</Text>
          </View>

          <View>
            <Text>Última Entrada</Text>
            <Text>{diaryStats.lastEntryDate}</Text>
          </View>

          <View>
            <Text>Humor Mais Frequente</Text>
            <Text>{diaryStats.mostFrequentMood}</Text>
          </View>
        </View>

        {/* Lista das últimas 5 entradas */}
        <View>
          <Text>Últimas Entradas</Text>

          {recentEntries.map((entry) => (
            <View key={entry.id}>
              <Text>{entry.title}</Text>
              <Text>{entry.date}</Text>
              <Text>{entry.excerpt}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
