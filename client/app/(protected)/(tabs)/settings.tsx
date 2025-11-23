import { StyleSheet, Button, KeyboardAvoidingView } from 'react-native'
import { Image } from 'expo-image' 

import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/contexts/ThemeContext'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import ThemedTextInput from '@/components/themed-text-input'
import ThemedDropdown from '@/components/themed-dropdown'
import { Fonts } from '@/constants/theme'
import reactLogo from '@/assets/images/react-logo.png'

import React, { useState } from 'react'

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
        <ThemedView>
          <ThemedText
            type="title"
            style={{ fontFamily: Fonts.rounded, }}
          > Settings
          </ThemedText>
          <ThemedText>
            Light/Dark Mode
          </ThemedText>
          <ThemedDropdown
            options={[
              { label: "Dark", value: "dark" },
              { label: "Light", value: "light" },
            ]}
            value={theme}
            onValueChange={(value) => setTheme(value as typeof theme)}
          ></ThemedDropdown>
        </ThemedView>

        <ThemedView>
          <ThemedText
            type="title"
            style={{ fontFamily: Fonts.rounded, }}
          > Profile Details
          </ThemedText>
          <Image 
            source={reactLogo}
            style={{ width: 150, height: 150, borderRadius: 100 }}
          />
        </ThemedView>
        <ThemedView>
          <ThemedText
            type="title"
            style={{fontFamily: Fonts.rounded,}}
          > Account Security
          </ThemedText>
          <ThemedText>Login Email</ThemedText>
          <ThemedTextInput
            value={loginEmail}
            onChangeText={setLoginEmail}
            placeholder="Enter your email"
          />
          <ThemedText>New password</ThemedText>
          <ThemedTextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry
          />
          <ThemedText>Confirm new password</ThemedText>
          <ThemedTextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
          />
          <Button
            title='Logout'
            onPress={() => void handleLogout()}
          />
        </ThemedView>
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  )
}

/* const styles = StyleSheet.create({

}) */
