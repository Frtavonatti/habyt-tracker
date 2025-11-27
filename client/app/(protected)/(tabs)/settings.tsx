import React, { useState } from 'react'
import { StyleSheet, KeyboardAvoidingView } from 'react-native'
import { Image } from 'expo-image' 

import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/contexts/ThemeContext'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { ThemedTextInput } from '@/components/themed-text-input'
import { ThemedDropdown } from '@/components/themed-dropdown'
import { ThemedButton } from '@/components/themed-button'
import { Fonts } from '@/constants/theme'
import reactLogo from '@/assets/images/react-logo.png'


export default function Settings () {
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const [loginEmail, setLoginEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // TO-DO: Add change password feature

  return  (
    <ParallaxScrollView>
      <KeyboardAvoidingView>
        <ThemedView style={styles.section}>
          <ThemedText
            type="title"
            style={{ fontFamily: Fonts.rounded }}
          > Settings
          </ThemedText>
          <ThemedText>Light/Dark Mode</ThemedText>
          <ThemedDropdown
            options={[
              { label: "Dark", value: "dark" },
              { label: "Light", value: "light" },
            ]}
            value={theme}
            onValueChange={(value) => setTheme(value as typeof theme)}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText
            type="title"
            style={{ fontFamily: Fonts.rounded }}
          > Profile Details
          </ThemedText>
          <Image 
            source={reactLogo}
            style={styles.avatar}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText
            type="title"
            style={{ fontFamily: Fonts.rounded }}
          > Account Security
          </ThemedText>
          
          <ThemedTextInput
            label="Login Email"
            value={loginEmail}
            onChangeText={setLoginEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <ThemedTextInput
            label="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry
          />
          
          <ThemedTextInput
            label="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
          />
          
          <ThemedButton
            title='Logout'
            variant="danger"
            onPress={() => void handleLogout()}
            style={styles.logoutButton}
          />
        </ThemedView>
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  logoutButton: {
    marginTop: 8,
  },
})