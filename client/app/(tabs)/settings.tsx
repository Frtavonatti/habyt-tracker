import { StyleSheet, Button, KeyboardAvoidingView } from 'react-native'
import { Image } from 'expo-image' 

import { useTheme } from '@/contexts/ThemeContext'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import ThemedTextInput from '@/components/themed-text-input'
import ThemedDropdown from '@/components/themed-dropdown'
import { Fonts } from '@/constants/theme'
import reactLogo from '@/assets/images/react-logo.png'

export default function Settings () {
  const { theme, setTheme } = useTheme()

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
          >
          </Image>
          <ThemedText>Username</ThemedText>
          <ThemedTextInput></ThemedTextInput>
          <Button title="Sign Out"></Button>
        </ThemedView>

        <ThemedView>
          <ThemedText
            type="title"
            style={{fontFamily: Fonts.rounded,}}
          > Account Security
          </ThemedText>
          <ThemedText>Login Email</ThemedText>
          <ThemedTextInput></ThemedTextInput>
          <ThemedText>New password</ThemedText>
          <ThemedTextInput></ThemedTextInput>
          <ThemedText>Confirm new password</ThemedText>
          <ThemedTextInput></ThemedTextInput>
        </ThemedView>

      </KeyboardAvoidingView>
    </ParallaxScrollView>
  )
}

/* const styles = StyleSheet.create({

}) */
