import {
  View,
  Text,
  ImageBackground,
  Image,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from "react-native";
import {API_URL} from "@env";
import {TextInput} from "react-native-paper";
import React, {useState} from "react";
import {Button} from "@rneui/themed";
import axios from "axios";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";

const Register = ({navigation}) => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [viewPassword, setViewPass] = useState(false);

  const registHandler = () => {
    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const phoneFormat = /^\d{12}$/;
    const {email, password, phone_number} = input;
    if (!email) {
      ToastAndroid.show(
        "Email Field is Required",
        ToastAndroid.CENTER,
        ToastAndroid.SHORT,
      );
      return;
    }
    if (!password) {
      ToastAndroid.show(
        "Password Field is Required",
        ToastAndroid.CENTER,
        ToastAndroid.SHORT,
      );
      return;
    }
    if (!phone_number) {
      ToastAndroid.show(
        "Phone Field is Required",
        ToastAndroid.CENTER,
        ToastAndroid.SHORT,
      );
      return;
    }
    if (!email.match(emailFormat)) {
      ToastAndroid.show(
        "Invalid Email Format",
        ToastAndroid.CENTER,
        ToastAndroid.SHORT,
      );
      return;
    }
    if (!phone_number.match(phoneFormat)) {
      ToastAndroid.show(
        "Invalid Phone Format",
        ToastAndroid.CENTER,
        ToastAndroid.SHORT,
      );
      return;
    }
    const body = {
      email,
      password,
      phone_number,
    };
    setLoading(true);
    axios
      .post(`${API_URL}/auth/register`, body)
      .then(result => {
        setLoading(false);
        Alert.alert("Success!", result.data.message, [
          {
            onPress: () => {
              navigation.navigate("login");
            },
          },
        ]);
      })
      .catch(err => {
        setLoading(false);
        ToastAndroid.show(
          err.response ? err.response.data.error : err.message,
          ToastAndroid.CENTER,
          ToastAndroid.SHORT,
        );
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/img/image-39.png")}
          resizeMode="cover"
          style={styles.image}>
          <View style={styles.section}>
            <View style={styles.top}>
              <Text style={styles.text}>Sign Up</Text>
            </View>
            <View style={styles.top}>
              <TextInput
                placeholder="Enter your email address"
                placeholderTextColor={"#ffff"}
                selectionColor={"white"}
                theme={{colors: {text: "#ffff"}}}
                style={styles.inputRegist}
                onChangeText={email => {
                  setInput({...input, email});
                }}></TextInput>
              <TextInput
                placeholder="Enter your password"
                secureTextEntry={viewPassword ? false : true}
                placeholderTextColor={"#ffff"}
                selectionColor={"white"}
                right={
                  <TextInput.Icon
                    color={"#fff"}
                    name={viewPassword ? "eye" : "eye-off"}
                    onPress={() => setViewPass(!viewPassword)}
                  />
                }
                theme={{colors: {text: "#ffff"}}}
                style={styles.inputRegist}
                onChangeText={password => {
                  setInput({...input, password});
                }}></TextInput>
              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor={"#ffff"}
                selectionColor={"white"}
                theme={{colors: {text: "#ffff"}}}
                style={styles.inputRegist}
                onChangeText={phone_number => {
                  setInput({...input, phone_number});
                }}></TextInput>
              <Button buttonStyle={styles.registBtn} onPress={registHandler}>
                <Text style={{color: "white", fontWeight: "700", fontSize: 17}}>
                  {loading ? (
                    <ActivityIndicator color={"#fff"} />
                  ) : (
                    "Create Account"
                  )}
                </Text>
              </Button>
              <Button
                buttonStyle={styles.loginBtn}
                onPress={() => {
                  navigation.navigate("register");
                }}>
                <Text style={{color: "black", fontWeight: "700", fontSize: 17}}>
                  <Image
                    source={require("../../assets/img/google-icon.png")}></Image>
                  &nbsp;Create with Google
                </Text>
              </Button>
            </View>
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  );
};

export default Register;
