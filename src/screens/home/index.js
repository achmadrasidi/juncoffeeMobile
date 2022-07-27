import {API_URL} from "@env";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import {Searchbar, BottomNavigation} from "react-native-paper";
import React, {useState, useRef, useEffect} from "react";
import {useSelector} from "react-redux";
import {Button, ButtonGroup, Card} from "@rneui/themed";
import axios from "axios";
import Carousel, {Pagination} from "react-native-snap-carousel";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";

const HomeRoute = () => {
  <Text>Home</Text>;
};

const ProfileRoute = () => <Text>Profile</Text>;

const HistoryRoute = () => <Text>History</Text>;

const Home = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [filterIndex, setFilterIndex] = useState(0);
  const [filter, setFilter] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [navIndex, setNavIndex] = useState(0);
  const SLIDER_WIDTH = Dimensions.get("window").width + 80;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
  const isCarousel = useRef(null);

  const {role, token} = useSelector(state => state.persist.userInfo.info);

  const [routes] = useState([
    {key: "home", title: "Home", icon: "home"},
    {key: "profile", title: "Profile", icon: "account-details"},
    {key: "history", title: "History", icon: "history"},
  ]);
  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    profile: ProfileRoute,
    history: HistoryRoute,
  });
  let url = `${API_URL}/product?limit=5&`;
  if (filter) {
    if (filter === "favorite") {
      url = `${API_URL}/product/favourite?limit=5`;
    } else {
      url += `category=${filter}&`;
    }
  }
  if (keyword) {
    url += `keyword=${keyword}&`;
  }
  useEffect(() => {
    if (!token) {
      navigation.navigate("auth");
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const result = await axios.get(url);
        setLoading(false);
        setData(result.data.data);
      } catch (err) {
        setLoading(false);
        setError(err.response ? err.response.data.error : err.message);
      }
    })();
  }, [filter, keyword]);

  const _renderItem = ({item, idx}) => {
    return (
      <Card
        key={idx}
        containerStyle={{
          borderRadius: 20,
          marginBottom: 20,
          marginTop: 50,
          alignItems: "center",
        }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("details", {
              productId: item.id,
            })
          }>
          <Image
            source={{uri: item.image}}
            style={{
              width: 200,
              height: 200,
              borderRadius: 20,
              marginTop: -50,
              marginBottom: 10,
            }}
          />
          <Text
            style={{
              marginBottom: 10,
              fontSize: 22,
              fontWeight: "900",
              color: "black",
              textAlign: "center",
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              marginBottom: 10,
              fontSize: 17,
              fontWeight: "700",
              color: "#6A4029",
              textAlign: "center",
            }}>
            IDR {item.price}
          </Text>
        </TouchableOpacity>
      </Card>
    );
  };
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.section}>
            <View>
              <Text style={styles.text}>A good coffee is a good day</Text>
            </View>
            <View style={styles.top}>
              <Searchbar
                placeholder="Search"
                style={{width: "90%", marginLeft: 20, marginTop: 20}}
                onSubmitEditing={e => {
                  setError(null);
                  setKeyword(e.nativeEvent.text);
                }}
              />
              <ButtonGroup
                buttons={["All", "Favorite", "Coffee", "Non-Coffee", "Foods"]}
                containerStyle={{
                  marginTop: 20,
                  borderWidth: 0,
                  borderRightWidth: 0,
                }}
                innerBorderStyle={{width: 0}}
                selectedIndex={filterIndex}
                onPress={selectIndex => {
                  setFilterIndex(selectIndex);
                  setKeyword(null);
                  setError(null);
                  switch (selectIndex) {
                    case 0:
                      setFilter(null);
                      break;
                    case 1:
                      setFilter("favorite");
                      break;
                    case 2:
                      setFilter("coffee");
                      break;
                    case 3:
                      setFilter("non-coffee");
                      break;
                    case 4:
                      setFilter("foods");
                      break;
                    default:
                      break;
                  }
                }}
                selectedButtonStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "#6A4029",
                  borderBottomWidth: 1,
                }}
                selectedTextStyle={{
                  color: "#6A4029",
                  fontSize: 14,
                  fontWeight: "700",
                }}
                textStyle={{
                  color: "#9A9A9D",
                  fontSize: 14,
                  lineHeight: 26,
                }}
              />
              <Text
                style={{
                  textAlign: "right",
                  marginRight: 20,
                  fontSize: 15,
                  color: "#6A4029",
                  fontWeight: "400",
                }}
                onPress={() => navigation.navigate("product")}>
                See more
              </Text>
              {loading ? (
                <ActivityIndicator
                  color="#6A4029"
                  style={{height: 400}}
                  size={100}
                />
              ) : error ? (
                <Text
                  style={{
                    textAlign: "center",
                    marginRight: 20,
                    fontSize: 24,
                    color: "#6A4029",
                    fontWeight: "900",
                    height: 400,
                  }}>
                  {error}
                </Text>
              ) : (
                <>
                  <Carousel
                    ref={isCarousel}
                    renderItem={_renderItem}
                    data={data}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    onSnapToItem={i => setIndex(i)}
                    useScrollView={true}
                  />
                  <Pagination
                    carouselRef={isCarousel}
                    dotsLength={data.length > 1 ? data.length : 2}
                    activeDotIndex={index}
                    dotStyle={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginHorizontal: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.92)",
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    tappableDots={true}
                  />
                  {role === "admin" && (
                    <>
                      <Button
                        buttonStyle={styles.registBtn}
                        onPress={() => navigation.navigate("add-product")}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: 17,
                            fontWeight: "700",
                          }}>
                          Add Product
                        </Text>
                      </Button>
                      <Button
                        buttonStyle={styles.loginBtn}
                        onPress={() => navigation.navigate("add-promo")}>
                        <Text
                          style={{
                            color: "#6A4029",
                            fontSize: 17,
                            fontWeight: "700",
                          }}>
                          Add Promo
                        </Text>
                      </Button>
                    </>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
        <BottomNavigation
          shifting={true}
          navigationState={{index: navIndex, routes}}
          onIndexChange={setNavIndex}
          renderScene={renderScene}
          barStyle={{
            backgroundColor: "white",
          }}
          activeColor={"#6A4029"}
        />
      </ScrollView>
    </>
  );
};

export default Home;
