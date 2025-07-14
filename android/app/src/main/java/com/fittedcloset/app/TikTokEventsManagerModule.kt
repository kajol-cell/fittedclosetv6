package com.fittedcloset.app

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.tiktok.TikTokBusinessSdk
import com.tiktok.appevents.base.EventName
import org.json.JSONArray
import org.json.JSONObject

class TikTokEventsManagerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "TikTokEventsManager"
    }

    @ReactMethod
    fun identify(externalId:String,
                 externalUserName:String,
                 phoneNumber:String,
                 email:String) {
        Log.d("TikTokEventsManager", "identifyUser: externalId: $externalId" +
                ", externalUserName: $externalUserName"
                + ", phoneNumber: $phoneNumber"
                + ", email: $email"
        )
        TikTokBusinessSdk.identify(externalId, externalUserName, phoneNumber, email);

    }


    @ReactMethod
    fun logout() {
        Log.d("TikTokEventsManager", "logout")
        TikTokBusinessSdk.logout()
    }


    @ReactMethod
    fun logEvent(eventName: String, parameters: ReadableMap?) {
        Log.d("TikTokEventsManager", "Event Logged: $eventName with parameters: $parameters")

        // Convert ReadableMap to HashMap
        if (parameters != null) {
            val jsonObject = createJson(parameters);
            // TikTok Business SDK event tracking
            Log.d("TikTokEventsManager", "Sending Test Event")
            TikTokBusinessSdk.trackEvent(eventName, jsonObject);
        }
        else {
            TikTokBusinessSdk.trackEvent(eventName);
        }
        Log.d("TikTokEventsManager", "TikTok Event sent to SDK: $eventName")

    }

    private fun createJson(parameters: ReadableMap): JSONObject {
        val iterator = parameters.keySetIterator()
        val jsonObject = JSONObject()

        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()

            when (parameters.getType(key)) {
                ReadableType.Null -> jsonObject.put(key, JSONObject.NULL)
                ReadableType.Boolean -> jsonObject.put(key, parameters.getBoolean(key))
                ReadableType.Number -> {
                    val number = parameters.getDouble(key)
                    if (number == number.toInt().toDouble()) {
                        jsonObject.put(key, number.toInt())
                    } else {
                        jsonObject.put(key, number)
                    }
                }
                ReadableType.String -> jsonObject.put(key, parameters.getString(key))
                ReadableType.Map -> jsonObject.put(key, createJson(parameters.getMap(key)!!))
                ReadableType.Array -> jsonObject.put(key, convertArray(parameters.getArray(key)!!))
            }
        }

        return jsonObject
    }

    private fun convertArray(array: ReadableArray): JSONArray {
        val jsonArray = JSONArray()
        for (i in 0 until array.size()) {
            when (array.getType(i)) {
                ReadableType.Null -> jsonArray.put(JSONObject.NULL)
                ReadableType.Boolean -> jsonArray.put(array.getBoolean(i))
                ReadableType.Number -> {
                    val number = array.getDouble(i)
                    if (number == number.toInt().toDouble()) {
                        jsonArray.put(number.toInt())
                    } else {
                        jsonArray.put(number)
                    }
                }
                ReadableType.String -> jsonArray.put(array.getString(i))
                ReadableType.Map -> jsonArray.put(array.getMap(i)?.let { createJson(it) })
                ReadableType.Array -> jsonArray.put(array.getArray(i)?.let { convertArray(it) })
            }
        }
        return jsonArray
    }
    }
