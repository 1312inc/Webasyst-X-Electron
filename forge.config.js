require('dotenv').config()

module.exports = {
  packagerConfig: {
    name: 'Webasyst X',
    icon: './assets/icon',
    appBundleId: process.env.APPLE_APP_BUNDLE_ID,
    osxSign: {
      identity: 'Developer ID Application: Vladimir Tuporshin (GCBUDGV556)',
      'hardened-runtime': true,
      entitlements: 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
      'gatekeeper-assess': false,
      'signature-flags': 'library'
    },
    osxNotarize: {
      appleId: process.env.APPLE_APPLEID,
      appleIdPassword: process.env.APPLE_APPLEID_PASSWORD,
      ascProvider: process.env.APPLE_TEAM_SHORT_NAME
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        certificateFile: process.env.WINDOWS_PFX_FILE,
        certificatePassword: process.env.WINDOWS_PFX_PASSWORD
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {}
    },
    {
      name: '@electron-forge/maker-zip'
    }
  ]
}
