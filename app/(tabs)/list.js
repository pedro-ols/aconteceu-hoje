import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>Bem-vindo(a)!</Text>
        <Text style={styles.userName}>{user?.name}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  userName: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
});
