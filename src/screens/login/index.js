import {
  View,
  Text,
  ImageBackground,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import {API_URL} from "@env";
import {TextInput} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {Button} from "@rneui/themed";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";

import styles from "./styles";
import {userLogin} from "../../redux/action/userAction";
import {ScrollView} from "react-native-gesture-handler";

const Login = ({navigation}) => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const {token} = useSelector(state => state.persist.userInfo.info);
  const [loading, setLoading] = useState(false);
  const [viewPassword, setViewPass] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      navigation.replace("home");
    }
  }, [token]);
  const loginHandler = () => {
    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const {email, password} = input;
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
    if (!email.match(emailFormat)) {
      ToastAndroid.show(
        "Invalid Email Format",
        ToastAndroid.CENTER,
        ToastAndroid.SHORT,
      );
      return;
    }
    const body = {
      email,
      password,
    };
    setLoading(true);
    axios
      .post(`${API_URL}/auth/login`, body)
      .then(result => {
        setLoading(false);
        dispatch(userLogin(result.data));
        ToastAndroid.show(
          result.data.message,
          ToastAndroid.CENTER,
          ToastAndroid.SHORT,
        );
        navigation.navigate("home");
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
          source={require("../../assets/img/image-40.png")}
          resizeMode="cover"
          style={styles.image}>
          <View style={styles.section}>
            <View style={styles.top}>
              <Text style={styles.text}>Login</Text>
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
              <Text
                style={styles.textSmall}
                onPress={() => navigation.navigate("forgot")}>
                Forgot password?
              </Text>
              <Button buttonStyle={styles.registBtn} onPress={loginHandler}>
                <Text
                  style={{color: "#000000", fontWeight: "700", fontSize: 17}}>
                  {loading ? <ActivityIndicator color={"#000000"} /> : "Login"}
                </Text>
              </Button>

              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  marginTop: 15,
                  fontSize: 16,
                  fontWeight: "700",
                }}>
                or login with
              </Text>

              <Button
                buttonStyle={styles.loginBtn}
                onPress={() => {
                  navigation.navigate("register");
                }}>
                <Text style={{color: "black", fontWeight: "700", fontSize: 17}}>
                  <Image
                    source={require("../../assets/img/google-icon.png")}></Image>
                  &nbsp; Login with Google
                </Text>
              </Button>
            </View>
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  );
};

export default Login;
