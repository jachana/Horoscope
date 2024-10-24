import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#6B4DE6',
      tabBarInactiveTintColor: '#666',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily',
          tabBarIcon: ({ color }) => <FontAwesome name="sun-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="readings"
        options={{
          title: 'Readings',
          tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dreams"
        options={{
          title: 'Dreams',
          tabBarIcon: ({ color }) => <FontAwesome name="cloud" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="palmreading"
        options={{
          title: 'Palm',
          tabBarIcon: ({ color }) => <FontAwesome name="hand-paper-o" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
