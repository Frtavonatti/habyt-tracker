import { useState } from "react"
import { useRouter } from "expo-router"
import { Platform, View, Button, Alert, KeyboardAvoidingView, StyleSheet } from "react-native"

import { useAuth } from "@/hooks/use-auth"
import ParallaxScrollView from "@/components/parallax-scroll-view"
import ThemedTextInput from "@/components/themed-text-input"
import { ThemedView } from "@/components/themed-view"
import { ThemedText } from "@/components/themed-text"

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    try {
      await login({ username, password })
    } catch {
      Alert.alert('Login failed. Please try again.')
    }
  }  

  // TO-DO: improve page container handling
  return (
    <ParallaxScrollView>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.formContainer}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Username</ThemedText>
            <ThemedTextInput
              value={username}
              onChange={e => setUsername(e.nativeEvent.text)}
            />
          </ThemedView>
          <ThemedView style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Password</ThemedText>
            <ThemedTextInput
              value={password}
              onChange={e => setPassword(e.nativeEvent.text)}
              secureTextEntry
            />
          </ThemedView>
          <Button 
            title="Sign In"
            onPress={() => { void handleLogin() }}
          />
            <ThemedText>
            Don't have an account?{' '}
            <ThemedText
              style={{ color: '#007AFF' }}
              onPress={() => {
                router.push('/register')
              }}
            >
              Register
            </ThemedText>
            </ThemedText>
        </View>
      </KeyboardAvoidingView>      
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  }  
})