import {View, Text, Image, ActivityIndicator} from "react-native";

import React, {useEffect, useState} from "react";
import {Button, Card} from "@rneui/themed";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";
import {useSelector} from "react-redux";
import axios from "axios";

const Promo = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const {token, role} = useSelector(state => state.persist.userInfo.info);
  let update
  if (route.params) {
    update = route.params.update;
  }
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `https://juncoffee-api.herokuapp.com/promo/`,
          {headers: {Authorization: `Bearer ${token}`}},
        );
        setLoading(false);

        setData(result.data.data[0]);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    })();
  }, [update]);

  return (
    <ScrollView>
      {loading ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator size={200} color={"#6A4029"} />
        </View>
      ) : (
        <View style={styles.container}>
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
              Coupons will be updated every weeks. Check them out!
            </Text>
          </View>

          <Card
            containerStyle={{
              borderRadius: 20,
              marginBottom: 20,
              marginTop: 50,
              alignItems: "center",
              backgroundColor: "#FFCB65",
            }}>
            <Image
              source={{uri: data.image}}
              style={{
                width: 200,
                height: 200,
                alignSelf: "center",
                backgroundColor: "#FFCB65",
                borderRadius: 200,
              }}
            />

            <Text
              style={{
                marginBottom: 10,
                fontSize: 32,
                fontWeight: "900",
                color: "black",
                textAlign: "center",
              }}>
              {data.name}
            </Text>
            <View style={{borderBottomColor: "black", borderBottomWidth: 1}}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 22,
                  fontWeight: "400",
                  color: "#6A4029",
                  textAlign: "center",
                }}>
                {data.description}
              </Text>
            </View>
            <Text
              style={{
                marginBottom: 10,
                marginTop: 20,
                fontSize: 22,
                fontWeight: "400",
                color: "#6A4029",
                textAlign: "center",
              }}>
              COUPON CODE
            </Text>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 32,
                fontWeight: "900",
                color: "black",
                textAlign: "center",
              }}>
              {data.coupon_code}
            </Text>
            <Text
              style={{
                marginBottom: 10,
                marginTop: 10,
                fontSize: 22,
                fontWeight: "400",
                color: "#6A4029",
                textAlign: "center",
              }}>
              Valid Until {data.expired_date}
            </Text>
          </Card>
          <Button
            buttonStyle={styles.registBtn}
            onPress={() => {
              if (role === "admin") {
                navigation.navigate("edit-promo", {
                  promoId: data.id,
                });
              }
            }}>
            <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
              {role === "admin" ? "Edit Coupon" : "Apply Coupon"}
            </Text>
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default Promo;
