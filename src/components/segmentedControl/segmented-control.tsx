import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ThemeProps, useTheme } from "../../context/ThemeContext";
import { scale, verticalScale } from "react-native-size-matters";
import { SegmentedControlProps } from "./segmentedControl.types";

const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(
  ({ options, selectedOption, onOptionPress }) => {
    const { width: windowWidth } = useWindowDimensions();
    const { theme } = useTheme();

    const internalPadding = scale(20);
    const segmentedControlWidth = windowWidth - scale(40);

    const itemWidth =
      (segmentedControlWidth - internalPadding) / options.length;

    const rStyle = useAnimatedStyle(() => {
      return {
        left: withTiming(
          itemWidth * options.indexOf(selectedOption) + internalPadding / 2
        ),
      };
    }, [selectedOption, options, itemWidth]);

    return (
      <View
        style={[
          styles(theme).container,
          {
            width: "auto",
            borderRadius: 20,
            paddingLeft: internalPadding / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            {
              width: itemWidth,
            },
            rStyle,
            styles(theme).activeBox,
          ]}
        />
        {options.map((option) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onOptionPress?.(option);
              }}
              key={option}
              style={[
                {
                  width: itemWidth,
                },
                styles(theme).labelContainer,
              ]}
            >
              <Text style={styles(theme).label}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
);

const styles = (theme: ThemeProps) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      height: verticalScale(50),
      backgroundColor: theme.dark ? "#211F30" : "#F0F0F0",
    },
    activeBox: {
      position: "absolute",
      borderRadius: 10,
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      elevation: 3,
      height: "80%",
      top: "10%",
      backgroundColor: theme.colors.secondary,
    },
    labelContainer: { justifyContent: "center", alignItems: "center" },
    label: {
      fontSize: 16,
    },
  });

export { SegmentedControl };
