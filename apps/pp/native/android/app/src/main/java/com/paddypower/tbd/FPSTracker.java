package com.paddypower.tbd;

import androidx.annotation.Nullable;
import android.view.Choreographer;
import com.facebook.react.bridge.UiThreadUtil;

// By extending Choreographer we inherit functionaly that allows us to run a callback on every UI frame
public class FPSTracker implements Choreographer.FrameCallback {
  private boolean shouldStop = false;
  private long firstFrameTime = -1;
  private long lastFrameTime = -1;
  private int numFrameCallbacks = -1;

  private double frameRate;

  private @Nullable Choreographer mChoreographer;

  public void start() {
    shouldStop = false;

    final FPSTracker fpsCallback = this;

    UiThreadUtil.runOnUiThread(
      new Runnable() {
        @Override
        public void run() {
          mChoreographer = Choreographer.getInstance();
          mChoreographer.postFrameCallback(fpsCallback);
      }
    });
  }

  public void stop() {
    shouldStop = true;

    if (mChoreographer != null) {
      mChoreographer.removeFrameCallback(this);
    }
  }

  // Function that is called at each render frame of the UI thread
  @Override
  public void doFrame(long frameTimeNanos) {
    if (shouldStop) {
      return;
    }

    numFrameCallbacks++;

    if (firstFrameTime == -1) {
      firstFrameTime = frameTimeNanos;

      // Whenever there is a positive time difference between frames we calculate and set the current frame rate
    } else if ( frameTimeNanos - firstFrameTime >= 1 ) {
      lastFrameTime = frameTimeNanos;

      frameRate = getFPS();

      reset();
    }

    if (mChoreographer != null) {
      mChoreographer.postFrameCallback(this);
    }
  }

  public void reset() {
    firstFrameTime = -1;
    lastFrameTime = -1;
    numFrameCallbacks = -1;
  }

  private double getFPS() {
    if (lastFrameTime == firstFrameTime) {
      return 0;
    }

    // To get the current frame rate we divide the number of frames by the elapsed time.
    // Because we get the time in nanoseconds, we have to multipy the number of frames by 1e9
    return ((double) (numFrameCallbacks * 1e9) / ( lastFrameTime  - firstFrameTime));
  }

  public double getFrameRate() {
    return frameRate;
  }
}
