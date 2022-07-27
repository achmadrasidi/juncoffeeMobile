import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 800,
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
    fontSize: 65,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'poppins',
  },
  loginBtn: {
    backgroundColor: '#FFBA33',
    borderRadius: 20,
    height: 70,
    width: '90%',
    marginLeft: 19,
    marginTop: 50,
  },
});
