import {API_URL} from "@env";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";

import {Searchbar} from "react-native-paper";
import React, {useState, useEffect} from "react";
import {Button, Card, CheckBox} from "@rneui/themed";
import axios from "axios";

import styles from "./styles";
import {FlatList} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import {useSelector} from "react-redux";

const Product = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);
  const [filterItem, setFilterItem] = useState(false);
  const [sort, setSort] = useState("date");
  const [order, setOrder] = useState("asc");
  const [keyword, setKeyword] = useState(null);
  const [limit, setLimit] = useState(4);
  const [total, setTotal] = useState(1);

  const {role} = useSelector(state => state.persist.userInfo.info);

  let url = `${API_URL}/product?limit=${limit}&order=${order}&sort=${sort}&`;
  if (filter) {
    url += `category=${filter}&`;
  }
  if (keyword) {
    url += `keyword=${keyword}&`;
  }
  useEffect(() => {
    (async () => {
      setLoading(true);
      setShowModal(false);
      setFilterItem(false);
      try {
        const result = await axios.get(url);

        setLoading(false);

        setTotal(result.data.meta.totalProduct);
        setData(result.data.data);
      } catch (err) {
        setLoading(false);
        setData([]);
        setError(err.response ? err.response.data.error : err.message);
      }
    })();
  }, [filterItem, keyword]);

  useEffect(() => {
    (async () => {
      setLoadMore(true);
      try {
        const result = await axios.get(url);

        setLoadMore(false);
        setTotal(result.data.meta.totalProduct);
        setData(result.data.data);
      } catch (err) {
        setLoadMore(false);
        setError(err.response ? err.response.data.error : err.message);
      }
    })();
  }, [limit]);

  const _renderItem = ({item, idx}) => {
    return (
      <Card
        key={idx}
        containerStyle={{
          borderRadius: 20,
          marginBottom: 20,
          marginTop: 50,
          alignItems: "center",
          width: 165,
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
              fontSize: 16,
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
        {role === "admin" && (
          <Button
            buttonStyle={{
              width: 125,
              marginLeft: 40,
              borderRadius: 20,
              backgroundColor: "#6A4029",
            }}
            onPress={() =>
              navigation.navigate("edit-product", {productId: item.id})
            }>
            <Text style={{color: "white", fontSize: 14, fontWeight: "700"}}>
              Edit Product
            </Text>
          </Button>
        )}
      </Card>
    );
  };
  const _renderEmpty = () => {
    return (
      <View
        Style={{
          height: 400,
          marginTop: 20,
        }}>
        <Text
          style={{
            textAlign: "center",
            marginRight: 20,
            fontSize: 24,
            color: "#6A4029",
            fontWeight: "900",
          }}>
          {error}
        </Text>
        <Button
          buttonStyle={{
            borderRadius: 10,
            padding: 10,
            elevation: 2,
            backgroundColor: "grey",
            marginTop: 10,
            width: "80%",
            marginLeft: 40,
          }}
          onPress={() => {
            setKeyword(null);
            setOrder("asc");
            setSort("date");
            setLimit(4);
            setFilter(null);
            setFilterItem(true);
          }}>
          <Text
            style={{
              color: "white",
              fontSize: 17,
              fontWeight: "700",
              textAlign: "center",
            }}>
            {loading ? <ActivityIndicator color="white" /> : "Reset"}
          </Text>
        </Button>
      </View>
    );
  };
  const _renderFooter = () => {
    return (
      <View>
        {loadMore && <ActivityIndicator size={50} color="#6A4029" />}
        {data.length === total && (
          <Text style={{textAlign: "center", marginBottom: 20, fontSize: 20}}>
            No more Product
          </Text>
        )}
      </View>
    );
  };
  const _renderHeader = () => {
    return (
      <>
        <View style={styles.top}>
          <Searchbar
            placeholder="Search"
            style={{width: "90%", marginLeft: 20, marginTop: 10}}
            onSubmitEditing={e => {
              setError(null);
              setLimit(4);
              setKeyword(e.nativeEvent.text);
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
              marginRight: 20,
              marginTop: 10,
              alignItems: "center",
            }}>
            <Text
              style={{fontSize: 20, fontWeight: "900", color: "black"}}
              onPress={() => setShowModal(true)}>
              Filter
            </Text>
          </View>
        </View>
      </>
    );
  };
  const moreData = () => {
    if (data.length !== total) {
      setLimit(limit + 4);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator color="#6A4029" style={{height: 400}} size={100} />
        ) : (
          <FlatList
            ListEmptyComponent={_renderEmpty}
            ListHeaderComponent={_renderHeader}
            data={data}
            renderItem={_renderItem}
            onEndReached={moreData}
            ListFooterComponent={_renderFooter}
            numColumns={2}
            stickyHeaderIndices={[0]}
          />
        )}
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Filter Products</Text>
            <Text style={{fontSize: 20, fontWeight: "700"}}>Category:</Text>
            <View style={{flexDirection: "row"}}>
              <CheckBox
                title={"Coffee"}
                checkedIcon={"dot-circle-o"}
                uncheckedIcon={"circle-o"}
                textStyle={{fontSize: 16, color: "black", fontWeight: "400"}}
                checkedColor={"#6A4029"}
                onPress={() => setFilter("coffee")}
                checked={filter === "coffee" ? true : false}
              />
              <CheckBox
                title={"Non-Coffee"}
                checkedIcon={"dot-circle-o"}
                uncheckedIcon={"circle-o"}
                textStyle={{fontSize: 16, color: "black", fontWeight: "400"}}
                checkedColor={"#6A4029"}
                onPress={() => setFilter("non-coffee")}
                checked={filter === "non-coffee" ? true : false}
              />
            </View>

            <CheckBox
              title={"Foods"}
              checkedIcon={"dot-circle-o"}
              uncheckedIcon={"circle-o"}
              textStyle={{fontSize: 16, color: "black", fontWeight: "400"}}
              checkedColor={"#6A4029"}
              onPress={() => setFilter("foods")}
              checked={filter === "foods" ? true : false}
            />

            <View style={{flexDirection: "row"}}></View>
            <Text style={{fontSize: 20, fontWeight: "700"}}>Sort By:</Text>

            <View style={{flexDirection: "row"}}>
              <CheckBox
                title={"Name"}
                checkedIcon={"dot-circle-o"}
                uncheckedIcon={"circle-o"}
                textStyle={{fontSize: 16, color: "black", fontWeight: "400"}}
                checkedColor={"#6A4029"}
                onPress={() => setSort("name")}
                checked={sort === "name" ? true : false}
              />
              <CheckBox
                title={"Price"}
                checkedIcon={"dot-circle-o"}
                uncheckedIcon={"circle-o"}
                textStyle={{fontSize: 16, color: "black", fontWeight: "400"}}
                checkedColor={"#6A4029"}
                onPress={() => setSort("price")}
                checked={sort === "price" ? true : false}
              />
            </View>
            <CheckBox
              title={"Date"}
              checkedIcon={"dot-circle-o"}
              uncheckedIcon={"circle-o"}
              textStyle={{fontSize: 16, color: "black", fontWeight: "400"}}
              checkedColor={"#6A4029"}
              onPress={() => setSort("date")}
              checked={sort === "date" ? true : false}
            />
            <Text style={{fontSize: 20, fontWeight: "700"}}>Order:</Text>
            <View style={{flexDirection: "row"}}>
              <CheckBox
                title={"ASC"}
                checkedIcon={"dot-circle-o"}
                uncheckedIcon={"circle-o"}
                textStyle={{fontSize: 16, color: "black", fontWeight: "400"}}
                checkedColor={"#6A4029"}
                onPress={() => setOrder("asc")}
                checked={order === "asc" ? true : false}
              />
              <CheckBox
                title={"DESC"}
                checkedIcon={"dot-circle-o"}
                uncheckedIcon={"circle-o"}
                textStyle={{fontSize: 16, color: "black", fontWeight: "400"}}
                checkedColor={"#6A4029"}
                onPress={() => setOrder("desc")}
                checked={order === "desc" ? true : false}
              />
            </View>
            <Button
              buttonStyle={styles.button}
              onPress={() => {
                setLimit(4);
                setKeyword(null);
                setFilterItem(true);
              }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 17,
                  fontWeight: "700",
                  textAlign: "center",
                }}>
                {loading ? <ActivityIndicator color="white" /> : "Filter"}
              </Text>
            </Button>
            <Button
              buttonStyle={styles.buttonReset}
              onPress={() => {
                console.log();
                setKeyword(null);
                setOrder("asc");
                setSort("date");
                setLimit(4);
                setFilter(null);
                setFilterItem(true);
              }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 17,
                  fontWeight: "700",
                  textAlign: "center",
                }}>
                {loading ? <ActivityIndicator color="white" /> : "Reset"}
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Product;
