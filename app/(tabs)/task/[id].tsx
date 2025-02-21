import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getTasksFromStorage } from '@/hooks/storage';

// Define the type for a task
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      const tasks: Task[] = await getTasksFromStorage();
      const selectedTask = tasks.find((t) => t.id.toString() === id);
      setTask(selectedTask || null);
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