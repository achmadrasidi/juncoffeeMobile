import {
  View,
  Text,
  ImageBackground,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from "react-native";
import {TextInput} from "react-native-paper";
import React, {useState} from "react";
import {Button} from "@rneui/themed";
import axios from "axios";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";

const Forgot = ({navigation}) => {
  let [input, setInput] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputOtp, setInputOtp] = useState(false);
  const [resetPass, setResetPass] = useState(false);
  const [viewPassword, setViewPass] = useState({
    new: false,
    confirm: false,
  });

  const resetHandler = () => {
    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const {email} = input;
    if (!email) {
      ToastAndroid.show(
        "Email Field is Required",
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
    setLoading(true);
    axios
      .get(`https://juncoffee-api.herokuapp.com/user/forgot-password/${email}`)
      .then(result => {
        setLoading(false);
        Alert.alert("Success!", result.data.message, [
          {
            onPress: () => {
              setInputOtp(true);
              setInputText("");
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

  const verifyHandler = () => {
    const {otp} = input;
    setLoading(true);
    axios
      .get(`https://juncoffee-api.herokuapp.com/user/verify-forgot/${otp}`)
      .then(result => {
        setLoading(false);
        Alert.alert("Success!", result.data.message, [
          {
            onPress: () => {
              setInputOtp(false);
              setResetPass(true);
              setInputText("");
            },
          },
        ]);
      })
      .catch(err => {
        setLoading(false);
        ToastAndroid.show(
          err.response ? err.response.data.error : err.message,
          ToastAndroid.TOP,
          ToastAndroid.SHORT,
        );
      });
  };

  const editHandler = () => {
    const {newPassword, confirmPassword, email} = input;
    if (newPassword !== confirmPassword) {
      ToastAndroid.show(
        "Password Not Match",
        ToastAndroid.TOP,
        ToastAndroid.SHORT,
      );
      return;
    }
    const body = {
      email,
      newPassword,
    };
    setLoading(true);
    axios
      .patch(`https://juncoffee-api.herokuapp.com/user/forgot-password/`, body)
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
          ToastAndroid.BOTTOM,
          ToastAndroid.SHORT,
        );
      });
  };

  return (
    <ScrollView>
      {inputOtp ? (
        <View style={styles.container}>
          <ImageBackground
            source={require("../../assets/img/image-41.png")}
            resizeMode="cover"
            style={styles.image}>
            <View style={styles.section}>
              <View style={styles.top}>
                <Text style={styles.text}>Don't Worry!</Text>

                <Text style={styles.textSmall}>
                  Enter your OTP Code we've send to your email
                </Text>
              </View>
              <View style={styles.top}>
                <TextInput
                  placeholder="Enter your OTP Code"
                  placeholderTextColor={"#ffff"}
                  selectionColor={"white"}
                  clearTextOnFocus={true}
                  value={inputText}
                  theme={{colors: {text: "#ffff"}}}
                  style={styles.inputRegist}
                  onChangeText={otp => {
                    setInput({...input, otp});
                    setInputText(otp);
                  }}></TextInput>

                <Button buttonStyle={styles.registBtn} onPress={verifyHandler}>
                  <Text
                    style={{color: "black", fontWeight: "700", fontSize: 17}}>
                    {loading ? (
                      <ActivityIndicator color={"black"} />
                    ) : (
                      "Verify Code"
                    )}
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
                  Haven't received any link?
                </Text>
                <Button
                  buttonStyle={styles.loginBtn}
                  onPress={() => setInputOtp(false)}>
                  <Text
                    style={{color: "white", fontWeight: "700", fontSize: 17}}>
                    Resend Link
                  </Text>
                </Button>
              </View>
            </View>
          </ImageBackground>
        </View>
      ) : resetPass ? (
        <View style={styles.container}>
          <ImageBackground
            source={require("../../assets/img/image-41.png")}
            resizeMode="cover"
            style={styles.image}>
            <View style={styles.section}>
              <View style={styles.top}>
                <Text style={styles.text}>Don't Worry!</Text>
                <Text style={styles.textSmall}>
                  Enter your new password to change your old password
                </Text>
              </View>
              <View style={styles.top}>
                <TextInput
                  value={input.newPassword}
                  placeholder="Enter your new password"
                  placeholderTextColor={"#ffff"}
                  selectionColor={"white"}
                  secureTextEntry={viewPassword.new ? false : true}
                  right={
                    <TextInput.Icon
                      color={"#fff"}
                      name={viewPassword.new ? "eye" : "eye-off"}
                      onPress={() =>
                        setViewPass({...viewPassword, new: !viewPassword.new})
                      }
                    />
                  }
                  theme={{colors: {text: "#ffff"}}}
                  style={styles.inputRegist}
                  onChangeText={newPassword => {
                    setInput({...input, newPassword});
                  }}></TextInput>

                <TextInput
                  value={input.confirmPassword}
                  placeholder="Confirm your new password"
                  placeholderTextColor={"#ffff"}
                  selectionColor={"white"}
                  secureTextEntry={viewPassword.confirm ? false : true}
                  right={
                    <TextInput.Icon
                      color={"#fff"}
                      name={viewPassword.confirm ? "eye" : "eye-off"}
                      onPress={() =>
                        setViewPass({
                          ...viewPassword,
                          confirm: !viewPassword.confirm,
                        })
                      }
                    />
                  }
                  theme={{colors: {text: "#ffff"}}}
                  style={styles.inputRegist}
                  onChangeText={confirmPassword => {
                    setInput({...input, confirmPassword});
                  }}></TextInput>

                <Button buttonStyle={styles.registBtn} onPress={editHandler}>
                  <Text
                    style={{color: "black", fontWeight: "700", fontSize: 17}}>
                    {loading ? (
                      <ActivityIndicator color={"black"} />
                    ) : (
                      "Set New Password"
                    )}
                  </Text>
                </Button>
              </View>
            </View>
          </ImageBackground>
        </View>
      ) : (
        <View style={styles.container}>
          <ImageBackground
            source={require("../../assets/img/image-41.png")}
            resizeMode="cover"
            style={styles.image}>
            <View style={styles.section}>
              <View style={styles.top}>
                <Text style={styles.text}>Don't Worry!</Text>
                <Text style={styles.textSmall}>
                  Enter your email adress to get reset password link
                </Text>
              </View>
              <View style={styles.top}>
                <TextInput
                  value={inputText}
                  placeholder="Enter your email address"
                  placeholderTextColor={"#ffff"}
                  selectionColor={"white"}
                  theme={{colors: {text: "#ffff"}}}
                  style={styles.inputRegist}
                  onChangeText={email => {
                    setInput({...input, email});
                    setInputText(email);
                  }}></TextInput>

                <Button buttonStyle={styles.registBtn} onPress={resetHandler}>
                  <Text
                    style={{color: "black", fontWeight: "700", fontSize: 17}}>
                    {loading ? <ActivityIndicator color={"black"} /> : "Send"}
                  </Text>
                </Button>
              </View>
            </View>
          </ImageBackground>
        </View>
      )}
    </ScrollView>
  );
};

export default Forgot;
