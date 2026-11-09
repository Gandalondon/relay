package app.getarcrelay;

import android.Manifest;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.util.ArrayList;
import java.util.List;

/**
 * Relay's speech recognition. Uses the phone's ON-DEVICE recogniser when it has one (Pixel and other Android 12+ phones
 * with an offline English pack), so understanding what you said needs no internet. If the phone has no on-device
 * recogniser, or its English pack isn't downloaded, it falls back to the normal (online) recogniser and asks Android
 * to fetch the offline pack for next time.
 */
@CapacitorPlugin(name = "RelaySpeech", permissions = { @Permission(strings = { Manifest.permission.RECORD_AUDIO }, alias = "mic") })
public class RelaySpeechPlugin extends Plugin {
    private SpeechRecognizer rec;
    private PluginCall pending;
    private boolean triedDownload = false;
    private String lastMode = "";

    private boolean onDeviceAvailable() {
        return Build.VERSION.SDK_INT >= 31 && SpeechRecognizer.isOnDeviceRecognitionAvailable(getContext());
    }

    @PluginMethod
    public void available(PluginCall call) {
        JSObject r = new JSObject();
        r.put("onDevice", onDeviceAvailable());
        r.put("online", SpeechRecognizer.isRecognitionAvailable(getContext()));
        r.put("lastMode", lastMode);
        call.resolve(r);
    }

    /** is the offline English pack on the phone? (Android 13+ can tell us; older phones report "unknown") */
    @PluginMethod
    public void offlineStatus(PluginCall call) {
        final String lang = call.getString("lang", "en-GB");
        if (Build.VERSION.SDK_INT < 33 || !onDeviceAvailable()) { JSObject r = new JSObject(); r.put("state", Build.VERSION.SDK_INT < 33 ? "unknown" : "none"); call.resolve(r); return; }
        getActivity().runOnUiThread(() -> {
            try {
                final SpeechRecognizer probe = SpeechRecognizer.createOnDeviceSpeechRecognizer(getContext());
                probe.checkRecognitionSupport(intent(lang, true), getContext().getMainExecutor(), new android.speech.RecognitionSupportCallback() {
                    @Override public void onSupportResult(android.speech.RecognitionSupport sup) {
                        JSObject r = new JSObject();
                        r.put("state", has(sup.getInstalledOnDeviceLanguages(), lang) ? "installed" : has(sup.getPendingOnDeviceLanguages(), lang) ? "downloading" : has(sup.getSupportedOnDeviceLanguages(), lang) ? "available" : "none");
                        probe.destroy(); call.resolve(r);
                    }
                    @Override public void onError(int error) { JSObject r = new JSObject(); r.put("state", "unknown"); r.put("error", error); probe.destroy(); call.resolve(r); }
                });
            } catch (Throwable e) { JSObject r = new JSObject(); r.put("state", "unknown"); r.put("error", String.valueOf(e.getMessage())); call.resolve(r); }
        });
    }

    private static boolean has(List<String> l, String lang) {
        if (l == null) return false;
        String base = lang.split("-")[0];
        String want = lang.toLowerCase(), b = base.toLowerCase();
        for (String x : l) { if (x == null) continue; String y = x.toLowerCase().replace('_', '-'); if (y.equals(want) || y.equals(b) || y.startsWith(b + "-")) return true; }
        return false;
    }

    /** asks Android to download the offline English pack (it shows its own progress) */
    @PluginMethod
    public void downloadOffline(PluginCall call) {
        final String lang = call.getString("lang", "en-GB");
        if (Build.VERSION.SDK_INT < 33 || !onDeviceAvailable()) { call.reject("not supported"); return; }
        getActivity().runOnUiThread(() -> {
            try { SpeechRecognizer r = SpeechRecognizer.createOnDeviceSpeechRecognizer(getContext()); r.triggerModelDownload(intent(lang, true)); new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> { try { r.destroy(); } catch (Throwable ignored) {} }, 60000); call.resolve(); }
            catch (Throwable e) { call.reject(String.valueOf(e.getMessage())); }
        });
    }

    @PluginMethod
    public void listen(PluginCall call) {
        if (getPermissionState("mic") != PermissionState.GRANTED) { requestPermissionForAlias("mic", call, "micGranted"); return; }
        start(call, onDeviceAvailable());
    }

    @PermissionCallback
    private void micGranted(PluginCall call) {
        if (getPermissionState("mic") != PermissionState.GRANTED) { JSObject r = new JSObject(); r.put("text", ""); r.put("error", "permission"); call.resolve(r); return; }
        start(call, onDeviceAvailable());
    }

    /** words Relay expects on this map (places, exits, ARC), sent as recognition hints on Android 13+ (9 Nov) */
    private ArrayList<String> bias = new ArrayList<>();

    private Intent intent(String lang, boolean onDevice) {
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang);
        i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);  /* up to five guesses: the app tries them in order (9 Nov) */
        i.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
        i.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getContext().getPackageName());
        if (onDevice) i.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true);
        if (Build.VERSION.SDK_INT >= 33 && !bias.isEmpty()) i.putStringArrayListExtra(RecognizerIntent.EXTRA_BIASING_STRINGS, bias);
        return i;
    }

    private void start(PluginCall call, boolean onDevice) {
        final String lang = call.getString("lang", "en-GB");
        bias = new ArrayList<>();
        try { JSArray b = call.getArray("bias"); if (b != null) for (Object o : b.toList()) if (o instanceof String && bias.size() < 200) bias.add((String) o); } catch (Throwable ignored) {}
        getActivity().runOnUiThread(() -> {
            finish(null);
            pending = call;
            try {
                rec = onDevice ? SpeechRecognizer.createOnDeviceSpeechRecognizer(getContext()) : SpeechRecognizer.createSpeechRecognizer(getContext());
            } catch (Throwable e) {
                if (onDevice) { pending = null; start(call, false); return; }
                JSObject r = new JSObject(); r.put("text", ""); r.put("error", "unavailable"); pending = null; call.resolve(r); return;
            }
            final String mode = onDevice ? "on-device" : "online";
            rec.setRecognitionListener(new RecognitionListener() {
                @Override public void onResults(Bundle b) {
                    ArrayList<String> m = b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    JSObject r = new JSObject(); r.put("text", m != null && !m.isEmpty() ? m.get(0) : ""); r.put("mode", mode);
                    JSArray alts = new JSArray(); if (m != null) for (String x : m) alts.put(x); r.put("alts", alts);
                    lastMode = mode; finish(r);
                }
                @Override public void onError(int code) {
                    // the English pack isn't on the phone yet: ask Android to download it, and use the online recogniser this time
                    boolean packMissing = code == 12 || code == 13;  // LANGUAGE_NOT_SUPPORTED, LANGUAGE_UNAVAILABLE
                    if (onDevice && (packMissing || code == SpeechRecognizer.ERROR_CLIENT || code == SpeechRecognizer.ERROR_SERVER)) {
                        if (packMissing && !triedDownload && Build.VERSION.SDK_INT >= 33) {
                            triedDownload = true;
                            try { rec.triggerModelDownload(intent(lang, true)); } catch (Throwable ignored) {}
                        }
                        PluginCall c = pending; pending = null; destroy(); start(c, false); return;
                    }
                    JSObject r = new JSObject(); r.put("text", ""); r.put("mode", mode);
                    r.put("error", code == SpeechRecognizer.ERROR_NO_MATCH || code == SpeechRecognizer.ERROR_SPEECH_TIMEOUT ? "" :
                                   code == SpeechRecognizer.ERROR_NETWORK || code == SpeechRecognizer.ERROR_NETWORK_TIMEOUT ? "network" :
                                   code == SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS ? "permission" : "code " + code);
                    lastMode = mode; finish(r);
                }
                @Override public void onReadyForSpeech(Bundle b) { notifyListeners("ready", new JSObject()); }
                @Override public void onBeginningOfSpeech() {}
                @Override public void onRmsChanged(float v) {}
                @Override public void onBufferReceived(byte[] b) {}
                @Override public void onEndOfSpeech() {}
                @Override public void onPartialResults(Bundle b) {}
                @Override public void onEvent(int t, Bundle b) {}
            });
            rec.startListening(intent(lang, onDevice));
        });
    }

    private void destroy() { if (rec != null) { try { rec.destroy(); } catch (Throwable ignored) {} rec = null; } }

    /** resolve the waiting call (if any) and release the recogniser */
    private void finish(JSObject r) {
        PluginCall c = pending; pending = null;
        destroy();
        if (c != null) { if (r == null) { r = new JSObject(); r.put("text", ""); r.put("error", "replaced"); } c.resolve(r); }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getActivity().runOnUiThread(() -> { if (rec != null) { try { rec.stopListening(); } catch (Throwable ignored) {} } finish(null); call.resolve(); });
    }
}
