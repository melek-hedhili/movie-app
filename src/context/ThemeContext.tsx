import React, { createContext, useState, useContext, ReactNode } from "react";
import { Theme, DarkTheme, DefaultTheme } from "@react-navigation/native";
export type ThemeProps = Theme & {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    searchText: string;
    border: string;
    notification: string;
  };
};
interface ThemeContextType {
  theme: ThemeProps;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const lightTheme: ThemeProps = {
    dark: false,
    colors: {
      primary: "white",
      secondary: "#FF8F71",
      background: "white",
      card: "white",
      text: "black",
      searchText: "#BBBBBB",
      border: "black",
      notification: "blue",
    },
  };

  const darkTheme: ThemeProps = {
    dark: true,
    colors: {
      primary: "#211F30",
      secondary: "#FF8F71",
      background: "#15141F",
      card: "black",
      text: "#FFFFFF",
      searchText: "#BBBBBB",
      border: "white",
      notification: "blue",
    },
  };

  return (
    <ThemeContext.Provider
      value={{ theme: isDarkTheme ? darkTheme : lightTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
