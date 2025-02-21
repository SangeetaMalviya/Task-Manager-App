import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_KEY = "tasks";

export const saveTasksToStorage = async (tasks: any) => {
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
