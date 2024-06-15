import { OMDB_KEY } from "../../constants";
import { MovieDetails, MoviesResponse } from "../api.types";

const baseUrl = `https://www.omdbapi.com/`;
interface FetchMoviesParams {
  searchQuery?: string;
  page?: number;
  type?: string;
}
export const fetchMovies = async ({
  searchQuery,
  page,
  type,
}: FetchMoviesParams): Promise<MoviesResponse> => {
  try {
    const response = await fetch(
      `${baseUrl}?s=${searchQuery}&page=${page}&type=${type}&apiKey=${OMDB_KEY}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: MoviesResponse = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchMovieDetails = async ({
  movieId,
}: {
  movieId: string;
}): Promise<MovieDetails> => {
  try {
    const response = await fetch(`${baseUrl}?i=${movieId}&apiKey=${OMDB_KEY}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: MovieDetails = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
