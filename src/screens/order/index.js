import {View, Text, Alert, Image, ActivityIndicator} from "react-native";

import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Icon, ListItem} from "@rneui/themed";

import styles from "./styles";
import {ScrollView, Swipeable} from "react-native-gesture-handler";
import {useSelector} from "react-redux";
import axios from "axios";

const Order = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const {token} = useSelector(state => state.persist.userInfo.info);

  const updateHandler = id => {
    setLoading(true);
    axios
      .patch(
        `https://juncoffee-api.herokuapp.com/transaction/${id}`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then(result => {
        setLoading(false);
        setUpdate(true);
        Alert.alert("Success", result.data.message);
      })
      .catch(error => {
        setLoading(false);

        Alert.alert(
          "Error",
          error.response ? error.response.data.error : error.message,
        );
      });
  };
  const updateAllHandler = () => {
    setLoading(true);
    axios
      .put(
        `https://juncoffee-api.herokuapp.com/transaction/`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then(result => {
        console.log(result);
        setLoading(false);
        setUpdate(true);
        Alert.alert("Success", result.data.message);
      })
      .catch(error => {
        setLoading(false);
        console.log(error.response.data);
        Alert.alert(
          "Error",
          error.response ? error.response.data.error : error.message,
        );
      });
  };

  const rightSwipeActions = item => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
        }}>
        <Icon
          onPress={() =>
            Alert.alert(
              "Warning",
              "Are you sure want to mark this order as done ?",
              [
                {
                  text: "Cancel",

                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    updateHandler(item.id);
                  },
                },
              ],
            )
          }
          name="check"
          color={"white"}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: "#6A4029",
            borderRadius: 50,
            marginRight: 15,
          }}>
          Delete
        </Icon>
      </View>
    );
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `https://juncoffee-api.herokuapp.com/transaction`,
          {headers: {Authorization: `Bearer ${token}`}},
        );
        setLoading(false);
        setUpdate(false);
        setData(result.data.data);
      } catch (error) {
        console.log(error.response.data);
        setLoading(false);
        console.log(error);
      }
    })();

    if (update) {
      (async () => {
        setLoading(true);
        try {
          const result = await axios.get(
            `https://juncoffee-api.herokuapp.com/transaction`,
            {headers: {Authorization: `Bearer ${token}`}},
          );
          setLoading(false);
          setUpdate(false);
          setData(result.data.data);
        } catch (error) {
          setLoading(false);
          setUpdate(false);
          setData([]);
          console.log(error.response);
        }
      })();
    }
  }, [token, update]);

  return (
    <ScrollView>
      {loading ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator size={200} color={"#6A4029"} />
        </View>
      ) : (
        <View style={styles.container}>
          {!data.length ? (
            <></>
          ) : (
            <View style={styles.section}>
              <Text
                style={{
                  marginTop: 40,
                  marginBottom: 10,
                  fontSize: 20,
                  fontWeight: "400",
                  color: "black",
                  textAlign: "center",
                }}>
                swipe left on an item when it's done
              </Text>
            </View>
          )}
          {!data.length ? (
            <View style={{height: 568, justifyContent: "center"}}>
              <Image
                source={require("../../assets/img/image-45.png")}
                style={{alignSelf: "center", marginBottom: 20}}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 32,
                  color: "black",

                  fontWeight: "700",
                }}>
                No Orders Yet
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  color: "black",
                  marginLeft: 20,
                  marginRight: 20,
                  fontWeight: "400",
                }}>
                Just wait for the notification for incoming orders
              </Text>
            </View>
          ) : (
            data.map((item, idx) => (
              <React.Fragment key={idx}>
                <Swipeable renderRightActions={() => rightSwipeActions(item)}>
                  <Card
                    containerStyle={{
                      borderRadius: 20,
                      marginBottom: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: "700",
                        textAlign: "center",
                      }}>
                      {`Order ${item.id}`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "400",
                        textAlign: "center",
                      }}>
                      {item.detail.map(detail => detail.user_email)}
                    </Text>
                    {item.detail.map((detail, i) => (
                      <ListItem key={i}>
                        <Avatar source={{uri: detail.image}} size={100} />
                        <ListItem.Content>
                          <ListItem.Title
                            style={{
                              fontSize: 24,
                              fontWeight: "700",
                            }}>
                            {detail.product_name} (x{detail.quantity})
                          </ListItem.Title>
                          <ListItem.Subtitle
                            style={{
                              fontSize: 20,
                              fontWeight: "400",
                              color: "#895537",
                              marginBottom: 10,
                            }}>
                            IDR {detail.price}
                          </ListItem.Subtitle>
                        </ListItem.Content>
                      </ListItem>
                    ))}
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "700",
                        textAlign: "center",
                      }}>
                      {`IDR ${item.detail[0].total}`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "400",
                        textAlign: "center",
                      }}>
                      (include tax and shipping)
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "700",
                        textAlign: "center",
                      }}>
                      {`${item.detail[0].status}`}
                    </Text>
                  </Card>
                </Swipeable>
              </React.Fragment>
            ))
          )}
          {!data.length ? (
            <Button
              buttonStyle={styles.registBtn}
              onPress={() => {
                navigation.navigate("home");
              }}>
              <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
                Back To Home
              </Text>
            </Button>
          ) : (
            <>
              <Button
                buttonStyle={styles.loginBtn}
                onPress={() => {
                  Alert.alert(
                    "Warning",
                    "Are you sure want to mark all order as done ?",
                    [
                      {
                        text: "Cancel",

                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          updateAllHandler();
                        },
                      },
                    ],
                  );
                }}>
                <Text
                  style={{color: "#6A4029", fontSize: 17, fontWeight: "700"}}>
                  Mark all as done
                </Text>
              </Button>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default Order;
