import {
  View,
  Text,
  Alert,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";

import React, {useRef, useState} from "react";
import {Button, Card, CheckBox} from "@rneui/themed";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";
import {useDispatch, useSelector} from "react-redux";

import {TextInput} from "react-native-paper";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {removeCart} from "../../redux/action/cartAction";
import axios from "axios";
import {
  sendLocalNotification,
  sendScheduledNotification,
} from "../../helpers/notification";

const Payment = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const {cartItems} = useSelector(state => state.persist.cartInfo) || {};
  const subtotal =
    cartItems.length &&
    cartItems.map(item => item.quantity * item.price).reduce((a, b) => a + b);
  const tax = subtotal * 0.1;
  const shipping = 10000;
  const total = subtotal + tax + shipping;
  const {info} = useSelector(state => state.persist.userInfo);
  const dispatch = useDispatch();
  const SLIDER_WIDTH = Dimensions.get("window").width + 15;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
  const isCarousel = useRef(null);
  const data = [
    {image: require("../../assets/img/image-42.png")},
    {image: require("../../assets/img/image-42.png")},
    {image: require("../../assets/img/image-42.png")},
  ];

  const handlePayment = () => {
    setLoading(true);
    const body = {
      email: info.email,
      totalPrice: total,
      subtotal,
      address: info.address || "No Address",
      payMethod: "Card",
      items: cartItems,
      shipping,
      tax,
    };
    axios
      .post(`https://juncoffee-api.herokuapp.com/user/new-order/`, body, {
        headers: {Authorization: `Bearer ${info.token}`},
      })
      .then(_result => {
        setLoading(false);
        sendLocalNotification(
          `Hi ${info.email}`,
          "Your transaction has been successfully created. Thanks for shopping with Juncoffee",
        );
        const date = new Date(Date.now() + 10 * 1000);
        sendScheduledNotification(
          `Hi ${info.email}`,
          "Have you order your meals ? Order your meal now !",
          date,
        );
        const body = {
          token:
            "fv4EVKUWR36UurvV64ldPV:APA91bEncgyUhH3gAs_hZgmklmIjweF4LrcS5_DxQdmt0Kmw4ALxeK9dc03cdJ8_kZNekxn8oqGb0P2LMDr_E3a2pp-TiX7wyOrAvP4yRU_-rtxzP-YBy0tA-TlDb8vjqr155rR5VjLJ",
          title: "Order Notification",
          message: "You have received new order ! check this out ",
        };
        axios
          .post(`https://juncoffee-api.herokuapp.com/send-notification`, body)
          .then(result => console.log(result.data.message))
          .catch(error =>
            console.log(
              error.response ? error.response.data.error : error.message,
            ),
          );
        navigation.navigate("home");

        dispatch(removeCart([]));
      })
      .catch(error => {
        setLoading(false);
        Alert.alert(
          "Error",
          error.response ? error.response.data.error : error.message,
        );
      });
  };
  const submitOrder = () => {
    Alert.alert("Confirmation", "Are you sure want to proceed ?", [
      {
        text: "Cancel",

        style: "cancel",
      },
      {
        text: "Yes",
        onPress: handlePayment,
      },
    ]);
  };

  const _renderItem = ({item, idx}) => {
    return (
      <Image
        key={idx}
        source={item.image}
        style={{
          width: "100%",
          marginTop: 20,
          borderRadius: 20,
          marginBottom: 10,
        }}
      />
    );
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text
            style={{
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 20,
              fontSize: 32,
              fontWeight: "700",
              color: "black",
              alignSelf: "flex-start",
            }}>
            Payment Methods
          </Text>
        </View>

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
            borderBottomWidth: 0.5,
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

        {!cartItems.length ? (
          <>
            <Text
              style={{
                textAlign: "center",
                fontSize: 32,
                color: "black",
                fontWeight: "700",
              }}>
              No Cart Items
            </Text>
          </>
        ) : (
          cartItems.map(item => (
            <View key={item.id} style={styles.top}>
              <View
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  marginLeft: 30,
                  alignSelf: "flex-start",
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "black",
                  }}>
                  {`${item.quantity}x ${item.name}`}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "400",
                    color: "black",
                  }}>
                  IDR {item.price}/pcs
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  marginRight: 20,
                  fontSize: 24,
                  fontWeight: "700",
                  color: "black",
                  alignSelf: "flex-end",
                }}>
                IDR {item.price * item.quantity}
              </Text>
            </View>
          ))
        )}
        <View
          style={{
            borderBottomWidth: 0.5,
            marginLeft: 20,
            marginRight: 20,
          }}></View>

        <View style={styles.top}>
          <Text
            style={{
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 20,
              fontSize: 20,
              fontWeight: "400",
              color: "black",
              alignSelf: "flex-start",
            }}>
            Subtotal
          </Text>
          <Text
            style={{
              marginBottom: 10,
              marginRight: 20,
              fontSize: 22,
              fontWeight: "400",
              color: "black",
              alignSelf: "flex-end",
            }}>
            IDR {subtotal}
          </Text>
        </View>
        <View style={styles.top}>
          <Text
            style={{
              marginBottom: 10,
              marginLeft: 20,
              fontSize: 20,
              fontWeight: "400",
              color: "black",
              alignSelf: "flex-start",
            }}>
            Shipping
          </Text>
          <Text
            style={{
              marginBottom: 10,
              marginRight: 20,
              fontSize: 22,
              fontWeight: "400",
              color: "black",
              alignSelf: "flex-end",
            }}>
            IDR {shipping}
          </Text>
        </View>
        <View style={styles.top}>
          <Text
            style={{
              marginBottom: 10,
              marginLeft: 20,
              fontSize: 20,
              fontWeight: "400",
              color: "black",
              alignSelf: "flex-start",
            }}>
            Tax
          </Text>
          <Text
            style={{
              marginBottom: 10,
              marginRight: 20,
              fontSize: 22,
              fontWeight: "400",
              color: "black",
              alignSelf: "flex-end",
            }}>
            IDR {tax}
          </Text>
        </View>
        <View style={styles.top}>
          <Text
            style={{
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 20,
              fontSize: 24,
              fontWeight: "700",
              color: "black",
              alignSelf: "flex-start",
            }}>
            Total
          </Text>
          <Text
            style={{
              marginBottom: 10,
              marginRight: 20,
              fontSize: 24,
              fontWeight: "700",
              color: "black",
              alignSelf: "flex-end",
            }}>
            IDR {total}
          </Text>
        </View>
        <Button buttonStyle={styles.registBtn} onPress={submitOrder}>
          <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
            {loading ? (
              <ActivityIndicator color="white" size={30} />
            ) : (
              "Pay Now"
            )}
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default Payment;
