import {StyleSheet} from "react-native";

export default StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "white",
    // minHeight: 716,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  section: {
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 0.5,
    marginLeft: 20,
    marginRight: 20,
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
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 70,
    width: "90%",
    marginLeft: 19,
    marginTop: 20,
  },
  registBtn: {
    backgroundColor: "#6A4029",
    borderRadius: 20,
    height: 70,
    width: "90%",
    marginLeft: 19,
    marginTop: 40,
    marginBottom: 50,
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
