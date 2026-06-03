package com.skybet.tbd;

// React Native imports
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class TBDCurrentScreenModule extends ReactContextBaseJavaModule {
  private static String currentScreen = "InitialLoad";

  public TBDCurrentScreenModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "TBDCurrentScreenModule";
  }

  @ReactMethod
  public void setCurrentScreen(String activityName) {
    currentScreen = activityName;
  }

  public static String getCurrentScreenStatic() {
    return currentScreen.replace(":", "_");
  }
}
