package com.google.smarttapsample

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.smarttapsample.databinding.ActivityLauncherBinding

class LauncherActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val binding = ActivityLauncherBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.launcherCheckout.setOnClickListener {
            startActivity(Intent(this, CheckoutActivity::class.java))
        }

        binding.launcherReading.setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
        }
    }
}
