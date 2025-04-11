import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BDD3CC',
    padding: 20,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
  inactiveDot: {
    backgroundColor: '#007C5E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A2539',
    marginBottom: 20,
    marginTop: 25,
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
    height: 230,
    marginBottom: 30,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#EFC8C8',
    marginTop: 40,
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

export default styles;

