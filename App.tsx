import { StatusBar } from "expo-status-bar";

import MainNavigator from "./src/navigation";
import { ThemeProvider } from "./src/context/ThemeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/api/queryClient";

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <MainNavigator />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
