package com.betfair.tbd;

// React Native imports
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
// Firebase imports
import com.google.firebase.perf.FirebasePerformance;
import com.google.firebase.perf.metrics.Trace;
// Android imports
import android.os.Handler;
import android.util.Log;
// Java imports
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class TBDPerformanceModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
  // Amount of time to fetch the current UI FPS value
  static final int UPDATE_INTERVAL_MS = 1000;

  // Numbers of FPS samples to collect
  static final int FPS_SAMPLE_SIZE = 5;

  private ArrayList<Double> fpsSamples;

  // FPS tracker
  final FPSTracker fpsTracker;
  // Allows to run a function from time to time
  private Handler handler;
  // Reference to the function running inside the handler
  private Runnable runnable;

  // Tracks if the inner loop of the fps tracker should stop
  private boolean shouldStop = false;
  private boolean isRunning = false;

  // Assume the app is in the foreground by default
  private boolean isInBackground = false;

  TBDPerformanceModule(ReactApplicationContext context) {
    super(context);
    fpsTracker = new FPSTracker();
    fpsSamples = new ArrayList<Double>();
    // Register last to prevent "this" escaping before fields are initialized
    context.addLifecycleEventListener(this);
  }

  @Override
  public String getName() {
    return "TBDPerformanceModule";
  }

  @ReactMethod
  public void startUIFpsTracking() {
    // this module is called on each view change so it means that we're actually resetting
    // the counters, this means we don't actually need to track the page directly which reduces complexity
    if (isRunning || isInBackground) {
      stopUIFpsTracking();
    }

    isRunning = true;
    shouldStop = false;

    // Starts tracker on the UI thread
    fpsTracker.start();
    handler = new Handler();
    runnable = new Runnable() {
      public void run() {
        if (shouldStop || isInBackground) {
          return;
        }

        double currentFrameRate = fpsTracker.getFrameRate();

        if (currentFrameRate > 0) {
          fpsSamples.add(currentFrameRate);
          if (fpsSamples.size() == FPS_SAMPLE_SIZE) {

            double averageValue = fpsSamples
              .stream()
              .mapToDouble(val -> val)
              .average()
              .orElse(0.0);

            //NewRelic.recordMetric("PerformanceFPSNative", TBDCurrentScreenModule.getCurrentScreenStatic(), (float) averageValue);

            Trace traceUIFrameRate = FirebasePerformance.startTrace("FPS");
            traceUIFrameRate.putAttribute("ScreenName", TBDCurrentScreenModule.getCurrentScreenStatic());
            traceUIFrameRate.putMetric("Value", (long) averageValue);
            traceUIFrameRate.stop();

            // Clears all samples
            fpsSamples.clear();
          }
        }

        handler.postDelayed(this, UPDATE_INTERVAL_MS);
      }
    };

    handler.postDelayed(runnable, UPDATE_INTERVAL_MS);
  }

  public void stopUIFpsTracking() {
    shouldStop = true;
    isRunning = false;
    if (handler != null) {
      handler.removeCallbacks(runnable);
    }
    runnable = null;
    fpsTracker.stop();
    fpsSamples.clear();
  }

  @Override
  public void onHostResume() {
    isInBackground = false;
    // loop has been stopped so we need to restart the loop again
    startUIFpsTracking();
  }

  @Override
  public void onHostPause() {
    isInBackground = true;
  }

  @Override
  public void onHostDestroy() {
    // Do nothing as we want to capture metrics and the app is being terminated anyway
  }
}
