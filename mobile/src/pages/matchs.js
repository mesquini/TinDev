import React, { useEffect, useState, Component } from "react";
import Swipeable from "react-native-swipeable-row";
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
  Linking,
  ActivityIndicator,
  TouchableHighlight
} from "react-native";

import api from "../services/api";

import logo from "../assets/logo.png";
import github from "../assets/github.png";
import wpp from "../assets/wpp.png";
import blog from "../assets/linkedin.png";
import x from "../assets/clear.png";

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export default function Matchs({ navigation }) {
  const [matchs, setMatch] = useState([]);
  const [idMatchs, setIdMatch] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoad] = useState(true);
  const [owrnId, setOwrnId] = useState("");

  function rightButtons(idMatch, targetId) {
    return [
      <TouchableHighlight
        style={{
          backgroundColor: "#d1d6da",
          flex: 1,
          justifyContent: "center",
          marginTop: 10,
          borderRadius: 2,
        }}
        onPress={() => handleDelete(idMatch, targetId)}
        underlayColor={"#d1d6da"}
      >
        <Image style={{ marginHorizontal: 20 }} source={x} />
      </TouchableHighlight>
    ];
  }
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setLoad(true);

    const { data } = await api.get(`/match`, {
      headers: { user: owrnId }
    });
    const { users, id_matchs } = data;

    setLoad(false);
    setMatch(users);
    setIdMatch(id_matchs);

    wait(1000).then(() => setRefreshing(false));
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
      setOwrnId(devId);
      setLoad(false);
      setMatch(users);
      setIdMatch(id_matchs);
    }
    loadMatchs();
  }, []);

  async function handleDelete(matchId, id) {
    Alert.alert(
      "Alerta",
      "Deseja deletar esse Match?",
      [        
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Sim", onPress: async () => {
          await api.delete(`/dashboard/${owrnId}/match`, {
            headers: { matchId, targerid: id }
          });      
          setMatch(matchs.filter(user => user._id !== id));          
        } }
      ],
      { cancelable: false }
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />
      {loading === true ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#df4720" />
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Carregando matchs...
          </Text>
        </View>
      ) : (
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
              <Swipeable rightButtons={rightButtons(idMatchs[i], item._id)}>
                <View style={styles.listItem}>
                  <View style={styles.vImg}>
                    <Image
                      style={styles.avatar}
                      source={{ uri: item.avatar }}
                    />
                  </View>
                  <View style={{ flex: 1, marginTop: 2 }}>
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
                      </Text>
                      <Text style={styles.txt}>
                        {item.email ? `E-mail: ${item.email}` : ""}
                      </Text>
                    </View>
                  </View>
                </View>
              </Swipeable>
            ))
          )}
        </ScrollView>
      )}
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
    borderStyle: "solid",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  infos: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
    marginTop: 2
  },
  infos2: {
    flex: 1,
    marginTop: 2
  },
  vImg: {
    alignItems: "center",
    justifyContent: "center"
  },
  avatar: {
    width: 60,
    height: 60,
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
    marginRight: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  txt: {
    fontSize: 14,
    marginBottom: 2
  }
});
