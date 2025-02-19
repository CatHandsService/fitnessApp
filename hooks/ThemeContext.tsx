import React, { createContext, useContext } from 'react';
import { ColorSchemeName } from 'react-native';

interface ThemeContextProps {
  theme: ColorSchemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;