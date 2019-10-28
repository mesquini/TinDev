import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  Linking,
  ActivityIndicator,
  Alert
} from "react-native";

import api from "../services/api";

import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import star from "../assets/star.png";
import github from "../assets/github.png";
import itsamatch from "../assets/itsamatch.png";

export default function Main({ navigation }) {
  const [id, setId] = useState("");
  const [users, setUsers] = useState([]);
  const [superLike, setSuper_Likes] = useState([]);
  const [owner, setOwner] = useState({});
  const [matchDev, setMatchDev] = useState(null);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    const socket = io("http://tinderdev-backend.herokuapp.com", {
      query: { user: id }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
    });

    socket.on("superlike", dev => {
      setOwner(dev);
    });
  }, [owner._id]);

  useEffect(() => {
    async function loadUsers() {
      let id = await AsyncStorage.getItem("user");

      const { data } = await api.get("/dashboard", {
        headers: { user: id }
      });

      await random(data);
      setId(id);

      setUsers(data.filter(user => user._id !== id));
      await setSuperLikes(data.filter(user => user._id !== id));

      const { data: own } = await api.get("/logge_dev", {
        headers: { user: id }
      });
      setOwner(own);
      setMatchDev(own);
      setLoad(false);
    }
    loadUsers();
  }, [id]);

  async function random(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  async function setSuperLikes(u) {
    var sLike = [];
    var cont = u.length - 1;
    u.map(user => {
      if (user.superlikes.length > 0) {
        for (var i = user.superlikes.length - 1; i >= 0; i--) {
          if (user.superlikes[i] === id) {
            sLike[cont] = user._id;
            cont--;
          }
        }
      }
    });
    setSuper_Likes(sLike);
  }

  async function handleLike() {
    const [userCorrent, ...rest] = users;

    await api.post(`/dashboard/${userCorrent._id}/likes`, null, {
      headers: { user: id }
    });

    setUsers(rest);
  }

  async function handleSuperLike() {
    const [userCorrent, ...rest] = users;

    await api.post(`/dashboard/${userCorrent._id}/superlikes`, null, {
      headers: { user: id }
    });

    setUsers(rest);
  }
  async function handleDislike() {
    const [userCorrent, ...rest] = users;

    await api.post(`/dashboard/${userCorrent._id}/dislikes`, null, {
      headers: { user: id }
    });

    setUsers(rest);
  }

  return (
    <SafeAreaView style={{flex:1}}>
      {loading === true ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#df4720" />
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Carregando informações...
          </Text>
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <Image style={styles.logo} source={logo} />
          <View style={styles.cardsContainer}>
            {users.lenght === 0 ? (
              <Text style={styles.empty}>Acabou :(</Text>
            ) : (
              users.map((user, index) => (
                <View
                  key={user._id}
                  style={[styles.card, { zIndex: users.length - index }]}
                >
                  <Image style={styles.avatar} source={{ uri: user.avatar }} />
                  {superLike.length > 0 &&
                    superLike.map(
                      s =>
                        s === user._id && (
                          <Image style={styles.star} key={s} source={star} />
                        )
                    )}
                  <View style={styles.footer}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.name}>{user.name}</Text>
                      <TouchableOpacity
                        style={styles.github}
                        onPress={() => Linking.openURL(user.url_github)}
                      >
                        <Image source={github} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.company}>
                      {user.company ? `Empresa: ${user.company}` : ""}
                    </Text>
                    <Text style={styles.bio} namberOfLines={3}>
                      {user.bio}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
          {users.length > 0 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleDislike}>
                <Image source={dislike} />
              </TouchableOpacity>
              {owner.super_like ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSuperLike}
                >
                  <Image source={star} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.noButton}
                  onPress={() => Alert.alert("Você já usou seu super like")}
                >
                  <Image source={star} />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.button} onPress={handleLike}>
                <Image source={like} />
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      )}
            {matchDev && (
              <View style={styles.matchContainer}>
                <Image source={itsamatch} />
                <Image
                  style={styles.matchAvatar}
                  source={{ uri: matchDev.avatar }}
                />
                <Text style={styles.matchName}>{matchDev.name}</Text>
                <Text style={styles.matchBio}>{matchDev.bio}</Text>
                <TouchableOpacity onPress={() => setMatchDev(null)}>
                  <Text style={styles.matchButton}>Fechar</Text>
                </TouchableOpacity>
              </View>
            )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-between"
  },
  cardsContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    maxHeight: 800
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 30,
    overflow: "hidden",
    ...StyleSheet.absoluteFillObject
  },
  logo: {
    marginTop: 30,
  },
  empty: {
    alignSelf: "center",
    color: "#999",
    fontSize: 24,
    fontWeight: "bold"
  },
  avatar: {
    flex: 1,
    height: 300
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  nameContainer: {
    flexDirection: "row"
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  github: {
    width: 25,
    height: 25,
    elevation: 2,
    marginLeft: 15
  },
  bio: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    lineHeight: 18
  },
  star: {
    width: 35,
    height: 35,
    //position: "absolute",
    margin: 8,
    borderRadius: 50,
    backgroundColor: "#fff"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  noButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0, 0.5)",
    flex: 1,
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center"
  },

  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: "#fff",
    marginVertical: 30
  },

  matchName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff"
  },

  matchBio: {
    marginTop: 10,
    fontSize: 16,
    color: "rgba(255,255,255, 0.8)",
    paddingHorizontal: 30
  },

  matchButton: {
    fontSize: 16,
    color: "rgba(255,255,255, 1)",
    textAlign: "center",
    marginTop: 30,
    fontWeight: "bold"
  }
});
