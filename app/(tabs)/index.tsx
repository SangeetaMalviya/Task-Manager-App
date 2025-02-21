import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import TaskItem from "@/components/TaskItem";
import { getTasksFromStorage, saveTasksToStorage } from "@/hooks/storage";
import { fetchTasksFromAPI } from "@/constants/api";

// Define the type for a task
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

// Define the type for the dynamic route
type TaskRoute = `/task/${string}`;

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router:any = useRouter();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const apiTasks: Task[] = await fetchTasksFromAPI();
      setTasks(apiTasks);
      await saveTasksToStorage(apiTasks);
    } catch (error) {
      const cachedTasks: Task[] = await getTasksFromStorage();
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
          <TaskItem task={item} onPress={() => router.push(`/task/${item.id}` as TaskRoute)} />
        )}
      />
    </View>
  );
}