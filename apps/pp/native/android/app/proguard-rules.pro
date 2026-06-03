# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# More info: https://firebase.google.com/docs/crashlytics/get-deobfuscated-reports?platform=android
-keepattributes SourceFile,LineNumberTable        # Keep file names and line numbers.
-keep public class * extends java.lang.Exception  # Optional: Keep custom exceptions.

# More info: https://confluence.app.betfair/pages/viewpage.action?spaceKey=CHE&title=Proguard
-keep public class com.horcrux.svg.** {*;}

-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.devsupport.** { *; }

# https://github.com/proyecto26/react-native-inappbrowser/issues/174
# We had multiple crashes on the Android Release version when we tried to use inappbrowser.
-keepattributes *Annotation*
-keepclassmembers class ** {
  @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }

# Animal Sniffer compileOnly dependency to ensure APIs are compatible with older versions of Java.
-dontwarn org.jvnet.animal_sniffer.*

# GeoComply exceptions
-dontwarn com.google.**
-keep class com.geocomply.**{ *; }
-keep class com.google.** { *; }
-keep class android.support.** { *; }

-keep interface * {
    @retrofit2.http.* <methods>;
}

# Keep generic type info (so Retrofit can see Call<T>)
-keepattributes Signature
-keepattributes Exceptions
-keepattributes *Annotation*

# Keep Retrofit runtime classes
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }

# Keep OkHttp classes (often needed alongside Retrofit)
-dontwarn okhttp3.**
-keep class okhttp3.** { *; }


# Keep Splunk classes (because of Session Replay)
-dontwarn com.google.auto.value.AutoValue$CopyAnnotations
-dontwarn com.splunk.rum.integration.sessionreplay.SessionReplayModuleConfiguration
-dontwarn io.grpc.**
-dontwarn java.beans.BeanInfo
-dontwarn java.beans.ConstructorProperties
-dontwarn java.beans.FeatureDescriptor
-dontwarn java.beans.IntrospectionException
-dontwarn java.beans.Introspector
-dontwarn java.beans.PropertyDescriptor
-dontwarn java.beans.Transient
-dontwarn org.osgi.annotation.bundle.Export

# Keep OneTrust SDK (to be safe, since it uses Retrofit internally)
-keep class com.onetrust.** { *; }
-dontwarn com.onetrust.**

# Monterosa SDK rules
-keep class co.monterosa.sdk.** { *; }
-dontwarn java.lang.management.**
-dontwarn androidx.window.extensions.**
-dontwarn androidx.window.extensions.embedding.**
-dontwarn androidx.window.sidecar.**
-dontwarn javax.naming.NamingEnumeration
-dontwarn javax.naming.NamingException
-dontwarn javax.naming.directory.Attribute
-dontwarn javax.naming.directory.Attributes
-dontwarn javax.naming.directory.DirContext
-dontwarn javax.naming.directory.InitialDirContext
-dontwarn javax.naming.directory.SearchControls
-dontwarn javax.naming.directory.SearchResult
