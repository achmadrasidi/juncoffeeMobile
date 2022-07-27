import {View, Text, Image, ActivityIndicator, Alert} from "react-native";

import React, {useState, useEffect} from "react";
import {Button} from "@rneui/themed";
import axios from "axios";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from "../../redux/action/cartAction";

const Details = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const {role, token} = useSelector(state => state.persist.userInfo.info);

  const {productId, update} = route.params;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `https://juncoffee-api.herokuapp.com/product/detail/${productId}`,
        );
        setLoading(false);
        setData(result.data.data);
      } catch (err) {
        setLoading(false);
        console.log(err.response ? err.response.data.error : err.message);
      }
    })();
  }, [productId, update]);
  const deleteHandler = () => {
    axios
      .delete(`https://juncoffee-api.herokuapp.com/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(result => {
        Alert.alert("Success", result.data.message);
        navigation.navigate("home");
      })
      .catch(error => {
        Alert.alert(
          "Error",
          err.response ? err.response.data.error : err.message,
        );
      });
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator color={"#6A4029"} size={200} />
          ) : (
            <>
              <View style={styles.section}>
                <Image
                  source={{uri: data.image}}
                  style={{
                    width: 200,
                    height: 200,
                    marginTop: 20,
                    borderRadius: 100,
                  }}
                />
                <Text
                  style={{
                    marginTop: 0,
                    marginBottom: 10,
                    fontSize: 32,
                    fontWeight: "900",
                    color: "black",
                    textAlign: "center",
                  }}>
                  {data.name}
                </Text>
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 24,
                    fontWeight: "700",
                    color: "#6A4029",
                    textAlign: "center",
                  }}>
                  IDR {data.price}
                </Text>
              </View>
              <Text
                style={{
                  marginLeft: 30,
                  marginBottom: 5,
                  marginTop: 20,
                  fontSize: 20,
                  fontWeight: "900",
                  color: "black",
                  textAlign: "left",
                }}>
                Delivery info
              </Text>
              <Text
                style={{
                  marginLeft: 30,
                  marginRight: 20,
                  marginBottom: 10,
                  fontSize: 16,
                  fontWeight: "400",
                  color: "black",
                  textAlign: "left",
                }}>
                Delivered only on monday until friday from 1 pm to 7 pm
              </Text>
              <Text
                style={{
                  marginLeft: 30,
                  marginBottom: 5,
                  marginTop: 10,
                  fontSize: 20,
                  fontWeight: "900",
                  color: "black",
                  textAlign: "left",
                }}>
                Description
              </Text>
              <Text
                style={{
                  marginLeft: 30,
                  marginRight: 20,
                  marginBottom: 10,
                  fontSize: 16,
                  fontWeight: "400",
                  color: "black",
                  textAlign: "left",
                }}>
                {data.description}
              </Text>
              <Button
                buttonStyle={styles.registBtn}
                onPress={() => {
                  if (role !== "admin") {
                    const product = {
                      data,
                    };

                    dispatch(addToCart(product));
                    navigation.navigate("cart");
                    return;
                  }
                  navigation.navigate("edit-product", {productId: data.id});
                }}>
                <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
                  {role === "admin" ? "Edit Product" : "Add to Cart"}
                </Text>
              </Button>
              {role === "admin" && (
                <Button
                  buttonStyle={styles.deleteBtn}
                  onPress={() => {
                    Alert.alert(
                      "Warning",
                      "Are you sure delete this product ?",
                      [
                        {
                          text: "Cancel",

                          style: "cancel",
                        },
                        {
                          text: "Yes",
                          onPress: () => {
                            deleteHandler();
                          },
                        },
                      ],
                    );
                  }}>
                  <Text
                    style={{color: "6A4029", fontSize: 17, fontWeight: "700"}}>
                    Delete Product
                  </Text>
                </Button>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Details;
