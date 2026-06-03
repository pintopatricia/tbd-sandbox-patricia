package com.skybet.tbd;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // For forcing Light Mode always
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);

        Intent intent = new Intent(this, MainActivity.class);
        Bundle bundle = this.getIntent().getExtras();
        if (bundle != null) {
          intent.putExtras(bundle);
        }
        startActivity(intent);
        finish();
    }
}
