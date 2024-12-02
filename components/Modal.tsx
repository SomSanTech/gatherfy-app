import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { Button } from "@rneui/themed";
import React, { useEffect, useRef } from "react";

interface ModalProps {
  visible: boolean;
  options: { from: 'top' | 'bottom' };
  duration: number;
  onClose: () => void;
}

const Modal = ({ visible, options, duration, onClose }: ModalProps) => {
  const { height } = Dimensions.get("screen");
  const transY = useRef(new Animated.Value(options.from ==='top' ? -height : height));

  useEffect(() => {
    if (visible) {
      startAnimation(0);
    } else {
      startAnimation(options.from ==='top' ? -height : height);
    }
  }, [visible]);

  const startAnimation = (toValue: number) => {
    Animated.timing(transY.current, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const onPress = () => {
    onClose();
  };

  const backgroundOpacity = transY.current.interpolate({
    inputRange: [0, height],
    outputRange: [0.6, 0],
    extrapolate: 'clamp'
  });

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[styles.outerContainer, { opacity: backgroundOpacity }]}
      />
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: transY.current }] },
        ]}
      >
        <View style={styles.innerContainer}>
          <Button title="Close Modal" onPress={onPress} />
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "70%",
    height: "20%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
});

export default Modal;
