import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails } from "../../api/services";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeProps, useTheme } from "../../context/ThemeContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ActivityIndicator } from "react-native-paper";
import { scale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

const MovieDetailsScreen = () => {
  const { params } = useRoute() as { params: { movieId: string } };
  const { theme } = useTheme();
  const navigation = useNavigation();
  const fadeAnim = useSharedValue(0);
  const { data, isLoading } = useQuery({
    queryKey: ["movieDetails", params.movieId],
    queryFn: () =>
      fetchMovieDetails({
        movieId: params.movieId,
      }),
  });

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1000 });
  }, [fadeAnim]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });
  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#FFD700" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles(theme).container}>
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles(theme).roundedButton]}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={{ uri: data?.Poster }}
          style={styles(theme).moviePoster}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[
            "transparent",
            "rgba(23, 23, 23, 0.8)",
            "rgba(23, 23, 23, 1)",
          ]}
          style={styles(theme).linearGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
      {/* movie details */}
      <Animated.View
        style={[styles(theme).movieDetailsContainer, animatedStyles]}
      >
        {/* title */}
        <Animated.Text style={[styles(theme).movieTitle]}>
          {data?.Title}
        </Animated.Text>
        {/* status, release, runtime */}
        <Animated.Text style={[styles(theme).movieInfo]}>
          {data?.Rated} • {data?.Released} • {data?.Runtime}
        </Animated.Text>
        {/* genres */}
        <View style={styles(theme).genresContainer}>
          {data?.Genre.split(", ").map((genre, index) => {
            let showDot = index + 1 !== data.Genre.split(", ").length;
            return (
              <Text key={index} style={styles(theme).genreText}>
                {genre} {showDot ? "•" : null}
              </Text>
            );
          })}
        </View>
        {/* description */}
        <Animated.Text style={[styles(theme).movieOverview]}>
          {data?.Plot}
        </Animated.Text>
        {/* other details */}
        <View style={styles(theme).otherDetailsContainer}>
          <View style={styles(theme).detailItem}>
            <Text style={styles(theme).detailLabel}>Director:</Text>
            <Text style={styles(theme).detailValue}>{data?.Director}</Text>
          </View>
          <View style={styles(theme).detailItem}>
            <Text style={styles(theme).detailLabel}>Actors:</Text>
            <Text style={styles(theme).detailValue}>{data?.Actors}</Text>
          </View>
          <View style={styles(theme).detailItem}>
            <Text style={styles(theme).detailLabel}>Box Office:</Text>
            <Text style={styles(theme).detailValue}>{data?.BoxOffice}</Text>
          </View>
          {/* You can add more details here */}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};
const styles = (theme: ThemeProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#15141F",
    },
    roundedButton: {
      borderRadius: 50,
      width: scale(40),
      height: scale(40),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.secondary,
      position: "absolute",
      top: scale(30),
      left: scale(16),
      zIndex: 1,
    },
    genresContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginHorizontal: 16,
      marginVertical: 8,
    },
    moviePoster: {
      width: width,
      height: height / 2,
    },
    movieInfo: {
      color: "#A9A9A9",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
    linearGradient: {
      width: width,
      height: height / 2,
      position: "absolute",
      bottom: 0,
    },
    movieOverview: {
      color: "#A9A9A9",
      marginHorizontal: 16,
      letterSpacing: 1,
    },
    movieTitle: {
      color: "white",
      textAlign: "center",
      fontSize: 24,
      fontWeight: "bold",
      letterSpacing: 1,
    },
    genreText: {
      color: "#A9A9A9",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
    movieDetailsContainer: {
      marginTop: -(height * 0.09),
      paddingVertical: 3,
    },
    otherDetailsContainer: {
      marginTop: 20,
      paddingHorizontal: 16,
    },
    detailItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    detailLabel: {
      color: "#A9A9A9",
      fontSize: 16,
      fontWeight: "600",
    },
    detailValue: {
      color: "white",
      fontSize: 16,
    },
  });

export default MovieDetailsScreen;
