package com.paddypower.tbd;

import android.os.SystemClock;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = "RCTStartupTime")
public class RCTStartupTime extends ReactContextBaseJavaModule implements LifecycleEventListener {
  public static final String NAME = "StartupTime";

  private enum LifecycleState {
    CREATED,
    RESUMED,
    PAUSED,
    DESTROYED
  }

  private final long startupTimeMark;
  private boolean paused;
  private LifecycleState currentState = LifecycleState.CREATED;

  public RCTStartupTime(ReactApplicationContext reactContext) {
    super(reactContext);
    this.startupTimeMark = SystemClock.elapsedRealtime();
    reactContext.addLifecycleEventListener(this);
  }

  @Override
  public void onHostResume() {
    this.currentState = LifecycleState.RESUMED;
  }

  @Override
  public void onHostPause() {
    this.currentState = LifecycleState.PAUSED;
    this.paused = true;
  }

  @Override
  public void onHostDestroy() {
    this.currentState = LifecycleState.DESTROYED;
  }

  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void getTimeSinceStartup(Promise promise) {
    try {
      WritableMap result = Arguments.createMap();
      long currentTimeMark = SystemClock.elapsedRealtime();
      int startupTimeDelta = (int) (currentTimeMark - this.startupTimeMark);
      result.putBoolean("isColdStartup", this.isColdStartup());
      result.putInt("time", startupTimeDelta);
      promise.resolve(result);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  /**
   * Until app is not PAUSED and the last state recorded is RESUMED, we can tell that the app was cold started the last
   * time it launched. After being in PAUSED state, it may warm or hot start when brought back to the foreground.
   * Cold start: (comes into foreground) > onCreate > onResume
   * Warm start: (goes into background) > onPause > onDestroy | (comes into foreground) > onResume
   * Hot start: (goes into background) > onPause | (comes into foreground) onResume
   * @return
   */
  private Boolean isColdStartup() {
    return this.currentState == LifecycleState.RESUMED && !this.paused;
  }
}
