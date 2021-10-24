import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation as useOrigNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// ここの型を厳密にして useNavigation の型チェックを行えるようにしたい
type NavigationProp = CompositeNavigationProp<
  // @ts-ignore
  BottomTabNavigationProp<{ [key: string]: any }>,
  StackNavigationProp<{ [key: string]: any }>
>;

export const useNavigation = () => useOrigNavigation<NavigationProp>();
