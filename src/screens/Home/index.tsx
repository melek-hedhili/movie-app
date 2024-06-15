import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ThemeProps, useTheme } from "../../context/ThemeContext";
import { scale, verticalScale } from "react-native-size-matters";

import { Searchbar, Switch } from "react-native-paper";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import useSearchDebounce from "../../hooks/useSearchDebounce";
import MovieList from "../../components/movieList/movieList";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { SegmentedControl } from "../../components/segmentedControl/segmented-control";
import { Movie } from "../../api/api.types";
import { fetchMovies } from "../../api/services";
const MoviesAnimation = require("../../../assets/animations/movies.json");
const options = ["Movie", "Series", "Episodes"];

const HomeScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("Spider-man");
  const [selectedOption, setSelectedOption] = useState<string>("Movie");
  const [movies, setMovies] = useState<Movie[]>([]);
  const debouncedSearchQuery = useSearchDebounce(searchQuery, 700);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["movies", debouncedSearchQuery, selectedOption],
    queryFn: ({ pageParam = 1 }) =>
      fetchMovies({
        searchQuery: debouncedSearchQuery,
        type: selectedOption.toLowerCase(),
        page: pageParam,
      }),

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.totalResults === "0") return undefined;

      const totalPages = Math.ceil(Number(lastPage.totalResults) / 10);
      const nextPage = allPages?.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    enabled: debouncedSearchQuery.length > 2,
    initialPageParam: 1,
  });
  useEffect(() => {
    if (isSuccess) {
      const newMovies = data.pages.flatMap((page) => page.Search || []);
      setMovies(newMovies);
    }
  }, [data, isSuccess]);
  const onEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView style={styles(theme).container}>
      <View style={styles(theme).header}>
        <LottieView
          autoPlay
          style={{
            width: scale(50),
            height: verticalScale(50),
          }}
          source={MoviesAnimation}
        />
        <TouchableOpacity
          style={[
            styles(theme).switchMode,
            {
              backgroundColor: theme.dark ? "#211F30" : "#FF8F71",
            },
          ]}
          onPress={toggleTheme}
        >
          <MaterialIcons
            name={theme?.dark ? "wb-sunny" : "brightness-2"}
            size={28}
            color={theme?.colors.text}
          />
        </TouchableOpacity>
      </View>

      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.nativeEvent.text)}
        style={styles(theme).searchBar}
        placeholderTextColor={theme?.colors.searchText}
        iconColor={theme?.colors.text}
      />
      {debouncedSearchQuery.length <= 2 && (
        <Text
          style={{
            color: "red",
            textAlign: "left",
            fontSize: scale(12),
            marginHorizontal: verticalScale(8),
          }}
        >
          Must contain at least 3 characters
        </Text>
      )}
      <View style={{ height: verticalScale(20) }} />
      <SegmentedControl
        options={options}
        selectedOption={selectedOption}
        onOptionPress={setSelectedOption}
      />
      <MovieList
        data={movies}
        title="Movies"
        isLoading={isLoading}
        onEndReached={onEndReached}
        isFetchingMoreMovies={isFetchingNextPage}
      />
      <Text style={styles(theme).title}>
        Find Movies, Tv series, and more..
      </Text>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = (theme?: ThemeProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.colors.background,
      marginTop: verticalScale(16),
      gap: scale(0),

      padding: scale(16),
    },
    title: {
      fontSize: scale(14),
      color: theme?.colors.text,
      textAlign: "center",
    },
    switchMode: {
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },
    searchBar: {
      borderRadius: scale(20),
      backgroundColor: theme?.colors.primary,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: scale(16),
      marginBottom: verticalScale(16),
    },
  });
