/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";
import { Padding } from "src/components/layouts/Margin";
import { screens } from "src/dict";
import CreateNewAlbumFirstScreen from "src/screens/CreateNewAlbumScreen/FirstScreen";
import CreateNewAlbumFourthScreen from "src/screens/CreateNewAlbumScreen/FourthScreen";
import CreateNewAlbumSecondScreen from "src/screens/CreateNewAlbumScreen/SecondScreen";
import CreateNewAlbumThirdScreen from "src/screens/CreateNewAlbumScreen/ThirdScreen";
import CreateNewAlbumFifthScreen from "src/screens/CreateNewAlbumScreen/FifthScreen";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabOneScreen from "../screens/TabOneScreen";
import TabThreeScreen from "../screens/TabThreeScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<"TabOne">) => ({
          title: "Tab One",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabThree"
        component={TabThreeScreen}
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabFour"
        component={CreateNewAlbumNavigator}
        options={{ headerShown: false }}
      />
    </BottomTab.Navigator>
  );
}

const CreateNewAlbumStack = createStackNavigator();

const CreateNewAlbumNavigator: React.FC = () => {
  const screenOptions = useScreenOptions();
  return (
    <CreateNewAlbumStack.Navigator
      initialRouteName={screens.CreateNewAlbumFirst}
      screenOptions={screenOptions}
    >
      <CreateNewAlbumStack.Screen
        name={screens.CreateNewAlbumFirst}
        component={CreateNewAlbumFirstScreen}
        options={{ headerTitle: "アルバムを作成" }}
      />
      <CreateNewAlbumStack.Screen
        name={screens.CreateNewAlbumSecond}
        component={CreateNewAlbumSecondScreen}
        options={{ headerTitle: "記録の進行状況" }}
      />
      <CreateNewAlbumStack.Screen
        name={screens.CreateNewAlbumThird}
        component={CreateNewAlbumThirdScreen}
        options={{ headerTitle: "写真の選別" }}
      />
      <CreateNewAlbumStack.Screen
        name={screens.CreateNewAlbumFour}
        component={CreateNewAlbumFourthScreen}
        options={{ headerTitle: "情報の入力" }}
      />
      <CreateNewAlbumStack.Screen
        name={screens.CreateNewAlbumFifth}
        component={CreateNewAlbumFifthScreen}
        options={{ headerTitle: "プレビュー" }}
      />
    </CreateNewAlbumStack.Navigator>
  );
};

const useScreenOptions = (): StackNavigationOptions => {
  return {
    headerLeft: ({ canGoBack, onPress }) =>
      canGoBack && (
        <Padding left={4}>
          <AntDesign name="left" onPress={onPress} size={24} color="#333" />
        </Padding>
      ),
  };
};

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
