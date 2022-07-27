import {View, Text, ImageBackground} from "react-native";
import React, {useEffect} from "react";
import {Button} from "@rneui/themed";

import styles from "./styles";
import {useSelector} from "react-redux";

const Welcome = ({navigation}) => {
  const {token} = useSelector(state => state.persist.userInfo.info);
  useEffect(() => {
    if (token) {
      navigation.replace("home");
    }
  }, [token]);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/img/image-38.png")}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.section}>
          <Text style={styles.text}>Coffee for Everyone</Text>
          <Button
            buttonStyle={styles.loginBtn}
            onPress={() => {
              navigation.navigate("auth");
            }}>
            <Text style={{color: "black", fontWeight: "700", fontSize: 17}}>
              Get Started
            </Text>
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Welcome;
