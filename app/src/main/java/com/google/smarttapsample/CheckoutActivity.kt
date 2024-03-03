/*
 * Copyright 2022 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.smarttapsample

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

import com.google.android.gms.pay.Pay
import com.google.android.gms.pay.PayApiAvailabilityStatus
import com.google.android.gms.pay.PayClient
import com.google.smarttapsample.databinding.ActivityCheckoutBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import java.lang.RuntimeException

private const val REQUEST_CODE_ADD_TO_WALLET = 1000
private const val WALLET_OBJECT_ASSET_FILENAME = "wallet_object_jwt.token"

/**
 * Checkout implementation for the app
 */
class CheckoutActivity : AppCompatActivity() {

    private lateinit var walletClient: PayClient
    private lateinit var binding: ActivityCheckoutBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityCheckoutBinding.inflate(layoutInflater)
        setContentView(binding.root)

        walletClient = Pay.getClient(this)
        fetchCanUseGoogleWalletApi()

        binding.walletButtonContainer.addToWallet.setOnClickListener {
            addPassToWallet()
        }
    }

    private fun addPassToWallet() = MainScope().launch(Dispatchers.IO) {
        try {
            // TODO generate your own Wallet pass JWT and add it in the file read
            assets.open(WALLET_OBJECT_ASSET_FILENAME).bufferedReader().use {
                it.readText().also {
                    if (it.isEmpty()) {
                        throw RuntimeException("Missing wallet pass")
                    }
                }
            }
        } catch (e: Exception) {
            null
        }?.let {
            walletClient.savePassesJwt(it, this@CheckoutActivity, REQUEST_CODE_ADD_TO_WALLET)
        } ?: launch(Dispatchers.Main) {
            Toast.makeText(this@CheckoutActivity, "No pass object available", Toast.LENGTH_LONG).show()
        }
    }

    // Create a method to check for the Google Wallet SDK and API
    private fun fetchCanUseGoogleWalletApi() {
        walletClient
            .getPayApiAvailabilityStatus(PayClient.RequestType.SAVE_PASSES)
            .addOnSuccessListener { status ->
                if (status == PayApiAvailabilityStatus.AVAILABLE)
                    binding.walletButtonContainer.root.visibility = View.VISIBLE
            }
            .addOnFailureListener {
                // Hide the button and optionally show an error message
            }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_CODE_ADD_TO_WALLET) {
            when (resultCode) {
                RESULT_OK -> {
                    // Pass saved successfully. Consider informing the user.
                }

                RESULT_CANCELED -> {
                    // Save canceled
                }

                PayClient.SavePassesResult.SAVE_ERROR ->
                    data?.let { intentData ->
                        val errorMessage = intentData.getStringExtra(PayClient.EXTRA_API_ERROR_MESSAGE)
                        // Handle error. Consider informing the user.
                        Log.e("SavePassesResult", errorMessage.toString())
                    }

                else -> {
                    // Handle unexpected (non-API) exception
                }
            }
        }
    }
}
