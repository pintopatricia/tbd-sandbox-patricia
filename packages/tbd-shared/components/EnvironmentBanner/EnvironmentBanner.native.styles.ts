import { StyleSheet } from "react-native";

export default StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: 2,
    padding: 2,
    backgroundColor: "#e34234",
    color: "black",
    pointerEvents: "none",
    userSelect: "none",
    justifyContent: "center",
  },
  bannerText: {
    fontWeight: "bold",
    fontSize: 12,
    alignSelf: "center",
    color: "black",
    textTransform: "uppercase",
  },
});
