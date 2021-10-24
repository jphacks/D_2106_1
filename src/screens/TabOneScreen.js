import { Button, Text } from "@ui-kitten/components";
import React from "react";
import { Dimensions, Linking, StyleSheet, View } from "react-native";
import Image from "src/components/atoms/Image";
import { Padding } from "src/components/layouts/Margin";
import PermissionGuide from "src/components/organisms/PermissionGuide";
import { BASE_PX } from "src/utils/space";

export default function TabOneScreen({ navigation }) {
  return <PermissionGuide />;
}
