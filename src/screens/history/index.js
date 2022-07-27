import {View, Text, Alert, Image, ActivityIndicator} from "react-native";

import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Icon, ListItem} from "@rneui/themed";

import styles from "./styles";
import {ScrollView, Swipeable} from "react-native-gesture-handler";
import {useSelector} from "react-redux";
import axios from "axios";

const History = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const {token} = useSelector(state => state.persist.userInfo.info);

  const deleteHandler = id => {
    setLoading(true);
    axios
      .delete(`https://juncoffee-api.herokuapp.com/user/history/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      })
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
              "Are you sure want to delete this transaction ?",
              [
                {
                  text: "Cancel",

                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    deleteHandler(item.id);
                  },
                },
              ],
            )
          }
          name="delete"
          color={"white"}
          style={{
            paddingHorizontal: 30,
            paddingVertical: 20,
            backgroundColor: "#6A4029",
            borderRadius: 50,
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
          `https://juncoffee-api.herokuapp.com/user/history/`,
          {headers: {Authorization: `Bearer ${token}`}},
        );
        setLoading(false);
        setUpdate(false);
        setData(result.data.data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    })();

    if (update) {
      (async () => {
        setLoading(true);
        try {
          const result = await axios.get(
            `https://juncoffee-api.herokuapp.com/user/history/`,
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
                swipe left on an item to delete
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
                No History Yet
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
                Hit the button down below to Create an order
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
                    {item.detail.map((detail, i) => (
                      <ListItem key={i}>
                        <Avatar source={{uri: detail.image}} size={100} />
                        <ListItem.Content>
                          <ListItem.Title
                            style={{
                              fontSize: 24,
                              fontWeight: "700",
                            }}>
                            {detail.name_product}
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
                          <ListItem.Subtitle
                            style={{
                              fontSize: 20,
                              fontWeight: "400",
                              color: "#895537",
                              marginBottom: 10,
                            }}>
                            {detail.quantity}x
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
                      {`IDR ${item.detail[0].total_price}`}
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
                      {`${item.detail[0].order_status}`}
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
                Start Ordering
              </Text>
            </Button>
          ) : (
            <>
              <Text
                style={{
                  color: "#9A9A9D",
                  fontSize: 17,
                  fontWeight: "700",
                  textAlign: "center",
                  marginBottom: 10,
                }}>
                You have no history left
              </Text>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default History;
