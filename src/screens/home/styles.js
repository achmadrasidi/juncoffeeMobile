import {StyleSheet} from "react-native";

export default StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  top: {
    flexDirection: "column",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  section: {
    backgroundColor: "white",
    justifyContent: "space-around",
  },
  text: {
    marginTop: 20,
    marginBottom: 10,
    color: "black",
    fontSize: 40,
    lineHeight: 40,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "poppins",
  },
  textSmall: {
    color: "white",
    fontSize: 14,
    lineHeight: 26,
    fontWeight: "700",
    fontFamily: "poppins",
    marginLeft: 20,
  },
  loginBtn: {
    backgroundColor: "#FFBA33",
    borderRadius: 20,
    height: 70,
    width: "90%",
    marginLeft: 19,
    marginTop: 10,
    marginBottom: 20,
  },
  registBtn: {
    backgroundColor: "#6A4029",
    borderRadius: 20,
    height: 70,
    width: "90%",
    marginLeft: 19,
    marginBottom: 10,
  },
  inputRegist: {
    backgroundColor: "transparent",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    color: "#ffff",
    fontWeight: "700",
    fontSize: 14,
    margin: 20,
  },
});
