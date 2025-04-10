import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BDD3CC',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A2539',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#7C6767',
    marginBottom: 20,
  },
  languagePicker: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#7C6767',
    alignSelf: 'flex-start',
  },
  languageText: {
    fontSize: 16,
    color: '#2A2539',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#EFC8C8',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#2A2539',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#2A2539',
  },
  buttonText: {
    color: '#2A2539',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerLink: {
    fontSize: 14,
    color: '#7C6767',
    textDecorationLine: 'underline',
  },
});

