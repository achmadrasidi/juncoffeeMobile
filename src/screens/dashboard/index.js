import {View, Text, ActivityIndicator, Dimensions} from "react-native";

import React, {useEffect, useState} from "react";
import {Button} from "@rneui/themed";
import {BarChart, ProgressChart} from "react-native-chart-kit";

import styles from "./styles";
import {ScrollView} from "react-native-gesture-handler";
import {useSelector} from "react-redux";
import axios from "axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);
  const {token} = useSelector(state => state.persist.userInfo.info);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await axios.get(
          `https://juncoffee-api.herokuapp.com/transaction/summary`,
          {headers: {Authorization: `Bearer ${token}`}},
        );
        setLoading(false);
        setSummary(result.data.data);
      } catch (error) {
        console.log(error.response.data);
        setLoading(false);
        console.log(error);
      }
    })();
  }, [token]);
  const data = {
    labels: summary.map(val => val.order_date.split("T")[0].split("-")[2]),
    datasets: [
      {
        data: summary.map(val => val.rev),
      },
    ],
  };
  const progressData = {
    labels: ["performance"], // optional
    data: [0.76],
  };
  const progressChartConf = {
    backgroundGradientFrom: "white",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "white",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 186, 51, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
  };
  const screenWidth = Dimensions.get("window").width;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = new Date().getMonth();
  const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "white",
    backgroundGradientToOpacity: 1,
    color: () => `black`,
    barPercentage: 0.5,
    fillShadowGradientFrom: "#FFBA33",
    fillShadowGradientFromOpacity: 1,
    fillShadowGradientTo: "#FFBA33",
    fillShadowGradientToOpacity: 1,
    barRadius: 10,
  };
  return (
    <ScrollView>
      {loading ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator size={200} color={"#6A4029"} />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={{justifyContent: "center"}}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 26,
                color: "black",
                marginLeft: 20,
                fontWeight: "700",
              }}>
              Daily Report
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                color: "black",
                marginLeft: 20,
                fontWeight: "400",
                marginBottom: 20,
              }}>
              Last 7 Days
            </Text>
            <BarChart
              data={data}
              width={screenWidth}
              height={220}
              yLabelsOffset={0}
              xAxisLabel={` ${monthNames[month]}`}
              chartConfig={chartConfig}
              showBarTops={false}
              withInnerLines={false}
              fromZero={true}
              style={{
                shadowColor: "black",
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 1,
                shadowRadius: 8,
                elevation: 8,
                borderRadius: 10,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 26,
                color: "black",
                marginLeft: 20,
                fontWeight: "700",
                marginTop: 20,
              }}>
              Goals
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "#7C828A",
                fontWeight: "400",
                marginBottom: 20,
              }}>
              Your goals is still on 76%. Keep up the good work!
            </Text>
            <ProgressChart
              data={progressData}
              width={screenWidth}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={progressChartConf}
              hideLegend={true}
              style={{
                shadowColor: "black",
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 1,
                shadowRadius: 8,
                elevation: 8,
                borderRadius: 10,
              }}
            />
          </View>

          <Button buttonStyle={styles.registBtn}>
            <Text style={{color: "white", fontSize: 17, fontWeight: "700"}}>
              Print Report
            </Text>
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default Dashboard;
