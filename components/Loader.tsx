import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';

const CELL_COLORS = [
    '#ff0000', '#ff1a0a', '#ff3415',
    '#ff4e20', '#ff6830', '#ff823f',
    '#ff9c50', '#ffb661', '#ffd073',
  ];
  
const DELAYS = [0, 100, 200, 100, 200, 200, 300, 300, 400];

const Loader = () => {
  const animations = useRef(CELL_COLORS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(DELAYS[index]),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.loader}>
        {animations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.cell,
              {
                opacity: anim,
                backgroundColor: CELL_COLORS[index],
              },
            ]}
          />
        ))}
      </View>
      <Text style={styles.title}>GATHERFY</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80
  },
  cell: {
    width: 20,
    height: 20,
    margin: 2,
    borderRadius: 4,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Loader;
