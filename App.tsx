// App.js
import React, { useState } from "react";
import { View, ScrollView, Text as RNText, TouchableOpacity } from "react-native";
import {
  Appbar,
  Card,
  Button,
  TextInput,
  Switch,
  Snackbar,
  Avatar,
  Divider,
} from "react-native-paper";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notify, setNotify] = useState(true);
  const [snackVisible, setSnackVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit() {
    setLoading(true);
    // simulate an async action
    setTimeout(() => {
      setLoading(false);
      setSnackVisible(true);
    }, 700);
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Top Appbar (Paper) */}
      <Appbar.Header elevated={true} className="bg-white">
        <Appbar.Content title="Paper + NativeWind Test" subtitle="Verify UI integration" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      {/* Content area */}
      <ScrollView contentContainerStyle={{ padding: 20 }} className="pb-8">
        {/* Intro card (Paper) inside a NativeWind-centered container */}
        <View className="items-center mb-6">
          <Card style={{ width: "100%", maxWidth: 560 }} elevation={5} className="rounded-xl">
            <Card.Content>
              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <RNText className="text-2xl font-bold text-gray-900">Welcome</RNText>
                  <RNText className="text-sm text-gray-600 mt-1">
                    This screen uses react-native-paper components + NativeWind utility classes.
                  </RNText>
                </View>

                {/* Avatar from Paper */}
                <Avatar.Icon size={52} icon="account" style={{ backgroundColor: "#2563eb" }} />
              </View>

              <Divider style={{ marginVertical: 8 }} />

              <RNText className="text-gray-700 mb-3">
                Fill the form below and press the primary button. Use the toggle to test stateful components.
              </RNText>
            </Card.Content>
          </Card>
        </View>

        {/* Form card */}
        <View className="items-center">
          <Card style={{ width: "100%", maxWidth: 560 }} className="rounded-2xl" elevation={4}>
            <Card.Content>
              <RNText className="text-lg font-semibold text-gray-800 mb-4">Profile</RNText>

              <TextInput
                label="Full name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={{ marginBottom: 12 }}
                placeholder="e.g. John Doe"
              />

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ marginBottom: 12 }}
                placeholder="you@example.com"
              />

              <View className="flex-row items-center justify-between mt-1 mb-4">
                <View>
                  <RNText className="text-sm text-gray-700">Notifications</RNText>
                  <RNText className="text-xs text-gray-500">Receive updates and offers</RNText>
                </View>

                <Switch value={notify} onValueChange={setNotify} />
              </View>

              <View className="flex-row space-x-3">
                <Button
                  mode="contained"
                  onPress={onSubmit}
                  loading={loading}
                  style={{ flex: 1, borderRadius: 12 }}
                >
                  Save
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => {
                    setName("");
                    setEmail("");
                    setNotify(false);
                  }}
                  style={{ flex: 1, borderRadius: 12 }}
                >
                  Reset
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Small nativewind-only test area */}
        <View className="items-center mt-6">
          <View className="w-full max-w-sm bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <RNText className="text-sm text-gray-600 mb-3">
              NativeWind-only test block (this is a plain View/Text with Tailwind classes).
            </RNText>

            <TouchableOpacity
              className="py-3 rounded-lg items-center"
              style={{ backgroundColor: "#f1f5f9" }}
              onPress={() => setSnackVisible(true)}
            >
              <RNText className="text-blue-600 font-semibold">Show snackbar</RNText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Snackbar from Paper */}
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        action={{
          label: "OK",
          onPress: () => {
            setSnackVisible(false);
          },
        }}
      >
        {`Saved ${name ? `for ${name}` : ""} — notifications ${notify ? "on" : "off"}`}
      </Snackbar>
    </View>
  );
}
