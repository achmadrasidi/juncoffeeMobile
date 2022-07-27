import React, {useEffect} from "react";
import {StatusBar, Alert} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import SplashScreen from "react-native-splash-screen";

import {Icon} from "@rneui/themed";
import Auth from "./screens/auth";
import Register from "./screens/register";
import Login from "./screens/login";
import Welcome from "./screens/welcome";
import Profile from "./screens/profile";
import Forgot from "./screens/forgot";
import Home from "./screens/home";
import Details from "./screens/details";
import Cart from "./screens/cart";
import Delivery from "./screens/delivery";
import Payment from "./screens/payment";
import {useSelector} from "react-redux";
import DrawerExpand from "./component/DrawerExpand";
import EditProfile from "./screens/edit-profile";
import History from "./screens/history";
import Product from "./screens/product";
import AddProduct from "./screens/product/add-product";
import AddPromo from "./screens/promo/add-promo";
import Promo from "./screens/promo";
import Order from "./screens/order";
import Dashboard from "./screens/dashboard";
import EditProduct from "./screens/product/edit-product";
import EditPromo from "./screens/promo/edit-promo";

const Drawer = () => {
  const {Navigator, Screen} = createDrawerNavigator();
  const {role} = useSelector(state => state.persist.userInfo.info);

  return (
    <Navigator
      useLegacyImplementation={true}
      screenOptions={{
        title: "Juncoffee",
        drawerStyle: {
          backgroundColor: "#6A4029",
          paddingTop: 150,
        },
        drawerLabelStyle: {
          color: "white",
          borderBottomWidth: 1,
          borderBottomColor: "white",
          paddingBottom: 5,
          fontSize: 20,
        },

        drawerIcon: () => <Icon name="home" color={"white"}></Icon>,
        drawerActiveBackgroundColor: "gray",
      }}
      drawerContent={props => <DrawerExpand {...props} />}
      initialRouteName="main">
      <Screen
        name="main"
        component={Home}
        options={({navigation}) => ({
          headerTitle: "Juncoffee",
          headerRight: () => (
            <Icon
              style={{marginRight: 20}}
              name="shopping-cart"
              onPress={() => {
                if (role === "admin") {
                  navigation.navigate("order");
                  return;
                }
                navigation.navigate("cart");
              }}
            />
          ),
          headerTitleAlign: "center",
          swipeEnabled: false,
        })}
      />
    </Navigator>
  );
};

const Router = () => {
  const {Navigator, Screen} = createStackNavigator();
  const {token, role} = useSelector(state => state.persist.userInfo.info);

  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <Navigator
        initialRouteName={token ? "home" : "welcome"}
        screenOptions={{
          title: "Home",
        }}>
        <Screen name="home" component={Drawer} options={{headerShown: false}} />
        <Screen
          name="profile"
          component={Profile}
          options={{
            headerTitle: "My Profile",
            headerTitleAlign: "center",
          }}
        />
        <Screen
          name="product"
          component={Product}
          options={({navigation}) => ({
            headerTitle: "All Products",
            headerTitleAlign: "center",
            headerRight: () =>
              role === "admin" && (
                <Icon
                  style={{marginRight: 20}}
                  name="add"
                  onPress={() => {
                    navigation.navigate("add-product");
                  }}
                />
              ),
          })}
        />
        <Screen
          name="add-product"
          component={AddProduct}
          options={({navigation}) => ({
            headerTitle: "New Product",
            headerTitleAlign: "center",
            headerRight: () => (
              <Icon
                style={{marginRight: 20}}
                name="delete"
                onPress={() => {
                  Alert.alert("Warning", "Discard All changes ?", [
                    {
                      text: "Cancel",

                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        navigation.replace("add-product");
                      },
                    },
                  ]);
                }}
              />
            ),
          })}
        />
        <Screen
          name="edit-product"
          component={EditProduct}
          options={({navigation}) => ({
            headerTitle: "Edit Product",
            headerTitleAlign: "center",
            headerRight: () => (
              <Icon
                style={{marginRight: 20}}
                name="delete"
                onPress={() => {
                  Alert.alert("Warning", "Discard All changes ?", [
                    {
                      text: "Cancel",

                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        navigation.replace("edit-product");
                      },
                    },
                  ]);
                }}
              />
            ),
          })}
        />
        <Screen
          name="promo"
          component={Promo}
          options={() => ({
            headerTitle: "My Coupons",
            headerTitleAlign: "center",
          })}
        />
        <Screen
          name="add-promo"
          component={AddPromo}
          options={({navigation}) => ({
            headerTitle: "New Promo",
            headerTitleAlign: "center",
            headerRight: () => (
              <Icon
                style={{marginRight: 20}}
                name="delete"
                onPress={() => {
                  Alert.alert("Warning", "Discard All changes ?", [
                    {
                      text: "Cancel",

                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        navigation.replace("add-promo");
                      },
                    },
                  ]);
                }}
              />
            ),
          })}
        />
        <Screen
          name="edit-promo"
          component={EditPromo}
          options={({navigation}) => ({
            headerTitle: "Edit Promo",
            headerTitleAlign: "center",
            headerRight: () => (
              <Icon
                style={{marginRight: 20}}
                name="delete"
                onPress={() => {
                  console.log();
                  Alert.alert("Warning", "Discard All changes ?", [
                    {
                      text: "Cancel",

                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        navigation.replace("add-promo");
                      },
                    },
                  ]);
                }}
              />
            ),
          })}
        />
        <Screen
          name="edit-profile"
          component={EditProfile}
          options={{
            headerTitle: "Edit Profile",
            headerTitleAlign: "center",
          }}
        />
        <Screen
          name="auth"
          component={Auth}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="register"
          component={Register}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="welcome"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="forgot"
          component={Forgot}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="details"
          component={Details}
          options={({navigation}) => ({
            headerRight: () => (
              <Icon
                style={{marginRight: 20}}
                name="shopping-cart"
                onPress={() => {
                  console.log(role);
                  if (role === "admin") {
                    navigation.navigate("order");
                    return;
                  }
                  navigation.navigate("cart");
                }}
              />
            ),
            title: "Details",
            headerTitleAlign: "center",
          })}
        />
        <Screen
          name="cart"
          component={Cart}
          options={{
            headerTitle: "Cart",
            headerTitleAlign: "center",
          }}
        />
        <Screen
          name="delivery"
          component={Delivery}
          options={{
            headerTitle: "Checkout",
            headerTitleAlign: "center",
          }}
        />
        <Screen
          name="payment"
          component={Payment}
          options={{
            headerTitle: "Payment",
            headerTitleAlign: "center",
          }}
        />
        <Screen
          name="history"
          component={History}
          options={{
            headerTitle: "Order History",
            headerTitleAlign: "center",
          }}
        />
        <Screen
          name="order"
          component={Order}
          options={{
            headerTitle: "Customer Order",
            headerTitleAlign: "center",
          }}
        />
        <Screen
          name="dashboard"
          component={Dashboard}
          options={{
            headerTitle: "Sales Chart",
            headerTitleAlign: "center",
          }}
        />
      </Navigator>
    </>
  );
};

export default Router;
