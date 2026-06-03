package com.paddypower.tbd;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

// Based on detox implementation: https://github.com/wix/Detox/blob/master/detox/test/android/app/src/main/java/com/example/NativeModule.java#L82
public class LaunchArgumentsModule extends ReactContextBaseJavaModule {

  private static final String NAME = "LaunchArgumentsModule";

  private ReactApplicationContext reactContext;

  LaunchArgumentsModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void getLaunchArguments(Promise promise) {
    Bundle extras = getIntentExtras();
    WritableMap launchArgsMap = Arguments.fromBundle(extras);
    promise.resolve(launchArgsMap);
  }

  private Bundle getIntentExtras() {
    final Activity currentActivity = getCurrentActivity();
    if (currentActivity == null) {
      return new Bundle();
    }
    final Intent intent = currentActivity.getIntent();
    Bundle bundle = intent.getExtras();
    if (bundle != null) {
      return createShallowBundleWithSafeKeyTypes(bundle);
    }
    return new Bundle();
  }

  /**
   * React Native's `Arguments.fromBundle` implementation does not handle conversions for BinderProxy and UserHandle
   * types. The app, when launched using an external link, may contain intent extras with such types. `Arguments.fromBundle`
   * would throw an `IllegalArgumentException` exception leading the app to crash. To prevent the crash and yet preserve
   * the original bundle, we are retaining only key types that can be safely processed by `Arguments.fromBundle`.
   *
   * @param originalBundle app launch intent bundle
   * @return a valid bundle as input for `Arguments.fromBundle`.
   */
  private Bundle createShallowBundleWithSafeKeyTypes(Bundle originalBundle) {
    Bundle filteredBundle = (Bundle) originalBundle.clone();
    for (String key : originalBundle.keySet()) {
      Object value = originalBundle.get(key);
      if (!isSafeKeyType(value)) {
        filteredBundle.remove(key);
      }
    }
    return filteredBundle;
  }

  /**
   * Ensures that `value` is a safe key type. For now, we will restrict launch arguments to primitive types. If we need
   * at some point to handle more complex cases, we should first check if `Arguments.fromBundle` can take that value.
   *
   * @param value key value which can hold primitive and non primitive types.
   * @return truthy if value is a type supported by React Native.
   */
  private boolean isSafeKeyType(Object value) {
    return value != null && (
      value instanceof String ||
        value instanceof Number ||
        value instanceof Integer ||
        value instanceof Boolean
    );
  }
}

