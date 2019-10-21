import React, { useEffect, useState } from "react";
import {
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  AsyncStorage
} from "react-native";
import api from "../services/api";

import logo from "../assets/logo.png";

export default function Perfil({ navigation }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [company, setCompany] = useState("");
  const [blog, setBlog] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    async function loadInfo() {
      console.log('perfil');
      
      await AsyncStorage.then(info => {
        if (info) setUser(info);
        else navigation.navigate("Sair");
      });

      console.log(`perfil ${info._id}`);
    }
    loadInfo();
  }, []);

  async function trataCampoNull(obj) {
    if (!obj.name) obj.name = user.name;
    if (!obj.bio) obj.bio = user.bio;
    if (!obj.company) obj.company = user.company;
    if (!obj.blog) obj.blog = user.blog;
    if (!obj.email) obj.email = user.email;
    if (!obj.celular) obj.celular = user.celular;
  }
  async function handleSubmit() {
    const update = { name, bio, company, blog, email, celular };

    await trataCampoNull(update);

    await api.put(`/perfil`, update, {
      headers: { user: user._id }
    });

    Alert.alert("Perfil alterado com sucesso!");

    handleHome();
  }

  function handleHome() {
    navigation.navigate("Home", { user: user._id });
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableOpacity onPress={handleHome}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>
      <ScrollView>
        <Text style={styles.text}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
          placeholder={user.name}
        />
        <Text style={styles.text}>Biografia</Text>
        <TextInput
          style={styles.input}
          value={bio}
          multiline={true}
          onChangeText={setBio}
          placeholderTextColor="#999"
          placeholder={user.bio}
        />
        <Text style={styles.text}>Empresa</Text>
        <TextInput
          style={styles.input}
          value={company}
          onChangeText={setCompany}
          placeholderTextColor="#999"
          placeholder={user.company}
        />
        <Text style={styles.text}>Linkedin</Text>
        <TextInput
          style={styles.input}
          value={blog}
          onChangeText={setBlog}
          placeholderTextColor="#999"
          placeholder={user.blog}
        />
        <Text style={styles.text}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCompleteType="email"
          keyboardType="email-address"
          placeholderTextColor="#999"
          placeholder={user.email}
        />
        <Text style={styles.text}>Celular</Text>
        <TextInput
          style={styles.input}
          value={celular}
          keyboardType="numeric"
          onChangeText={setCelular}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.btText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    marginTop: 30
  },
  input: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginTop: 10,
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
  },
  text: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: "bold"
  }
});
