import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  popupContainer: {
    backgroundColor: 'rgb(227, 231, 224)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BDDBCC',
    margin: 20,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#BDDBCC',
    padding: 10,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: 'rgb(252, 120, 120)',
    padding: 10,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default styles;