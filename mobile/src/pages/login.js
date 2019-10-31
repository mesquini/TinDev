import React, { useState, useEffect } from "react";
import api from "../services/api";

import {
  KeyboardAvoidingView,
  Alert,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  View
} from "react-native";

import logo from "../assets/logo.png";

export default function Login({ navigation }) {
  const [user, setUser] = useState("");
  const [loading, setLoad] = useState(false);

  async function handleLogin() {
    if (!user) Alert.alert("Invalido!", "Informe um usuario!");
    else {
      setLoad(true);
      const { data } = await api.post("/dashboard/", {
        username: user.toLowerCase()
      });

      setUser("");

      await AsyncStorage.clear();      
      await AsyncStorage.setItem("user", data._id);

      setLoad(false);
      navigation.navigate("Home", { user: data._id });
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.conteiner}>
      <Image source={logo} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        value={user}
        onChangeText={setUser}
        placeholderTextColor="#999"
        placeholder="Digite seu usuario no GitHub"
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.btText}>Entrar</Text>
      </TouchableOpacity>
      {loading && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center", flexDirection: 'row' }}
        >          
          <Text style={{ fontSize: 16, fontWeight: "bold", marginRight: 5 }}>
            Carregando...
          </Text>
          <ActivityIndicator size="small" color="#df4720" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 30
  },
  input: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15
  },
  button: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#df4723",
    borderRadius: 4,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  btText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});
