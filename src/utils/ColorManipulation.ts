import { lighten, darken, readableColor } from 'polished'

export const lightenColor = (color: string, amount: number) => {
  try {
    return lighten(amount, color)
  } catch {
    return undefined
  }
}

export const darkenColor = (color: string, amount: number) => {
  try {
    return darken(amount, color)
  } catch {
    return undefined
  }
}

export const constrastColor = (color: string, returnIfLightColor?: string, returnIfDarkColor?: string,) => {
  try {
    return readableColor(color, returnIfLightColor, returnIfDarkColor)
  } catch {
    return undefined
  }
}
