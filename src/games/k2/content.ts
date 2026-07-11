import type { K2Category, K2Item } from './types'
import { NUMBER_WORDS } from '../words'
import { COLOR_PALETTE } from '../palette'

const NUMBER_KEYCAPS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

export const K2_CATEGORIES: { id: K2Category; title: string; icon: string }[] = [
  { id: 'numbers', title: 'Numbers', icon: '🔢' },
  { id: 'colours', title: 'Colours', icon: '🎨' },
  { id: 'shapes', title: 'Shapes', icon: '🔷' },
  { id: 'feelings', title: 'Feelings', icon: '😀' },
  { id: 'weather', title: 'Weather', icon: '☀️' },
  { id: 'vegetables', title: 'Vegetables', icon: '🥕' },
  { id: 'fruits', title: 'Fruits', icon: '🍎' },
  { id: 'foods', title: 'Foods & Drinks', icon: '🍚' },
  { id: 'body', title: 'Body Parts', icon: '👂' },
  { id: 'actions', title: 'Action Words', icon: '🏃' },
  { id: 'days', title: '7 Days', icon: '📅' },
]

export const K2_CONTENT: Record<K2Category, K2Item[]> = {
  numbers: NUMBER_WORDS.map((word, i) => ({ word, emoji: NUMBER_KEYCAPS[i] })),
  colours: COLOR_PALETTE.map((c) => ({ word: c.name, hex: c.hex })),
  shapes: [
    { word: 'CIRCLE', emoji: '🔵' },
    { word: 'SQUARE', emoji: '🟦' },
    { word: 'TRIANGLE', emoji: '🔺' },
    { word: 'STAR', emoji: '⭐' },
    { word: 'HEART', emoji: '❤️' },
    { word: 'DIAMOND', emoji: '🔷' },
  ],
  feelings: [
    { word: 'HAPPY', emoji: '😀' },
    { word: 'SAD', emoji: '😢' },
    { word: 'ANGRY', emoji: '😠' },
    { word: 'SCARED', emoji: '😨' },
    { word: 'SLEEPY', emoji: '😴' },
    { word: 'SURPRISED', emoji: '😲' },
  ],
  weather: [
    { word: 'SUNNY', emoji: '☀️' },
    { word: 'RAINY', emoji: '🌧️' },
    { word: 'CLOUDY', emoji: '☁️' },
    { word: 'WINDY', emoji: '🌬️' },
    { word: 'SNOWY', emoji: '❄️' },
    { word: 'STORMY', emoji: '⛈️' },
  ],
  vegetables: [
    { word: 'CARROT', emoji: '🥕' },
    { word: 'BROCCOLI', emoji: '🥦' },
    { word: 'TOMATO', emoji: '🍅' },
    { word: 'CORN', emoji: '🌽' },
    { word: 'POTATO', emoji: '🥔' },
    { word: 'ONION', emoji: '🧅' },
    { word: 'CABBAGE', emoji: '🥬' },
  ],
  fruits: [
    { word: 'APPLE', emoji: '🍎' },
    { word: 'BANANA', emoji: '🍌' },
    { word: 'ORANGE', emoji: '🍊' },
    { word: 'GRAPE', emoji: '🍇' },
    { word: 'STRAWBERRY', emoji: '🍓' },
    { word: 'WATERMELON', emoji: '🍉' },
    { word: 'MANGO', emoji: '🥭' },
  ],
  foods: [
    { word: 'RICE', emoji: '🍚' },
    { word: 'BREAD', emoji: '🍞' },
    { word: 'EGG', emoji: '🥚' },
    { word: 'NOODLE', emoji: '🍜' },
    { word: 'MILK', emoji: '🥛' },
    { word: 'WATER', emoji: '💧' },
    { word: 'JUICE', emoji: '🧃' },
  ],
  body: [
    { word: 'EYE', emoji: '👁️' },
    { word: 'EAR', emoji: '👂' },
    { word: 'NOSE', emoji: '👃' },
    { word: 'MOUTH', emoji: '👄' },
    { word: 'HAND', emoji: '✋' },
    { word: 'FOOT', emoji: '🦶' },
    { word: 'TOOTH', emoji: '🦷' },
  ],
  actions: [
    { word: 'RUN', emoji: '🏃' },
    { word: 'WALK', emoji: '🚶' },
    { word: 'JUMP', emoji: '🦘' },
    { word: 'SLEEP', emoji: '😴' },
    { word: 'EAT', emoji: '😋' },
    { word: 'DRINK', emoji: '🥤' },
    { word: 'READ', emoji: '📖' },
    { word: 'SING', emoji: '🎤' },
  ],
  days: [
    { word: 'MONDAY' },
    { word: 'TUESDAY' },
    { word: 'WEDNESDAY' },
    { word: 'THURSDAY' },
    { word: 'FRIDAY' },
    { word: 'SATURDAY' },
    { word: 'SUNDAY' },
  ],
}
