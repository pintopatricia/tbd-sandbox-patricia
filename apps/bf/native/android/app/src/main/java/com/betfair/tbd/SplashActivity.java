package com.betfair.tbd;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this, MainActivity.class);
        Bundle bundle = this.getIntent().getExtras();
        if (bundle != null) {
          intent.putExtras(bundle);
        }
        startActivity(intent);
        finish();
    }
}
