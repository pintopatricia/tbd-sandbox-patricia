package com.skybet.tbd;

import android.annotation.SuppressLint;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.urbanairship.UAirship;

public class AirshipConfigModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  AirshipConfigModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "AirshipConfigModule";
  }

  @SuppressLint("RestrictedApi")
  @ReactMethod
  public void getAppKey(Promise promise) {
      promise.resolve(UAirship.shared().getRuntimeConfig().getConfigOptions().appKey);
  }
}
