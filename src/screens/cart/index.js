import {View, Text, Alert, Image} from "react-native";

import React, {useMemo, useState} from "react";
import {Avatar, Button, Card, Icon, ListItem} from "@rneui/themed";

import styles from "./styles";
import {ScrollView, Swipeable} from "react-native-gesture-handler";
import {useDispatch, useSelector} from "react-redux";
import {removeCart, updateCart} from "../../redux/action/cartAction";
import NumericInput from "react-native-numeric-input";

const Cart = ({navigation}) => {
  const dispatch = useDispatch();
  const {cartItems} = useSelector(state => state.persist.cartInfo);

  const [itemQty, setItemQty] = useState([]);
  const rightSwipeActions = idx => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
        }}>
        <Icon
          onPress={() =>
            Alert.alert("Warning", "Are you sure want to remove this item ?", [
              {
                text: "Cancel",

                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => {
                  const newItem = cartItems.filter((_val, i) => i !== idx);
                  dispatch(removeCart(newItem));
                },
              },
            ])
          }
          name="delete"
          style={{
            color: "#1b1a17",
            paddingHorizontal: 30,
            paddingVertical: 20,
            backgroundColor: "#FFBA33",
            borderRadius: 50,
          }}>
          Delete
        </Icon>
      </View>
    );
  };

  useMemo(() => {
    const length = cartItems.length;

    const initial = Array.from({length}, () => 1);
    setItemQty(initial);
  }, [cartItems]);

  const handleQty = (value, i) => {
    setItemQty(prev => prev.map((val, idx) => (idx !== i ? val : value)));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {!cartItems.length ? (
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
        {!cartItems.length ? (
          <View style={{height: 568, justifyContent: "center"}}>
            <Image
              source={require("../../assets/img/image-44.png")}
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
              Hit the button down below to Create an order
            </Text>
          </View>
        ) : (
          cartItems.map((item, idx) => (
            <Swipeable
              key={idx}
              renderRightActions={() => rightSwipeActions(idx)}>
              <Card
                containerStyle={{
                  borderRadius: 20,
                  marginBottom: 10,
                }}>
                <ListItem>
                  <Avatar source={{uri: item.image}} size={100} />
                  <ListItem.Content>
                    <ListItem.Title
                      style={{
                        fontSize: 24,
                        fontWeight: "700",
                      }}>
                      {item.name}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{
                        fontSize: 20,
                        fontWeight: "400",
                        color: "#895537",
                        marginBottom: 10,
                      }}>
                      IDR {item.price}
                    </ListItem.Subtitle>
                    <NumericInput
                      value={itemQty[idx]}
                      onChange={value => handleQty(value, idx)}
                      totalWidth={100}
                      totalHeight={50}
                      iconSize={25}
                      minValue={1}
                      step={1}
                      valueType="real"
                      rounded
                      textColor="white"
                      iconStyle={{color: "white"}}
                      rightButtonBackgroundColor="#6A4029"
                      leftButtonBackgroundColor="#6A4029"
                      inputStyle={{backgroundColor: "#6A4029"}}
                      borderColor="#6A4029"
                    />
                  </ListItem.Content>
                </ListItem>
              </Card>
            </Swipeable>
          ))
        )}
        {!cartItems.length ? (
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
            <Button
              buttonStyle={styles.loginBtn}
              onPress={() => {
                navigation.navigate("home");
              }}>
              <Text style={{color: "black", fontSize: 17, fontWeight: "700"}}>
                Add More Items
              </Text>
            </Button>
            <Button
              buttonStyle={styles.registBtn}
              onPress={() => {
                const newCart = cartItems.map((items, index) => {
                  return {...items, quantity: itemQty[index]};
                });

                dispatch(updateCart(newCart));
                navigation.navigate("delivery");
              }}>
              <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
                Confirm and Checkout
              </Text>
            </Button>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default Cart;
