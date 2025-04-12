import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#2A2539",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      color: "black",
      fontSize: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "black",
      backgroundColor: "#BDD3CC",
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      color: "black",
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: -55,
    },
    headerRight: {
      flexDirection: "row",
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
    },
    scrollView: {
      flex: 1,
      padding: 16,
    },
    dateContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    date: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
    },
    time: {
      color: "white",
      fontSize: 16,
    },
    moodContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
    },
    moodIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      borderWidth: 1.8,
      borderColor: "black",
      shadowColor: "white",
      shadowOffset: { width: 4, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 10,
    },
    moodEmoji: {
      fontSize: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
    },
    activitiesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    activityItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgb(247, 244, 244)",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1.5,
      borderColor: "white",
    },
    activityLabel: {
      color: "black",
      marginLeft: 6,
    },
    noteContainer: {
      backgroundColor: "#EAE9E5",
      padding: 16,
      borderRadius: 12,
    },
    noteText: {
      color: "rgba(57, 57, 57, 0.8)",
      fontSize: 16,
      lineHeight: 24,
    },
    imageGalleryContainer: {
      width: "100%",
      height: 300,
    },
    galleryImage: {
      width: width - 40,
      height: 280,
      borderRadius: 12,
      marginRight: 8,
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#555",
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: "#13d479",
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    audioPlayerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#EAE9E5",
      borderRadius: 15,
      borderWidth: 1.5,
      borderColor: "#333",
      padding: 16,
    },
    playButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#EAE9E5",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      borderWidth: 1.8,
      borderColor: "black",
    },
    audioProgressContainer: {
      flex: 1,
    },
    audioProgressBar: {
      height: 6,
      backgroundColor: "black",
      borderRadius: 3,
      overflow: "hidden",
      marginBottom: 8,
    },
    audioProgress: {
      height: "100%",
      backgroundColor: "#BDD3CC",
    },
    audioTimeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    audioTimeText: {
      color: "black",
      fontSize: 12,
    },
  });

  export default styles;