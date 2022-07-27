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
    backgroundColor: "#FFFFFF",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "#6A4029",
    marginTop: 10,
    width: 100,
  },

  buttonReset: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "grey",
    marginTop: 10,
    width: 100,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "900",
  },
});
