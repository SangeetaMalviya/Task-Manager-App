import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface TaskItemProps {
  task: { title: string };
  onPress: () => void;
}

export default function TaskItem({ task, onPress }: TaskItemProps) {
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
