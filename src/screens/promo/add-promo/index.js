import {API_URL} from "@env";
import {View, Text, Image, ActivityIndicator, Alert} from "react-native";
import {launchCamera, launchImageLibrary} from "react-native-image-picker";
import React, {useEffect, useState} from "react";
import {Button, ButtonGroup} from "@rneui/themed";
import SelectDropdown from "react-native-select-dropdown";
import DatePicker from "react-native-date-picker";

import axios from "axios";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";
import {useSelector} from "react-redux";

import {TextInput} from "react-native-paper";

const AddPromo = ({navigation}) => {
  const [filterIndex, setFilterIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [imagePrev, setImagePrev] = useState(null);
  const [file, setFile] = useState("");
  const [input, setInput] = useState({
    name: "",
    coupon_code: "",
    discount: "",
    description: "",
    category_id: "",
  });

  const {token} = useSelector(state => state.persist.userInfo.info);
  useEffect(() => {
    (async () => {
      try {
        const result = await axios.get(`${API_URL}/product`);
        setProducts(result.data.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : err.message);
      }
    })();
  }, []);
  const product = products.map(item => item.name);
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
  const saveHandler = () => {
    if (!productName) {
      Alert.alert("Error", "Please Select Product Name !");
      return;
    }
    const product_id = products.find(item => item.name === productName).id;

    const body = {
      ...input,
      product_id,
      expired_date: date.toLocaleDateString("en-GB"),
      photo: file ? file : "",
    };

    const {name, description, coupon_code} = input;
    if (!name) {
      Alert.alert("Error", "Name field is required !");
      return;
    }
    if (!description) {
      Alert.alert("Error", "Description field is required !");
      return;
    }
    if (!coupon_code) {
      Alert.alert("Error", "Coupon Code field is required !");
      return;
    }
    const formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key]);
    }
    setLoading(true);
    axios
      .post(`https://juncoffee-api.herokuapp.com/promo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(result => {
        setLoading(false);

        Alert.alert("Success", result.data.message);
        navigation.navigate("promo");
      })
      .catch(error => {
        setLoading(false);
        Alert.alert(
          "Error",
          error.response ? error.response.data.error : error.message,
        );
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.section}>
          <Image
            source={
              imagePrev
                ? {uri: imagePrev}
                : require("../../../assets/img/photo-camera.png")
            }
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
            color: "black",
          }}>
          Name :
        </Text>
        <TextInput
          style={{
            backgroundColor: "white",
            marginLeft: 40,
            marginRight: 40,
            height: 40,
          }}
          placeholder={"Input the promo name"}
          onChangeText={name => setInput({...input, name})}
        />

        <Text
          style={{
            marginTop: 20,

            marginLeft: 40,
            fontSize: 20,
            fontWeight: "900",
            color: "black",
          }}>
          Coupon Code :
        </Text>
        <TextInput
          placeholder={"Input Coupon Code"}
          style={{
            backgroundColor: "white",
            marginLeft: 40,
            marginRight: 40,
            height: 40,
          }}
          onChangeText={coupon_code => setInput({...input, coupon_code})}
        />
        <Text
          style={{
            marginTop: 20,

            marginLeft: 40,
            fontSize: 20,
            fontWeight: "900",
            color: "black",
          }}>
          Expired Date :
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
            color: "black",
          }}>
          Discount (%) :
        </Text>
        <TextInput
          placeholder={"Input Promo Discount"}
          style={{
            backgroundColor: "white",
            marginLeft: 40,
            marginRight: 40,
            height: 40,
          }}
          onChangeText={discount => setInput({...input, discount})}
        />
        <Text
          style={{
            marginTop: 20,

            marginLeft: 40,
            fontSize: 20,
            fontWeight: "900",
            color: "black",
          }}>
          Description :
        </Text>
        <TextInput
          placeholder={"Describe your promo"}
          style={{
            backgroundColor: "white",
            marginLeft: 40,
            marginRight: 40,
            height: 40,
          }}
          onChangeText={description => setInput({...input, description})}
        />
        <Text
          style={{
            marginTop: 20,

            marginLeft: 40,
            fontSize: 20,
            fontWeight: "900",
            color: "black",
          }}>
          Product Name :
        </Text>
        <SelectDropdown
          data={product}
          onSelect={(selectedItem, _index) => {
            setProductName(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem, _index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, _index) => {
            return item;
          }}
          buttonStyle={{
            width: "80%",
            alignSelf: "center",
            marginTop: 20,
            borderRadius: 10,
          }}
          defaultButtonText={"Select Product Name"}
        />
        <Text
          style={{
            marginTop: 20,

            marginLeft: 40,
            fontSize: 20,
            fontWeight: "900",
            color: "black",
          }}>
          Category :
        </Text>
        <ButtonGroup
          buttons={["Coffee", "Non-Coffee", "Foods"]}
          containerStyle={{
            marginTop: 20,
            backgroundColor: "rgba(186, 186, 186, 0.35);",
            borderRadius: 10,
          }}
          selectedIndex={filterIndex}
          onPress={selectIndex => {
            setFilterIndex(selectIndex);

            switch (selectIndex) {
              case 0:
                setInput({...input, category_id: 2});
                break;
              case 1:
                setInput({...input, category_id: 4});
                break;
              case 2:
                setInput({...input, category_id: 1});
                break;

              default:
                break;
            }
          }}
          selectedButtonStyle={{
            backgroundColor: "#FFBA33",
          }}
          selectedTextStyle={{
            color: "#6A4029",
            fontSize: 14,
            fontWeight: "700",
          }}
          textStyle={{
            color: "#4F5665",
            fontSize: 14,
            lineHeight: 26,
            fontWeight: "700",
          }}
        />

        <Button buttonStyle={styles.registBtn} onPress={saveHandler}>
          <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
            {loading ? <ActivityIndicator color={"white"} /> : "Save Promo"}
          </Text>
        </Button>
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

export default AddPromo;
