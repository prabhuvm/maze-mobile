package social.maze.mazeMobile

import android.content.Intent
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.net.Uri

class AppLauncherModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  
    override fun getName(): String {
        return "AppLauncher"
    }

    @ReactMethod
    fun launchApp(packageName: String, promise: Promise) {
        val pm: PackageManager = reactApplicationContext.packageManager
        val intent: Intent? = pm.getLaunchIntentForPackage(packageName)

        if (intent != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve(true) // Successfully launched the app
        } else {
            openPlayStore(packageName)
            promise.reject("APP_NOT_FOUND", "App is not installed") // App not found
        }
    }

    private fun openPlayStore(packageName: String) {
        try {
            // Try opening Play Store app first
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$packageName"))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
        } catch (e: Exception) {
            // If Play Store app isn't available, open in browser
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=$packageName"))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
        }
    }
}
