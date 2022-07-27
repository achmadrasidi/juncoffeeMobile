import React, {useState} from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import {Icon} from "@rneui/themed";
import {Alert, ActivityIndicator} from "react-native";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {userLogout} from "../redux/action/userAction";

const DrawerExpand = props => {
  const [loading, setLoading] = useState(false);
  const {navigation} = props;
  const {token, role} = useSelector(state => state.persist.userInfo.info);
  const dispatch = useDispatch();
  const submitLogout = () => {
    Alert.alert("Confirmation", "Are you sure want to logout ?", [
      {
        text: "Cancel",

        style: "cancel",
      },
      {
        text: "Yes",
        onPress: logoutHandler,
      },
    ]);
  };

  const logoutHandler = () => {
    navigation.closeDrawer();
    setLoading(true);
    axios
      .delete(`https://juncoffee-api.herokuapp.com/auth/logout`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(result => {
        setLoading(false);
        Alert.alert("Success", result.data.message);
        dispatch(userLogout());
        navigation.navigate("auth");
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
    <>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Profile"
          onPress={() => navigation.navigate("profile")}
          labelStyle={{
            color: "white",
            borderBottomWidth: 1,
            borderBottomColor: "white",
            paddingBottom: 5,
            fontSize: 20,
          }}
          icon={() => <Icon name="person" color={"white"}></Icon>}
        />

        <DrawerItem
          label="Coupon"
          onPress={() => navigation.navigate("promo")}
          labelStyle={{
            color: "white",
            borderBottomWidth: 1,
            borderBottomColor: "white",
            paddingBottom: 5,
            fontSize: 20,
          }}
          icon={() => <Icon name="tag-faces" color={"white"}></Icon>}
        />

        <DrawerItem
          label="Orders"
          onPress={() => {
            if (role === "admin") {
              navigation.navigate("order");
              return;
            }
            navigation.navigate("cart");
          }}
          labelStyle={{
            color: "white",
            borderBottomWidth: 1,
            borderBottomColor: "white",
            paddingBottom: 5,
            fontSize: 20,
          }}
          icon={() => <Icon name="shopping-cart" color={"white"}></Icon>}
        />
        {role === "admin" ? (
          <DrawerItem
            label="All menu"
            onPress={() => navigation.navigate("product")}
            labelStyle={{
              color: "white",
              borderBottomWidth: 1,
              borderBottomColor: "white",
              paddingBottom: 5,
              fontSize: 20,
            }}
            icon={() => <Icon name="menu" color={"white"}></Icon>}
          />
        ) : (
          <DrawerItem
            label="History"
            onPress={() => navigation.navigate("history")}
            labelStyle={{
              color: "white",
              borderBottomWidth: 1,
              borderBottomColor: "white",
              paddingBottom: 5,
              fontSize: 20,
            }}
            icon={() => <Icon name="history" color={"white"}></Icon>}
          />
        )}
        {role === "admin" && (
          <DrawerItem
            label="Sales Report"
            onPress={() => navigation.navigate("dashboard")}
            labelStyle={{
              color: "white",
              borderBottomWidth: 1,
              borderBottomColor: "white",
              paddingBottom: 5,
              fontSize: 20,
            }}
            icon={() => <Icon name="report" color={"white"}></Icon>}
          />
        )}
        <DrawerItem
          label="Sign-out"
          onPress={submitLogout}
          labelStyle={{
            color: "white",

            paddingBottom: 5,
            fontSize: 20,
          }}
          icon={() => <Icon name="logout" color={"white"}></Icon>}
          style={{
            marginTop: role === "admin" ? 150 : 220,
          }}
        />
      </DrawerContentScrollView>
      {loading && (
        <ActivityIndicator
          color={"white"}
          size={"large"}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}
    </>
  );
};

export default DrawerExpand;
