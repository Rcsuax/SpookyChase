// Shared by the board and sidebar so a player's colour matches everywhere

export const playerColor = (hue: number) => `hsl(${hue} 55% 50%)`
export const nameColor = (hue: number) => `hsl(${hue} 75% 62%)`
// Dark and muted, so a player's token stands out against their own walls
export const wallColor = (hue: number) => `hsl(${hue} 45% 28%)`
export const UNOWNED_WALL_COLOR = '#3b2a5c'   // walls left by a player who has since left

// Board background: two near-black purples in a checkerboard
export const BOARD_DARK = '#0c0912'
export const BOARD_LIGHT = '#141020'
