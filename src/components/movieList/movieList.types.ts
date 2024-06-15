import { Movie } from "../../api/api.types";

type MovieListProps = {
  title: string;
  hideSeeAll?: boolean;
  data: Movie[];
  isLoading?: boolean;
  onEndReached?: () => void;
  isFetchingMoreMovies?: boolean;
};
export type { MovieListProps };
