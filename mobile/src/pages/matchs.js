import React, { useEffect, useState, Component } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Alert,
  AsyncStorage
} from "react-native";

import api from "../services/api";

import logo from "../assets/logo.png";
import github from "../assets/github.png";

export default function Matchs({ navigation }) {
  const [matchs, setMatch] = useState([]);
  const [idMatchs, setIdMatch] = useState([]);

  const url_wpp = "https://api.whatsapp.com/send?phone=55";
  const text_wpp = "&text=Olá%20tudo%20bem?%20Vamos%20fazer%20um%20freela?";
  const devId = navigation.getParam("id");

  useEffect(() => {
    async function loadMatchs() {
      navigation.navigate({ Param: { user: data._id } });
      devId = AsyncStorage.getItem("user").then(() => {
        console.log("match");

        if (user) return user;
      });
      const { data } = await api.get(`/match`, {
        headers: { user: devId }
      });
      const { users, id_matchs } = data;

      setMatch(users);
      setIdMatch(id_matchs);
    }
    loadMatchs();
  }, []);

  async function handleMain() {
    await navigation.navigate("Home", { user: devId });
  }

  async function handleDelete(e, matchId, id) {
    e.preventDefault();

    if (Alert.confirm("Deseja deletar esse Match?")) {
      await api.delete(`/dashboard/${devId}/match`, {
        headers: { matchId, targerid: id }
      });

      setMatch(matchs.filter(user => user._id !== id));
    }
  }
  return (
    <SafeAreaView style={StyleSheet.container}>
      <TouchableOpacity onPress={handleMain}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>
      <ScrollView style={styles.scroll}>
        {matchs.length === 0 ? (
          <Text style={styles.empty}>Você não possui nenhum match!</Text>
        ) : (
          matchs.map((item, i, itens) => (
            <View style={styles.listItem}>
              <Image style={styles.avatar} source={{ uri: item.avatar }} />

              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.company}>{item.company}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.bio}>{item.bio}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd"
  },
  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 35
  },
  scroll: {
    marginBottom: 0
  },
  list: {
    paddingHorizontal: 20
  },
  listItem: {
    paddingHorizontal: 10,
    marginTop: 10,
    borderWidth: 2,
    borderStyle: "solid"
  },
  avatar: {
    width: 60,
    height: 50,
    resizeMode: "cover",
    borderRadius: 3,
    paddingHorizontal: 20
  },
  name: {
    fontWeight: "bold",
    fontSize: 16
  }
});
