import {StyleSheet} from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  section: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: 800,
    justifyContent: "space-around",
  },
  text: {
    color: "white",
    fontSize: 65,
    lineHeight: 84,
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
    textAlign: "center",
  },
  loginBtn: {
    backgroundColor: "#6A4029",
    borderRadius: 20,
    height: 70,
    width: "90%",
    marginLeft: 19,
    marginTop: 20,
  },
  registBtn: {
    backgroundColor: "#FFBA33",
    borderRadius: 20,
    height: 70,
    width: "90%",
    marginLeft: 19,
    marginTop: 40,
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
