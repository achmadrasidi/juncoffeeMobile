import {View, Text, Alert} from "react-native";

import React, {useState} from "react";
import {Button, Card, CheckBox} from "@rneui/themed";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";
import {useSelector} from "react-redux";

import {TextInput} from "react-native-paper";

const Delivery = ({navigation}) => {
  const [disable, setDisable] = useState(true);
  const [checked, setChecked] = useState(false);
  const {cartItems} = useSelector(state => state.persist.cartInfo);
  const totalPrice =
    cartItems.length &&
    cartItems.map(item => item.quantity * item.price).reduce((a, b) => a + b);
  const {info} = useSelector(state => state.persist.userInfo);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text
            style={{
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 20,
              fontSize: 40,
              fontWeight: "700",
              color: "black",
              alignSelf: "flex-start",
            }}>
            Delivery
          </Text>
          <View style={styles.top}>
            <Text
              style={{
                marginTop: 40,
                marginBottom: 10,

                fontSize: 24,
                fontWeight: "700",
                color: "black",
                alignSelf: "flex-start",
              }}>
              Address details
            </Text>
            <Text
              style={{
                marginBottom: 10,
                marginLeft: 110,
                fontSize: 20,
                fontWeight: "400",
                color: "#6A4029",
                alignSelf: "flex-end",
              }}
              onPress={() => {
                if (disable) {
                  setDisable(false);
                  return;
                }
                setDisable(true);
              }}>
              {disable ? "Change" : "Save"}
            </Text>
          </View>
        </View>

        <Card
          containerStyle={{
            borderRadius: 20,
            marginBottom: 10,
          }}>
          <TextInput
            style={{
              backgroundColor: "white",
              fontSize: 20,
              fontWeight: "700",
            }}
            defaultValue={`${info.email.split("@")[0]} address`}
            disabled
          />
          <TextInput
            style={{backgroundColor: "white"}}
            multiline
            defaultValue={info.address ? info.address : "No Address"}
            disabled={disable}
          />
          <TextInput
            style={{
              backgroundColor: "white",
            }}
            underlineColor={"transparent"}
            defaultValue={info.phone_number}
            disabled={disable}
          />
        </Card>
        <Text
          style={{
            marginTop: 20,
            marginBottom: 10,
            marginLeft: 30,
            fontSize: 24,
            fontWeight: "700",
            color: "black",
            alignSelf: "flex-start",
          }}>
          Delivery Methods
        </Text>
        <Card
          containerStyle={{
            borderRadius: 20,
            marginBottom: 10,
          }}>
          <CheckBox
            title={"Door delivery"}
            checkedIcon={"dot-circle-o"}
            uncheckedIcon={"circle-o"}
            textStyle={{fontSize: 20, color: "black", fontWeight: "400"}}
            containerStyle={{
              borderBottomWidth: 0.5,
              borderBottomColor: "black",
            }}
            checkedColor={"#6A4029"}
            checked={checked === "Door delivery" ? true : false}
            onPress={() => setChecked("Door delivery")}
          />
          <CheckBox
            title={"Pick up at store"}
            checkedIcon={"dot-circle-o"}
            checkedColor={"#6A4029"}
            uncheckedIcon={"circle-o"}
            textStyle={{fontSize: 20, color: "black", fontWeight: "400"}}
            containerStyle={{
              borderBottomWidth: 0.5,
              borderBottomColor: "black",
            }}
            checked={checked === "Pick up" ? true : false}
            onPress={() => setChecked("Pick up")}
          />
          <CheckBox
            title={"Dine in"}
            textStyle={{fontSize: 20, color: "black", fontWeight: "400"}}
            checkedIcon={"dot-circle-o"}
            uncheckedIcon={"circle-o"}
            checkedColor={"#6A4029"}
            checked={checked === "Dine in" ? true : false}
            onPress={() => setChecked("Dine in")}
          />
        </Card>
        <View style={styles.top}>
          <Text
            style={{
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 20,
              fontSize: 24,
              fontWeight: "400",
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
            IDR {totalPrice}
          </Text>
        </View>
        <Button
          buttonStyle={styles.registBtn}
          onPress={() => {
            if (!checked) {
              Alert.alert("Error", "Please choose delivery method");
              return;
            }
            navigation.navigate("payment");
          }}>
          <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
            Proceed to payment
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default Delivery;
