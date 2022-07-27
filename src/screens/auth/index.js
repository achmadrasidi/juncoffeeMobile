import {View, Text, ImageBackground} from "react-native";
import React, {useEffect} from "react";
import {Button} from "@rneui/themed";

import styles from "./styles";
import {useSelector} from "react-redux";

const Auth = ({navigation}) => {
  const {token} = useSelector(state => state.persist.userInfo.info);
  useEffect(() => {
    if (token) {
      navigation.replace("home");
    }
  }, [token]);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/img/image-37.png")}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.section}>
          <View style={styles.top}>
            <Text style={styles.text}>Welcome!</Text>
            <Text style={styles.textSmall}>
              Get a cup of coffee for free every sunday morning
            </Text>
          </View>
          <View style={styles.top}>
            <Button
              buttonStyle={styles.registBtn}
              onPress={() => {
                navigation.navigate("register");
              }}>
              <Text style={{color: "white", fontWeight: "700", fontSize: 17}}>
                Create New Account
              </Text>
            </Button>
            <Button
              buttonStyle={styles.loginBtn}
              onPress={() => {
                navigation.navigate("login");
              }}>
              <Text style={{color: "black", fontWeight: "700", fontSize: 17}}>
                Login
              </Text>
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Auth;
