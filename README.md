<<<<<<< HEAD
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
=======
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
>>>>>>> 136f321 (Task manager)
