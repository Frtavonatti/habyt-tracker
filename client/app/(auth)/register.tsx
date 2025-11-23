import { useState } from "react"
import { useRouter } from "expo-router"
import { Platform, View, Button, Alert, KeyboardAvoidingView, StyleSheet } from "react-native"

import { useAuth } from "@/hooks/use-auth"
import ParallaxScrollView from "@/components/parallax-scroll-view"
import ThemedTextInput from "@/components/themed-text-input"
import { ThemedView } from "@/components/themed-view"
import { ThemedText } from "@/components/themed-text"

export default function Login() {
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }
    try {
      await register({ username, name, password, email})
    } catch {
      Alert.alert('Registration failed. Please try again.')
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
            <ThemedText type="defaultSemiBold">Name</ThemedText>
            <ThemedTextInput
              value={name}
              onChange={e => setName(e.nativeEvent.text)}
            />
          </ThemedView>
          <ThemedView style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Email</ThemedText>
            <ThemedTextInput
              value={email}
              onChange={e => setEmail(e.nativeEvent.text)}
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
            <ThemedView style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Confirm password</ThemedText>
            <ThemedTextInput
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.nativeEvent.text)}
              secureTextEntry
            />
          </ThemedView>       
          <Button 
            title="Sign In"
            onPress={() => { void handleLogin() }}
          />
            <ThemedText>
            Already have an account?{' '}
            <ThemedText
              style={{ color: '#007AFF' }}
              onPress={() => {
                router.push('/(auth)/login')
              }}
            >
              Login
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