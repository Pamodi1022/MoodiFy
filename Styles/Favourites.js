import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2539',
    paddingBottom: 70, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#BDD3CC',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: -5,
  },
  listContent: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 80, // Extra padding to account for tab bar
  },
  journalCard: {
    backgroundColor: '#EDEFC8',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333',
    padding: 3,
  },
  journalImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  noImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalContent: {
    flex: 1,
    padding: 12,
  },
  journalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  journalDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  journalText: {
    fontSize: 14,
    color: '#555',
  },
  favoriteIconContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginBottom: 70, // Account for tab bar
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  detailsContainer: {
    backgroundColor: '#BDD3CC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  detailsScroll: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#333',
    marginTop: 10,
  },
  favoriteButton: {
    padding: 8,
  },
  detailDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  moodContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 35,
    width: 65,
    height: 65,
    borderWidth: 1.5,
    borderColor: '#333',
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  activityText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#555',
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  detailImage: {
    width: windowWidth * 0.7,
    height: 200,
    borderRadius: 8,
    marginRight: 10,
  },
  // Tab bar styles
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#BDD3CC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: 'black',
    fontSize: 12,
    marginTop: 4,
  },
  addEntryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EDEFC8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    borderWidth: 4,
    borderColor: '#000',
  },
});

export default styles;