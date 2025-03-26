import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Switch } from "react-native-switch";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import useNavigateToGoBack from "@/composables/navigateToGoBack";
import debounce from "lodash/debounce";
import * as SecureStore from "expo-secure-store";
import {
  fetchUserProfile,
  saveUserProfile,
} from "@/composables/useFetchUserProfile";

const EmailNotificationSetting = () => {
  const { navigateToGoBack } = useNavigateToGoBack();
  const [notificationSettings, setNotificationSettings] = useState({
    newEvents: null,
    remindersDay: null,
    remindersHour: null,
    updatedEvents: null,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    const user = await fetchUserProfile(token, "/v1/profile", "GET");

    setNotificationSettings({
      newEvents: user.email_new_events,
      remindersDay: user.email_reminders_day,
      remindersHour: user.email_reminders_hour,
      updatedEvents: user.email_updated_events,
    });
  };

  const saveNotificationSettings = useCallback(
    debounce(async (settings) => {
      const token = await SecureStore.getItemAsync("my-jwt");
      if (!token) {
        Alert.alert(
          "Error",
          "User authentication failed. Please log in again."
        );
        return;
      }
      const response = await saveUserProfile(
        token,
        "/v1/profile",
        "PUT",
        settings
      );
      if (response.error) {
        Alert.alert("Error", response.error);
        return;
      }
    }, 1000), // รอ 1 วินาทีหลังเปลี่ยนค่า
    []
  );

  const handleSwitchChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      saveNotificationSettings(newSettings); // เรียกอัปเดต
      return newSettings;
    });
  };

  // ✅ ใช้ array เก็บข้อมูลเพื่อให้ render อัตโนมัติ
  const notificationOptions = [
    {
      key: "newEvents",
      title: "New Event",
      detail: "Send email when a new event is created",
    },
    {
      key: "remindersDay",
      title: "Reminder Day",
      detail: "Reminder email 1 day before the event",
    },
    {
      key: "remindersHour",
      title: "Reminder Hour",
      detail: "Reminder email 1 hour before the event",
    },
    {
      key: "updatedEvents",
      title: "Updated Events",
      detail: "Send email when an event is updated",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={navigateToGoBack}>
            <Icon name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Email Notification Settings</Text>
        </View>
        <TouchableWithoutFeedback>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 15 }}>
            {notificationOptions.map(({ key, title, detail }) => (
              <NotificationItem
                key={key}
                title={title}
                detail={detail}
                value={
                  notificationSettings[
                    key as keyof typeof notificationSettings
                  ] ?? false
                }
                onToggle={() =>
                  handleSwitchChange(key as keyof typeof notificationSettings)
                }
              />
            ))}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ✅ แยก NotificationItem Component เพื่อลดโค้ดซ้ำ
interface NotificationItemProps {
  title: string;
  detail: string;
  value: boolean;
  onToggle: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  detail,
  value,
  onToggle,
}) => {
  return (
    <View style={styles.notificationContainer}>
      <View>
        <Text style={styles.notificationHeader}>{title}</Text>
        <Text style={styles.notificationDetail}>{detail}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={false}
        circleSize={29}
        barHeight={30}
        circleBorderWidth={3}
        backgroundActive={"#00b894"}
        backgroundInactive={"#dfe6e9"}
        circleActiveColor={"#30a566"}
        circleInActiveColor={"#636e72"}
        switchWidthMultiplier={2}
        switchBorderRadius={30}
        renderActiveText={false}
        renderInActiveText={false}
        renderInsideCircle={() =>
          value ? (
            <MaterialIcons name="check" size={20} color="white" />
          ) : (
            <MaterialIcons name="close" size={20} color="white" />
          )
        }
      />
    </View>
  );
};

export default EmailNotificationSetting;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  headerText: {
    includeFontPadding: false,
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginLeft: 10,
  },
  notificationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginTop: 10,
  },
  notificationHeader: {
    includeFontPadding: false,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  notificationDetail: {
    includeFontPadding: false,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#636e72",
  },
});
