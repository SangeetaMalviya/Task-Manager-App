# Task-Manager-App

/TASKMANAGERAPP
│── /app
│   ├── /tabs
│   │   ├── index.tsx        # Home screen (Task List)
│   │   ├── task/[id].tsx    # Task Detail Screen (Dynamic Route)
│   │   ├── settings.tsx     # Settings Screen (Optional)
│   ├── _layout.tsx          # Expo Router layout
│   ├── +not-found.tsx       # 404 Page
│
│── /assets                  # Icons, Images, Fonts
│── /components
│   ├── _tests_            # Unit tests
│   ├── /ui                  # Reusable UI components
│   │   ├── TaskItem.tsx      # Task list item
│   │   ├── ThemedView.tsx    # Themed wrapper
│   │   ├── ThemedText.tsx    # Themed text
│
│── /constants
│   ├── Colors.ts            # App color scheme
│   ├── api.ts               # Mock API service
│
│── /hooks
│   ├── storage.ts           # AsyncStorage utilities
│   ├── notifications.ts     # Local notifications
│
│── /scripts                 # Utility scripts (if needed)
│── .gitignore
│── app.json                 # Expo app configuration
│── expo-env.d.ts            # TypeScript environment config
│── package.json             # Dependencies
│── README.md                # Documentation
│── tsconfig.json            # TypeScript settings
1️⃣ Install Dependencies
Since you're using Expo Router, ensure all dependencies are installed:

bash
Copy
Edit
npm install expo-router @react-navigation/native @react-native-async-storage/async-storage expo-notifications expo-linking
2️⃣ Navigation & Screens Setup
📁 app/_layout.tsx (Root Layout)
Expo Router requires a layout file to handle navigation.

tsx
Copy
Edit
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Tasks" }} />
      <Stack.Screen name="task/[id]" options={{ title: "Task Details" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
📁 app/tabs/index.tsx (Home Screen - Task List)
Displays tasks and allows navigation to the task details.

tsx
Copy
Edit
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text, RefreshControl } from "react-native";
import { fetchTasksFromAPI } from "../../constants/api";
import { saveTasksToStorage, getTasksFromStorage } from "../../hooks/storage";
import TaskItem from "../../components/ui/TaskItem";

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const apiTasks = await fetchTasksFromAPI();
      setTasks(apiTasks);
      await saveTasksToStorage(apiTasks);
    } catch (error) {
      const cachedTasks = await getTasksFromStorage();
      setTasks(cachedTasks);
    }
  };

  return (
    <View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTasks} />}
        renderItem={({ item }) => (
          <TaskItem task={item} onPress={() => router.push(/task/${item.id})} />
        )}
      />
    </View>
  );
}
📁 app/tabs/task/[id].tsx (Task Detail Screen)
Handles deep linking (e.g., myapp://task/1).

tsx
Copy
Edit
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getTasksFromStorage } from "../../../hooks/storage";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const loadTask = async () => {
      const tasks = await getTasksFromStorage();
      const selectedTask = tasks.find((t) => t.id.toString() === id);
      setTask(selectedTask);
    };
    loadTask();
  }, [id]);

  return (
    <View>
      {task ? (
        <>
          <Text>{task.title}</Text>
          <Text>{task.description}</Text>
          <Text>Due: {new Date(task.dueDate).toLocaleString()}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
3️⃣ Components
📁 components/ui/TaskItem.tsx
A reusable task list item.

tsx
Copy
Edit
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function TaskItem({ task, onPress }) {
  return (
    <TouchableOpacity style={styles.taskItem} onPress={onPress}>
      <Text style={styles.title}>{task.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  title: { fontSize: 16, fontWeight: "bold" },
});
4️⃣ API & Storage Helpers
📁 constants/api.ts (Mock API)
ts
Copy
Edit
export const fetchTasksFromAPI = async () => {
  return [
    { id: "1", title: "Buy Groceries", description: "Milk, Eggs, Bread", dueDate: "2025-02-22T10:00:00Z" },
    { id: "2", title: "Meeting with Team", description: "Discuss project updates", dueDate: "2025-02-23T15:00:00Z" },
    { id: "3", title: "Workout", description: "Gym session at 6 PM", dueDate: "2025-02-21T18:00:00Z" }
  ];
};
📁 hooks/storage.ts (AsyncStorage)
ts
Copy
Edit
import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_KEY = "tasks";

export const saveTasksToStorage = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks", error);
  }
};

export const getTasksFromStorage = async () => {
  try {
    const storedTasks = await AsyncStorage.getItem(TASKS_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error("Error retrieving tasks", error);
    return [];
  }
};
5️⃣ Deep Linking (app.json)
Modify app.json:

json
Copy
Edit
{
  "expo": {
    "scheme": "myapp",
    "deepLinking": true
  }
}
6️⃣ Run the App
🚀 Start Expo
bash
Copy
Edit
npx expo start
📝 Test Deep Linking
