// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
// import { FloatingAction } from "react-native-floating-action";

// // ローカルデータでの管理
// type Todo = {
//   id: string;
//   text: string;
// };

// type Tab = {
//   id: string;
//   name: string;
//   todos: Todo[];
// };

// export default function App() {



//   const addTodo = () => {
//     if (!activeTab) return;
//     const newTodo: Todo = { id: Date.now().toString(), text: `Todo ${Date.now()}` };
//     setTabs((prevTabs) =>
//       prevTabs.map((tab) =>
//         tab.id === activeTab ? { ...tab, todos: [...tab.todos, newTodo] } : tab
//       )
//     );
//   };

//   const deleteTodo = (todoId: string) => {
//     if (!activeTab) return;
//     setTabs((prevTabs) =>
//       prevTabs.map((tab) =>
//         tab.id === activeTab
//           ? { ...tab, todos: tab.todos.filter((todo) => todo.id !== todoId) }
//           : tab
//       )
//     );
//   };

//   const updateTodoOrder = (data: Todo[]) => {
//     if (!activeTab) return;
//     setTabs((prevTabs) =>
//       prevTabs.map((tab) =>
//         tab.id === activeTab ? { ...tab, todos: data } : tab
//       )
//     );
//   };

//   const renderTodoItem = ({ item, drag }: RenderItemParams<Todo>) => (
//     <View style={styles.todoItem}>
//       <Pressable onLongPress={drag} style={styles.todoTextContainer} android_ripple={{ color: "#d1d1d1" }}>
//         <Text style={styles.todoText}>{item.text}</Text>
//       </Pressable>
//       <Pressable onPress={() => deleteTodo(item.id)} android_ripple={{ color: "#ffcccc" }}>
//         <Text style={styles.deleteText}>Delete</Text>
//       </Pressable>
//     </View>
//   );

//   const renderTab = () => {
//     const currentTab = tabs.find((tab) => tab.id === activeTab);
//     if (!currentTab) return <Text style={styles.emptyText}>No Todos</Text>;
//     return (
//       <DraggableFlatList
//         data={currentTab.todos}
//         keyExtractor={(item) => item.id}
//         renderItem={renderTodoItem}
//         onDragEnd={({ data }) => updateTodoOrder(data)}
//       />
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.tabContainer}>
//         {tabs.map((tab) => (
//           <Pressable
//             key={tab.id}
//             style={[styles.tab, activeTab === tab.id && styles.activeTab]}
//             onPress={() => setActiveTab(tab.id)}
//             onLongPress={() => setIsEditingTab(tab.id)}
//             android_ripple={{ color: "#bbdefb" }}
//           >
//             {isEditingTab === tab.id ? (
//               <TextInput
//                 style={styles.tabInput}
//                 value={tab.name}
//                 onChangeText={(text) =>
//                   setTabs((prevTabs) =>
//                     prevTabs.map((t) =>
//                       t.id === tab.id ? { ...t, name: text } : t
//                     )
//                   )
//                 }
//                 onBlur={() => setIsEditingTab(null)}
//               />
//             ) : (
//               <Text style={styles.tabText}>{tab.name}</Text>
//             )}
//             {isEditingTab === tab.id && (
//               <Pressable onPress={() => deleteTab(tab.id)} android_ripple={{ color: "#ffcdd2" }}>
//                 <Text style={styles.deleteTabText}>×</Text>
//               </Pressable>
//             )}
//           </Pressable>
//         ))}
//         {tabs.length < 3 &&
//           <Pressable style={styles.addTabButton} onPress={addTab} android_ripple={{ color: "#81c784" }}>
//             <Text style={styles.addTabText}>+</Text>
//           </Pressable>
//         }
//       </View>
//       <View style={styles.todoContainer}>{renderTab()}</View>
//       <FloatingAction
//         actions={[]}
//         onPressMain={addTodo}
//         color="#2196F3"
//         showBackground={false}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10 },
//   tabContainer: { flexDirection: "row", marginBottom: 10 },
//   tab: { width: `32%`, padding: 10, backgroundColor: "#e0e0e0", marginRight: 5, borderRadius: 5, display: 'flex', flexDirection: 'row', alignItems: 'center' },
//   activeTab: { backgroundColor: "#2196F3" },
//   tabText: { color: "#fff" },
//   addTabButton: { padding: 10, backgroundColor: "#4CAF50", borderRadius: 5 },
//   addTabText: { color: "#fff" },
//   todoContainer: { flex: 1 },
//   todoItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 10,
//     backgroundColor: "#f9f9f9",
//     marginBottom: 5,
//     borderRadius: 5,
//   },
//   todoTextContainer: { flex: 1 },
//   todoText: { fontSize: 16 },
//   deleteText: { color: "red" },
//   emptyText: { textAlign: "center", marginTop: 20, fontSize: 18, color: "#9e9e9e" },
//   tabInput: { width: '90%', height: '100%', backgroundColor: "#fff", borderRadius: 5 },
//   deleteTabText: { color: "white", fontSize: 24, marginLeft: 5 },
// });
