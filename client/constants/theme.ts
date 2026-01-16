import { Platform } from 'react-native'

const tintColorLight = '#0a7ea4'
const tintColorDark = '#fff'

export const Colors = {
  light: {
    text: '#11181C',
    background: '#e6e6e6',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
})

export const heatmapTheme = {
  // scheme: colorScheme,
  light: {
    headerTextColor: '#11181C',
    cellDefaultColor: '#ebedf0',
    cellTextColor: '#11181C',
    cellColor: {
      1: '#9be9a8',
      2: '#40c463',
      3: '#30a14e',
      4: '#216e39',
      5: '#216e39',
    },
    sidebarTextColor: '#11181C',
  },
  dark: {
    headerTextColor: '#ECEDEE',
    cellDefaultColor: '#161b22',
    cellTextColor: '#ECEDEE',
    cellColor: {
      1: '#0e4429',
      2: '#006d32',
      3: '#26a641',
      4: '#39d353',
      5: '#39d353',
    },
    sidebarTextColor: '#ECEDEE',
  },
}
