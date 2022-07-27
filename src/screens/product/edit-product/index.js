import {View, Text, Image, ActivityIndicator, Alert} from "react-native";
import {launchCamera, launchImageLibrary} from "react-native-image-picker";
import React, {useEffect, useState} from "react";
import {Button, ButtonGroup} from "@rneui/themed";

import axios from "axios";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";
import {useSelector} from "react-redux";

import {TextInput} from "react-native-paper";

const EditProduct = ({route, navigation}) => {
  const [product, setProduct] = useState({});
  const [filterIndex, setFilterIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imagePrev, setImagePrev] = useState(null);
  const [file, setFile] = useState("");
  const [input, setInput] = useState({
    name: "",
    price: "",
    delivery_info: "",
    description: "",
    category_id: "",
  });
  const {productId} = route.params;

  const {token} = useSelector(state => state.persist.userInfo.info);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `https://juncoffee-api.herokuapp.com/product/detail/${productId}`,
        );
        setLoading(false);
        const {data} = result.data;
        const {category} = data;
        switch (category) {
          case "Foods":
            setFilterIndex(2);
            break;
          case "non-coffee":
            setFilterIndex(1);
            break;
          case "Coffee":
            setFilterIndex(0);
            break;
          default:
            break;
        }
        setProduct(data);
      } catch (error) {
        setLoading(true);
        console.log(error.response ? error.response.data.error : error.message);
      }
    })();
  }, [productId]);
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
    };

    const formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key]);
    }
    setLoading(true);
    axios
      .patch(
        `https://juncoffee-api.herokuapp.com/product/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then(result => {
        setLoading(false);

        Alert.alert("Success", result.data.message);
        navigation.navigate("details", {
          productId: result.data.data.id,
          update: true,
        });
      })
      .catch(error => {
        setLoading(false);
        Alert.alert(
          "Error",
          error.response ? error.response.data.error : error.message,
        );
      });
  };
  const productImage = product.image
    ? {uri: product.image}
    : require("../../../assets/img/photo-camera.png");
  return (
    <ScrollView>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator color={"#6A4029"} size={200} />
        ) : (
          <>
            <View style={styles.section}>
              <Image
                source={imagePrev ? {uri: imagePrev} : productImage}
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
              defaultValue={product.name}
              style={{
                backgroundColor: "white",
                marginLeft: 40,
                marginRight: 40,
                height: 40,
              }}
              placeholder={"Input the product name"}
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
              Price :
            </Text>
            <TextInput
              defaultValue={product.price && product.price.toString()}
              placeholder={"Input the product price"}
              style={{
                backgroundColor: "white",
                marginLeft: 40,
                marginRight: 40,
                height: 40,
              }}
              onChangeText={price => setInput({...input, price})}
            />
            <Text
              style={{
                marginTop: 20,

                marginLeft: 40,
                fontSize: 20,
                fontWeight: "900",
                color: "black",
              }}>
              Delivery Info :
            </Text>
            <TextInput
              defaultValue={product.delivery_info}
              placeholder={"Type delivery information"}
              style={{
                backgroundColor: "white",
                marginLeft: 40,
                marginRight: 40,
                height: 40,
              }}
              onChangeText={delivery_info =>
                setInput({...input, delivery_info})
              }
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
              defaultValue={product.description}
              placeholder={"Describe your product"}
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

            <Button buttonStyle={styles.registBtn} onPress={updateHandler}>
              <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
                {loading ? (
                  <ActivityIndicator color={"white"} />
                ) : (
                  "Edit Product"
                )}
              </Text>
            </Button>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default EditProduct;
