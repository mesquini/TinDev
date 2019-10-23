import React, { useEffect, useState, Component } from "react";
import Constants from "expo-constants";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Alert,
  AsyncStorage,
  RefreshControl,
  Linking
} from "react-native";

import api from "../services/api";

import logo from "../assets/logo.png";
import github from "../assets/github.png";
import wpp from "../assets/wpp.png";
import blog from "../assets/linkedin.png";

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export default function Matchs({ navigation }) {
  const [matchs, setMatch] = useState([]);
  const [idMatchs, setIdMatch] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    let devId = await AsyncStorage.getItem("user");

    const { data } = await api.get(`/match`, {
      headers: { user: devId }
    });
    const { users, id_matchs } = data;

    setMatch(users);
    setIdMatch(id_matchs);
    wait(2000).then(() => setRefreshing(false));
  }, [refreshing]);

  const url_wpp = "https://api.whatsapp.com/send?phone=55";
  const text_wpp = "&text=Olá%20tudo%20bem?%20Bora%20fazer%20um%20freela??";

  useEffect(() => {
    async function loadMatchs() {
      let devId = await AsyncStorage.getItem("user");

      const { data } = await api.get(`/match`, {
        headers: { user: devId }
      });
      const { users, id_matchs } = data;

      setMatch(users);
      setIdMatch(id_matchs);
    }
    loadMatchs();
  }, []);

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
      <Image style={styles.logo} source={logo} />
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {matchs.length === 0 ? (
          <Text style={styles.empty}>Você não possui nenhum match!</Text>
        ) : (
          matchs.map((item, i, itens) => (
            <View style={styles.listItem}>
              <View style={styles.vImg}>
                <Image style={styles.avatar} source={{ uri: item.avatar }} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.infos}>
                  {item.blog ? (
                    <TouchableOpacity
                      style={styles.btGithub}
                      onPress={() =>
                        Linking.openURL(
                          "https://www.linkedin.com/in/" + item.blog
                        )
                      }
                    >
                      <Image source={blog} />
                    </TouchableOpacity>
                  ) : (
                    <Text></Text>
                  )}
                  {item.celular ? (
                    <TouchableOpacity
                      style={styles.btGithub}
                      onPress={() =>
                        Linking.openURL(url_wpp + item.celular + text_wpp)
                      }
                    >
                      <Image source={wpp} />
                    </TouchableOpacity>
                  ) : (
                    <Text></Text>
                  )}
                  <TouchableOpacity
                    style={styles.btGithub}
                    onPress={() => Linking.openURL(item.url_github)}
                  >
                    <Image source={github} />
                  </TouchableOpacity>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
                <View style={styles.infos2}>
                  <Text style={styles.txt}>
                    {item.company ? `Empresa: ${item.company}` : ""}
                    {item.email ? `/ E-mail: ${item.email}` : ""}
                  </Text>
                  <Text style={styles.txt}>
                    {item.bio ? `Biografia: ${item.bio}` : ""}
                  </Text>
                </View>
              </View>
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
    backgroundColor: "#ddd",
    marginTop: Constants.statusBarHeight
  },
  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 35
  },
  empty: {
    alignSelf: "center",
    color: "#999",
    fontSize: 20,
    fontWeight: "bold"
  },
  scroll: {
    marginBottom: 0
  },
  list: {
    paddingHorizontal: 20
  },
  listItem: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 10,
    marginRight: 2,
    marginLeft: 2,
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "solid"
  },
  infos: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
  },
  infos2: {
    flex: 1,
    marginTop: 2
  },
  vImg: {
    alignItems: 'center',
    justifyContent: 'center',
    
  },  
  avatar: {
    width: 60,
    height: 50,
    resizeMode: "cover",
    borderRadius: 3,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 10
  },
  name: {
    fontWeight: "bold",
    fontSize: 16
  },
  btGithub: {
    marginRight: 3
  },
  txt: {
    fontSize: 14,
    marginBottom: 2
  }
});
