/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { AntDesign, FontAwesome } from "@expo/vector-icons";
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
import { ColorSchemeName } from "react-native";
import { Host } from "react-native-portalize";
import { Padding } from "src/components/layouts/Margin";
import { profileScreens, screens } from "src/dict";
import CreateNewAlbumFifthScreen from "src/screens/CreateNewAlbumScreen/FifthScreen";
import CreateNewAlbumFirstScreen from "src/screens/CreateNewAlbumScreen/FirstScreen";
import CreateNewAlbumFourthScreen from "src/screens/CreateNewAlbumScreen/FourthScreen";
import CreateNewAlbumSecondScreen from "src/screens/CreateNewAlbumScreen/SecondScreen";
import CreateNewAlbumThirdScreen from "src/screens/CreateNewAlbumScreen/ThirdScreen";
import TabFiveScreen from "src/screens/TabFiveScreen";
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
      <Host>
        <RootNavigator />
      </Host>
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
        component={ProfileStackNavigator}
        options={{
          title: "マイページ",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabFour"
        component={CreateNewAlbumNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="pencil-square-o" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="TabFive"
        component={TabFiveScreen}
        options={{
          title: "アルバム閲覧",
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const ProfileStack = createStackNavigator();

const ProfileStackNavigator: React.FC = () => {
  const screenOptions = useScreenOptions();
  return (
    <ProfileStack.Navigator
      initialRouteName={profileScreens.ProfileView}
      screenOptions={screenOptions}
    >
      <ProfileStack.Screen
        name={profileScreens.ProfileView}
        component={TabOneScreen}
        options={{ headerTitle: "マイページ" }}
      />
      <ProfileStack.Screen
        name={profileScreens.ProfileEdit}
        component={TabTwoScreen}
        options={{ headerTitle: "プロフィール編集" }}
      />
    </ProfileStack.Navigator>
  );
};

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
        options={{ headerShown: false }}
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
