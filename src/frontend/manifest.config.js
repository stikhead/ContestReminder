import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  key: 'fjcmmoenaeelfelnpoeflbligkglkdpm',
  version: pkg.version,
  icons: {
    48: 'public/logo.png',
  },
  permissions: [
    'sidePanel',
    'contentSettings',
    'storage',
    'identity',
    "alarms",
    "notifications",
  ],
  "background": {
    "service_worker": "background.js"
  },
  action: {
    default_icon: {
      48: 'public/logo.png',
    },
    default_popup: 'src/popup/index.html',
  },
  side_panel: {
    default_path: 'src/sidepanel/index.html',
  },
})
