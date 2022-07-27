import {View, Text, Image, ActivityIndicator, Alert} from "react-native";
import {launchCamera, launchImageLibrary} from "react-native-image-picker";
import React, {useState, useMemo} from "react";
import {Button, Card, CheckBox, Icon, ListItem} from "@rneui/themed";
import DatePicker from "react-native-date-picker";
import axios from "axios";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";
import {useDispatch, useSelector} from "react-redux";

import {TextInput} from "react-native-paper";
import {userUpdate} from "../../redux/action/userAction";

const EditProfile = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [imagePrev, setImagePrev] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [file, setFile] = useState("");
  const [input, setInput] = useState({
    name: "",
    phone_number: "",
    address: "",
  });
  const {user} = route.params;
  const dispatch = useDispatch();
  useMemo(() => {
    const {gender, date_of_birth} = user;

    if (gender) {
      setChecked(gender);
    }
    if (date_of_birth) {
      const day = date_of_birth.split("-")[0];
      const month = date_of_birth.split("-")[1];
      const year = date_of_birth.split("-")[2];
      const dateFormat = `${month}/${day}/${year}`;
      const newDate = new Date(dateFormat);

      setDate(newDate);
    }
  }, [user.gender, user.date_of_birth]);

  const {token} = useSelector(state => state.persist.userInfo.info);
  const handleGallery = async () => {
    setImagePrev(null);
    try {
      const result = await launchImageLibrary();

      const {fileName, uri, fileSize, type} = result.assets[0];
      const imageFile = {
        name: fileName,
        uri,
        size: fileSize,
        type,
      };
      setFile(imageFile);
      setImagePrev(uri);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePhoto = async () => {
    setImagePrev(null);
    try {
      const result = await launchCamera();
      const {fileName, uri, fileSize, type} = result.assets[0];
      const imageFile = {
        name: fileName,
        uri,
        size: fileSize,
        type,
      };
      setFile(imageFile);
      setImagePrev(uri);
    } catch (error) {
      console.log(error);
    }
  };
  const updateHandler = () => {
    const body = {
      ...input,
      photo: file ? file : "",
      gender: checked,
      date_of_birth: date.toLocaleDateString("en-GB"),
    };
    const phoneFormat = /^\d{12}$/;
    const {phone_number} = input;

    if (phone_number && !phone_number.match(phoneFormat)) {
      Alert.alert("Error", "Invalid Phone Format");
      return;
    }
    const formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key]);
    }
    setLoading(true);
    axios
      .patch(
        `https://juncoffee-api.herokuapp.com/user/edit-profile/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then(result => {
        const {address} = input;
        const update = {
          image: imagePrev,
          address: !address ? user.address : address,
          phone_number,
        };
        setLoading(false);
        dispatch(userUpdate(update));
        Alert.alert("Success", result.data.message);
        navigation.navigate("profile", {updateProfile: ""});
      })
      .catch(error => {
        setLoading(false);
        Alert.alert(
          "Error",
          error.response ? error.response.data.error : error.message,
        );
      });
  };
  const profileImage = user.image
    ? {uri: user.image}
    : require("../../assets/img/default-img.webp");
  return (
    <ScrollView>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator color={"#6A4029"} size={200} />
        ) : (
          <>
            <View style={styles.section}>
              <Image
                source={imagePrev ? {uri: imagePrev} : profileImage}
                style={{
                  width: 200,
                  height: 200,
                  marginTop: 20,
                  borderRadius: 100,
                }}
              />
              <Text
                style={{
                  marginTop: 20,

                  fontSize: 20,
                  fontWeight: "900",
                  color: "#6A4029",
                }}
                onPress={handleGallery}>
                Choose From Gallery
              </Text>
              <Text
                style={{
                  marginTop: 5,

                  fontSize: 20,
                  fontWeight: "900",
                  color: "#6A4029",
                }}
                onPress={handlePhoto}>
                Take a Photo
              </Text>
            </View>
            <Text
              style={{
                marginTop: 20,

                marginLeft: 40,
                fontSize: 20,
                fontWeight: "900",
                color: "#9F9F9F",
              }}>
              Name :
            </Text>
            <TextInput
              onChangeText={name => setInput({...input, name})}
              defaultValue={user.name ? user.name : "John"}
              style={{
                backgroundColor: "white",
                marginLeft: 40,
                marginRight: 40,
                height: 40,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
              }}>
              <CheckBox
                title={"Female"}
                checkedIcon={"dot-circle-o"}
                uncheckedIcon={"dot-circle-o"}
                textStyle={{
                  fontSize: 20,
                  color: checked === "female" ? "black" : "#9F9F9F",
                  fontWeight: "400",
                }}
                containerStyle={{marginLeft: 30}}
                uncheckedColor={"#9F9F9F"}
                checkedColor={"#6A4029"}
                checked={checked === "female" ? true : false}
                onPress={() => setChecked("female")}
              />
              <CheckBox
                title={"Male"}
                checkedIcon={"dot-circle-o"}
                uncheckedIcon={"dot-circle-o"}
                textStyle={{
                  fontSize: 20,
                  color: checked === "male" ? "black" : "#9F9F9F",
                  fontWeight: "400",
                }}
                containerStyle={{marginLeft: 30}}
                uncheckedColor={"#9F9F9F"}
                checkedColor={"#6A4029"}
                checked={checked === "male" ? true : false}
                onPress={() => setChecked("male")}
              />
            </View>
            <Text
              style={{
                marginTop: 20,

                marginLeft: 40,
                fontSize: 20,
                fontWeight: "900",
                color: "#9F9F9F",
              }}>
              Email Address :
            </Text>
            <TextInput
              disabled
              defaultValue={user.email}
              style={{
                backgroundColor: "white",
                marginLeft: 40,
                marginRight: 40,
                height: 40,
              }}
            />
            <Text
              style={{
                marginTop: 20,

                marginLeft: 40,
                fontSize: 20,
                fontWeight: "900",
                color: "#9F9F9F",
              }}>
              Phone Number :
            </Text>
            <TextInput
              onChangeText={phone => setInput({...input, phone_number: phone})}
              defaultValue={user.phone_number}
              style={{
                backgroundColor: "white",
                marginLeft: 40,
                marginRight: 40,
                height: 40,
              }}
            />
            <Text
              style={{
                marginTop: 20,

                marginLeft: 40,
                fontSize: 20,
                fontWeight: "900",
                color: "#9F9F9F",
              }}>
              Date of Birth :
            </Text>
            <TextInput
              value={date.toLocaleDateString("en-GB")}
              right={
                <TextInput.Icon
                  forceTextInputFocus={false}
                  color={"#9F9F9F"}
                  name={"calendar"}
                  onPress={() => setOpenDate(true)}
                />
              }
              editable={false}
              style={{
                backgroundColor: "white",
                marginLeft: 40,
                marginRight: 40,
                height: 40,
              }}
            />
            <Text
              style={{
                marginTop: 20,

                marginLeft: 40,
                fontSize: 20,
                fontWeight: "900",
                color: "#9F9F9F",
              }}>
              Delivery Address :
            </Text>
            <TextInput
              onChangeText={address => setInput({...input, address})}
              defaultValue={user.address}
              multiline={true}
              style={{
                backgroundColor: "white",
                marginLeft: 40,
                marginRight: 40,
              }}
            />

            <Button buttonStyle={styles.registBtn} onPress={updateHandler}>
              <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
                Save and Update
              </Text>
            </Button>
          </>
        )}
        <DatePicker
          modal
          open={openDate}
          date={date}
          mode={"date"}
          onConfirm={d => {
            setOpenDate(false);
            setDate(d);
          }}
          onCancel={() => {
            setOpenDate(false);
          }}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfile;
