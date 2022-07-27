import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
  Modal,
  Alert,
} from "react-native";

import React, {useState, useEffect, useRef} from "react";
import {Button, Card, Icon, ListItem} from "@rneui/themed";
import axios from "axios";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";
import {useSelector} from "react-redux";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {TextInput} from "react-native-paper";

const Profile = ({route, navigation}) => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [password, setPassword] = useState({
    newPass: "",
    old: "",
    confirm: "",
  });
  const [viewPassword, setViewPass] = useState({
    newPass: false,
    confirm: false,
    old: false,
  });
  const [showModal, setShowModal] = useState(false);
  const {token} = useSelector(state => state.persist.userInfo.info);
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.3);
  const isCarousel = useRef(null);
  const _renderItem = ({item, idx}) => {
    return (
      <Image
        key={idx}
        source={{uri: item.image}}
        style={{
          width: 150,
          height: 150,
          marginTop: 20,
          borderRadius: 20,
        }}
      />
    );
  };

  const editPassHandler = () => {
    const {old, newPass, confirm} = password;
    if (!newPass || !old || !confirm) {
      Alert.alert("Error", "Password cannot be empty");
      return;
    }
    if (newPass !== confirm) {
      Alert.alert("Error", "Password not match");
      return;
    }
    const body = {
      newPassword: newPass,
      oldPassword: old,
    };
    setLoading(true);
    axios
      .patch(`https://juncoffee-api.herokuapp.com/user/edit-password/`, body, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(result => {
        setLoading(false);
        setShowModal(false);
        Alert.alert("Success", result.data.message);
      })
      .catch(error => {
        setLoading(false);
        setShowModal(false);
        Alert.alert(
          "Error",
          error.response ? error.response.data.error : error.message,
        );
      });
  };
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `https://juncoffee-api.herokuapp.com/user/profile`,
          {headers: {Authorization: `Bearer ${token}`}},
        );

        setLoading(false);
        setUser(result.data.data);
      } catch (err) {
        setLoading(false);
        console.log(err.response ? err.response.data.error : err.message);
      }
    })();

    (async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `https://juncoffee-api.herokuapp.com/user/history/`,
          {headers: {Authorization: `Bearer ${token}`}},
        );
        const history = result.data.data.map(val => val).slice(0, 5);

        setData(history.map(val => val.detail[0]));
      } catch (err) {
        setLoading(false);
        console.log(err.response ? err.response.data.error : err.message);
      }
    })();
  }, [token, route]);

  return (
    <ScrollView>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator color={"#6A4029"} size={200} />
        ) : (
          <>
            <View style={styles.section}>
              <Image
                source={
                  user.image
                    ? {uri: user.image}
                    : require("../../assets/img/default-img.webp")
                }
                style={{
                  width: 200,
                  height: 200,
                  marginTop: 20,
                  borderRadius: 100,
                }}
              />
              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  fontSize: 24,
                  fontWeight: "900",
                  color: "#6A4029",
                  textAlign: "center",
                }}>
                {user.name}
              </Text>
              <Text
                style={{
                  marginBottom: 5,
                  fontSize: 16,
                  fontWeight: "400",
                  color: "#6A4029",
                  textAlign: "center",
                }}>
                {user.email}
              </Text>
              <Text
                style={{
                  marginBottom: 5,
                  fontSize: 16,
                  fontWeight: "400",
                  color: "#6A4029",
                  textAlign: "center",
                }}>
                {user.phone_number}
              </Text>
              <Text
                style={{
                  marginBottom: 5,
                  fontSize: 16,
                  fontWeight: "400",
                  color: "#6A4029",
                  textAlign: "center",
                }}>
                {user.address}
              </Text>
            </View>

            <View style={styles.top}>
              <Text
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                  marginLeft: 30,
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#6A4029",
                  alignSelf: "flex-start",
                }}>
                Order History
              </Text>
              <Text
                style={{
                  marginBottom: 10,
                  marginRight: 30,
                  fontSize: 16,
                  fontWeight: "400",
                  color: "#6A4029",
                  alignSelf: "flex-end",
                }}
                onPress={() => navigation.navigate("history")}>
                See more
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 15,
                borderBottomColor: "rgba(186, 186, 186, 0.29)",
              }}>
              {!data.length ? (
                <Text
                  style={{
                    textAlign: "center",
                    marginRight: 20,
                    marginTop: 20,
                    marginBottom: 20,
                    fontSize: 24,
                    color: "#6A4029",
                    fontWeight: "900",
                  }}>
                  {"No history Found"}
                </Text>
              ) : (
                <>
                  <Carousel
                    ref={isCarousel}
                    renderItem={_renderItem}
                    data={data}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    onSnapToItem={i => setIndex(i)}
                    useScrollView={true}
                  />
                  <Pagination
                    containerStyle={{
                      marginLeft: 20,
                      marginRight: 20,
                    }}
                    carouselRef={isCarousel}
                    dotsLength={data.length > 1 ? data.length : 2}
                    activeDotIndex={index}
                    dotStyle={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginHorizontal: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.92)",
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    tappableDots={true}
                  />
                </>
              )}
            </View>
            <Card
              containerStyle={{
                borderRadius: 20,
                marginBottom: 10,
              }}>
              <ListItem onPress={() => setShowModal(true)}>
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#6A4029",
                    }}>
                    Edit Password
                  </ListItem.Title>
                </ListItem.Content>
                <Icon name="arrow-right" color={"#6A4029"} />
              </ListItem>
            </Card>
            <Card
              containerStyle={{
                borderRadius: 20,
                marginBottom: 10,
              }}>
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#6A4029",
                    }}>
                    FAQ
                  </ListItem.Title>
                </ListItem.Content>
                <Icon name="arrow-right" color={"#6A4029"} />
              </ListItem>
            </Card>
            <Card
              containerStyle={{
                borderRadius: 20,
                marginBottom: 10,
              }}>
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#6A4029",
                    }}>
                    Help
                  </ListItem.Title>
                </ListItem.Content>
                <Icon name="arrow-right" color={"#6A4029"} />
              </ListItem>
            </Card>
            <Button
              buttonStyle={styles.registBtn}
              onPress={() => navigation.navigate("edit-profile", {user})}>
              <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
                Edit Profile
              </Text>
            </Button>
            <Modal
              animationType="slide"
              transparent={true}
              visible={showModal}
              onRequestClose={() => {
                setShowModal(!showModal);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Edit Password</Text>
                  <TextInput
                    secureTextEntry={viewPassword.old ? false : true}
                    onChangeText={pass => setPassword({...password, old: pass})}
                    right={
                      <TextInput.Icon
                        forceTextInputFocus={false}
                        color={"black"}
                        name={viewPassword.old ? "eye" : "eye-off"}
                        onPress={() =>
                          setViewPass({...viewPassword, old: !viewPassword.old})
                        }
                      />
                    }
                    placeholder="Enter your old password"
                    style={{
                      width: "100%",
                      height: 50,
                      backgroundColor: "white",
                    }}
                  />
                  <TextInput
                    secureTextEntry={viewPassword.newPass ? false : true}
                    onChangeText={pass =>
                      setPassword({...password, newPass: pass})
                    }
                    right={
                      <TextInput.Icon
                        forceTextInputFocus={false}
                        color={"black"}
                        name={viewPassword.newPass ? "eye" : "eye-off"}
                        onPress={() =>
                          setViewPass({
                            ...viewPassword,
                            newPass: !viewPassword.newPass,
                          })
                        }
                      />
                    }
                    placeholder="Enter your new password"
                    style={{
                      width: "100%",
                      height: 50,
                      backgroundColor: "white",
                    }}
                  />
                  <TextInput
                    secureTextEntry={viewPassword.confirm ? false : true}
                    onChangeText={pass =>
                      setPassword({...password, confirm: pass})
                    }
                    placeholder="Confirm your new password"
                    style={{
                      width: "100%",
                      height: 50,
                      backgroundColor: "white",
                    }}
                    force
                    right={
                      <TextInput.Icon
                        forceTextInputFocus={false}
                        color={"black"}
                        name={viewPassword.confirm ? "eye" : "eye-off"}
                        onPress={() =>
                          setViewPass({
                            ...viewPassword,
                            confirm: !viewPassword.confirm,
                          })
                        }
                      />
                    }
                  />
                  <Button buttonStyle={styles.button} onPress={editPassHandler}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 17,
                        fontWeight: "700",
                        textAlign: "center",
                      }}>
                      {loading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        "Set New Password"
                      )}
                    </Text>
                  </Button>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;
