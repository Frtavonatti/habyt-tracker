import { ThemedText } from "./themed-text";

type StatsRowProps = {
  value: number
  label: string
  visible?: boolean
}

export const StatsRow = ({ value, label, visible = true }: StatsRowProps) => {
  if (!visible) return null

  return (
    <ThemedText>
      {label + ": "}
      <ThemedText type="defaultSemiBold">
        {value}
      </ThemedText>
    </ThemedText>
  )
}
