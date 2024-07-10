import { AppState, StatusBar, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import Button from './src/components/shared/button'
import { ThemeProvider } from '@shopify/restyle'
import theme, { Text } from './src/utils/theme'
import Navigation from './src/navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SWRConfig } from 'swr'



const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SWRConfig
          value={{
            provider: () => new Map(),
            isVisible: () => { return true },
            initFocus(callback) {
              let appState = AppState.currentState

              const onAppStateChange = (nextAppState:any) => {
                /* If it's resuming from background or inactive mode to active one */
                if (appState.match(/inactive|background/) && nextAppState === 'active') {
                  callback()
                }
                appState = nextAppState
              }

              // Subscribe to the app state change events
              const subscription = AppState.addEventListener('change', onAppStateChange)

              return () => {
                subscription.remove()
              }
            }
          }}
        >
          <Navigation />
        </SWRConfig>
        <StatusBar
          translucent
        />
      </SafeAreaProvider>
    </ThemeProvider>

  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})