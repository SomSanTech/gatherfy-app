<img src="https://github.com/user-attachments/assets/c954c918-6cfd-489a-b380-71a75b0611ad" width="150" />

# Welcome to Gatherfy Application 

- This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).


> [!IMPORTANT]
> ## Java Version Requirement
>
> ✅ You **must use Java version 17** to build this project.  
> ❌ Other versions are not supported and will cause build errors.
>
> ## Path Folder Requirement
> 
> 🚫 **No spaces in the project path**:  
> Folder names or paths with spaces (e.g., `~/My Projects/Gatherfy`) will cause Gradle build errors.  
> 
> ✅ Use a path like `~/Projects/GatherfyApp` instead.
> 
> ## Environment Setup (If run in local)
>
>Please create `.env.local` file in your project root with the following content:
>
>```env
>ANDROID_HOME=$HOME/Library/Android/sdk
>PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
>
>EXPO_PUBLIC_ANDROID_CLIENT_ID={YOUR_ANDROID_CLIENT_ID}
>EXPO_PUBLIC_IOS_CLIENT_ID={YOUR_IOS_CLIENT_ID}
>EXPO_PUBLIC_WEB_CLIENT_ID={YOUR_WEB_CLIENT_ID}
>```
<br>

## Get started

1. Install dependencies

   ```bash
   npm install
   ```
   
2. Prebuild android/ios
   ```bash
   npx expo prebuild --clean
   ```
   
3. Turn on your device
 
4. Start the app

   ```bash
   npx expo run:android 
   ```
   or
    ```bash
   npx expo run:ios 
   ```
    
> [!NOTE]
> Select command by device

<br>

In the output, you can only open the app as a **development build** because Expo's standard build does not support Google login — this feature requires a development build to function properly.
