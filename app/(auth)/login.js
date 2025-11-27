import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(email, password);

      if (!result.success) {
        Alert.alert("Erro", result.message || "Falha ao fazer login");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.ImageContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logoImage}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            placeholderTextColor="#dddd"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
            placeholderTextColor="#dddd"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem conta? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#403E3E",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  ImageContainer: {
    width: "50%",
    aspectRatio: 1,
    backgroundColor: "#D9D3CC",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 80,
  },
  input: {
    width: "70%",
    backgroundColor: "#9F9F9F",
    borderRadius: 23,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#555",
  },
  button: {
    width: "30%",
    backgroundColor: "#676767",
    borderRadius: 23,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#dddd",
    fontSize: 16,
  },
  registerLink: {
    color: "#dddd",
    fontSize: 16,
    fontWeight: "600",
  },
});
