import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BDD3CC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  moodIconContainer: {
    marginLeft: 8,
    width: 52,
    height: 52,
    borderRadius: 30,
    borderWidth: 1.8,
    borderColor: "black",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#EFC8C8",
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 20,
  },
  saveButton: {
    width: 99,
    height: 40,
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 30,
    backgroundColor: "#EFC8C8",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  saveText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questionText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  activitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  activityItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  activityIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EDEFC8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedActivityIcon: {
    borderWidth: 1.7,
    borderColor: "black",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  activityLabel: {
    color: "balck",
    fontSize: 14,
  },
  selectedActivity: {
    opacity: 1,
  },
  noteSection: {
    marginBottom: 24,
  },
  noteTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  noteTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  noteInput: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1.8,
    borderColor: "black",
  },
  mediaSection: {
    marginBottom: 24,
  },
  mediaTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  mediaTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  mediaButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    position: "relative",
    borderWidth: 1.8,
    borderColor: "black",
  },
  mediaButtonText: {
    color: "#888",
  },
  photoContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1.8,
    borderColor: "black",
  },
  photoPreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  photoActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
  },
  photoAction: {
    alignItems: "center",
  },
  photoActionText: {
    color: "black",
    marginTop: 4,
  },
  recordingActive: {
    backgroundColor: "rgb(210, 208, 208)",
    borderWidth: 1.8,
    borderColor: "black",
  },
  recordingProgress: {
    alignItems: "center",
  },
  recordingTimeText: {
    color: "red",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  recordingInProgressText: {
    color: "black",
    fontSize: 14,
  },
  recordIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    color: "black",
  },
  recordingContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.8,
    borderColor: "black",
  },
  recordingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recordingText: {
    color: "black",
    marginLeft: 8,
  },
  recordingActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  recordingAction: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
