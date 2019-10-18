import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  Form,
  TextInput
} from "react-native";
import api from "../services/api";

import logo from "../assets/logo.png";
import { SafeAreaView } from "react-navigation";

export default function Perfil({ navigation }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [company, setCompany] = useState("");
  const [blog, setBlog] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const user = navigation.getParam("owner");

  async function trataCampoNull(obj) {
    if (!obj.name) obj.name = user.name;
    if (!obj.bio) obj.bio = user.bio;
    if (!obj.company) obj.company = user.company;
    if (!obj.blog) obj.blog = user.blog;
    if (!obj.email) obj.email = user.email;
    if (!obj.celular) obj.celular = user.celular;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const update = { name, bio, company, blog, email, celular };

    await trataCampoNull(update);

    await api.put(`/perfil`, update, {
      headers: { user: devId }
    });

    handleHome();
  }

  function handleHome() {
    navigation.navigate("main", { user: user._id});
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TouchableOpacity onPress={handleHome}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
      <SafeAreaView>
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
          autoCompleteType='email'
          keyboardType='email-address'
          placeholderTextColor="#999"
          placeholder={user.email}
        />
        <Text style={styles.text}>Celular</Text>
        <TextInput
          style={styles.input}
          value={celular}
          keyboardType='numeric'
          onChangeText={setCelular}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.btText}>Salvar</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
