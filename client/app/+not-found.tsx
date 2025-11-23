import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { useRouter } from 'expo-router'

export default function NotFoundScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>Page Not Found</Text>
      <Button title="Go Home" onPress={() => router.replace('/')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  message: {
    fontSize: 20,
    marginBottom: 32,
    color: '#666',
    textAlign: 'center',
  },
})