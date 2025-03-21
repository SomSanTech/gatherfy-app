import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React from "react";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2.5 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  50,
  50
);

interface Props {
  title?: string
}

const Overlay: React.FC<Props> = ({title}) => {
  const navigation = useNavigation();

  return (
    <View style={StyleSheet.absoluteFill}>
      { title && (
        <Text style={styles.header}>{title}</Text>
      )}
      <Canvas
        style={
          Platform.OS === "android"
            ? { flex: 2 }
            : StyleSheet.absoluteFillObject
        }
      >
        <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
      </Canvas>

      {/* ปุ่ม Go Back */}
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: "15%",
    alignSelf: "center",
    fontSize: wp("6%"),
    fontFamily: "Poppins-SemiBold",
    includeFontPadding: false,
    color: "white",
    zIndex: 10,
  },
  goBackButton: {
    position: "absolute",
    bottom: "20%",
    alignSelf: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  goBackText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    includeFontPadding: false,
    color: "black",
  },
});

export default Overlay;
