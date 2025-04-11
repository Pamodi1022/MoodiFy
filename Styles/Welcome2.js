import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BDD3CC',
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
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'Black',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgb(74, 74, 74)',
    marginBottom: 30,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(81, 80, 80)',
    marginBottom: 15,
  },
  colorSection: {
    marginBottom: 30,
  },
  colorPalette: {
    flexDirection: 'row',
    backgroundColor: 'rgb(239, 252, 246)',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    marginLeft: 15,
    justifyContent: 'space-between',

  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  emojiTheme: {
    flexDirection: 'row',
    backgroundColor: 'rgb(253, 253, 237)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  selectedTheme: {
    borderWidth: 2,
    borderColor: 'rgb(81, 80, 80)',
  },
  emojiCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.3,
  },
  emoji: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  nextButton: {
    backgroundColor: '#EFC8C8',
    borderRadius: 30,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#2A2539',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#2A2539',

  },
  nextButtonText: {
    color: '#2A2539',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButtonArrow: {
    color: '#2A2539',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  navigationBar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 24,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'white',
  },
  squareButton: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  selectedPalette: {
    borderWidth: 2,
    borderColor: 'rgb(81, 80, 80)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.8,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;