CREATE APK
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Log in to Expo (create a free account at expo.dev if you don't have one)
eas login

# 3. Inside your project folder, set up EAS
cd pos-mobile-frontend
eas init

# 4. Build a preview APK (Android only, no Play Store account needed)
eas build --platform android --profile preview

Eas.json file at the project root with this content:--->
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
