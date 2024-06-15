import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MovieListProps } from "./movieList.types";
import { scale, verticalScale } from "react-native-size-matters";
import LottieView from "lottie-react-native";
import { useTheme } from "../../context/ThemeContext";
import { Movie } from "../../api/api.types";
const NoDataFoundAnimation = require("../../../assets/animations/no_data.json");
const { width, height } = Dimensions.get("window");

const MovieList = ({
  title,
  onEndReached,
  data,
  isLoading,
  isFetchingMoreMovies,
}: MovieListProps) => {
  const navigation = useNavigation();

  const { theme } = useTheme();
  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <TouchableWithoutFeedback
        onPress={() =>
          //@ts-ignore
          navigation.navigate("MovieDetails", {
            movieId: item?.imdbID,
          })
        }
      >
        <View style={styles.movieContainer}>
          <Image source={{ uri: item?.Poster }} style={styles.moviePoster} />
          <Text style={styles.movieTitle}>
            {item?.Title.length > 14
              ? `${item?.Title.slice(0, 14)}...`
              : item?.Title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    ),
    []
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: scale(24),
            color: theme.colors.text,
          }}
        >
          {title}
        </Text>
      </View>

      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.9}
        ListEmptyComponent={
          <>
            <LottieView
              autoPlay
              style={{
                width: scale(200),
                height: verticalScale(200),
              }}
              source={NoDataFoundAnimation}
            />
            <Text
              style={{
                color: theme.colors.text,
                fontSize: scale(18),
              }}
            >
              No data found
            </Text>
          </>
        }
        ListFooterComponent={
          isFetchingMoreMovies ? (
            <ActivityIndicator size="large" color="#FFD700" />
          ) : null
        }
      />
    </View>
  );
};
export default memo(MovieList);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: verticalScale(32),
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginHorizontal: scale(16),
    marginVertical: verticalScale(16),
  },

  seeAllText: {
    fontSize: scale(18),
    color: "#FFD700",
  },
  listContent: {
    alignItems: "center",
  },
  movieContainer: {
    padding: scale(16),

    alignItems: "center",
  },
  moviePoster: {
    width: width * 0.33,
    height: height * 0.22,
    borderRadius: 20,
  },
  movieTitle: {
    marginTop: verticalScale(8),
    fontSize: scale(14),
    color: "#D3D3D3",
    textAlign: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
