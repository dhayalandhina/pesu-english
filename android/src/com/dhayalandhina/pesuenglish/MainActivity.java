package com.dhayalandhina.pesuenglish;

import android.Manifest;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.speech.tts.TextToSpeech;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

// Pesu English for Android: the phone edition (GitHub Pages) in a full-screen WebView, plus what a
// browser normally gives it: mic/camera permission, screen kept on during a call, text-to-speech for
// the "listen" buttons, backup download and the restore file picker. The app itself updates with the site.
public class MainActivity extends Activity {
    static final String HOST = "dhayalandhina.github.io";
    static final String HOME = "https://" + HOST + "/pesu-english/";
    static final int REQ_PERMS = 1;
    static final int REQ_FILE = 2;

    // Browser features the page uses that Android's WebView doesn't have: bridged to Android below.
    static final String POLYFILL = "(function(){if(!window.PesuAndroid||window.__pesuAndroid)return;window.__pesuAndroid=1;"
        + "if(!('speechSynthesis' in window)){"
        + "window.SpeechSynthesisUtterance=function(t){this.text=String(t||'');this.lang='en-IN';this.rate=1;this.voice=null;};"
        + "window.speechSynthesis={getVoices:function(){return[]},cancel:function(){PesuAndroid.stopSpeak()},"
        + "speak:function(u){PesuAndroid.speak(String(u.text||''),String(u.lang||'en-IN'),Number(u.rate)||1)}};}"
        + "if(!('wakeLock' in navigator)){navigator.wakeLock={request:function(){PesuAndroid.keepAwake(true);"
        + "return Promise.resolve({released:false,addEventListener:function(){},"
        + "release:function(){PesuAndroid.keepAwake(false);return Promise.resolve();}});}};}"
        + "var click=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){var a=this;"
        + "if(a.download&&String(a.href).indexOf('blob:')===0){"
        + "fetch(a.href).then(function(r){return r.text()}).then(function(t){PesuAndroid.saveFile(a.download,t)});return;}"
        + "return click.apply(a,arguments);};})();";

    WebView web;
    PermissionRequest pending;
    ValueCallback<Uri[]> fileCb;
    TextToSpeech tts;
    volatile boolean ttsReady;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);            // progress + key live in localStorage
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);

        web.addJavascriptInterface(new Bridge(), "PesuAndroid");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                String path = u.getPath() == null ? "" : u.getPath();
                if (HOST.equals(u.getHost()) && path.startsWith("/pesu-english")) return false;
                // anything else (OpenAI key page, billing) opens in the phone's browser
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception e) { /* no browser */ }
                return true;
            }

            @Override
            public void onPageFinished(WebView v, String url) {
                v.evaluateJavascript(POLYFILL, null);
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest req) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() { askAndroid(req); }
                });
            }

            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("*/*");                  // backup files from WhatsApp/Drive often have odd types; the page checks the content
                try {
                    startActivityForResult(Intent.createChooser(i, "Backup file"), REQ_FILE);
                    return true;
                } catch (Exception e) {
                    fileCb = null;
                    return false;
                }
            }
        });

        tts = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) { ttsReady = status == TextToSpeech.SUCCESS; }
        });

        if (state != null) web.restoreState(state);
        else web.loadUrl(HOME);
    }

    // ---- mic / camera: only for our own page, only what it asked for ----
    void askAndroid(PermissionRequest req) {
        if (req.getOrigin() == null || !HOST.equals(req.getOrigin().getHost())) { req.deny(); return; }
        List<String> need = new ArrayList<>();
        for (String r : req.getResources()) {
            String p = androidPermission(r);
            if (p != null && checkSelfPermission(p) != PackageManager.PERMISSION_GRANTED) need.add(p);
        }
        if (need.isEmpty()) { grantAllowed(req); return; }
        if (pending != null) pending.deny();
        pending = req;
        requestPermissions(need.toArray(new String[0]), REQ_PERMS);
    }

    static String androidPermission(String resource) {
        if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) return Manifest.permission.RECORD_AUDIO;
        if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)) return Manifest.permission.CAMERA;
        return null;
    }

    void grantAllowed(PermissionRequest req) {
        List<String> ok = new ArrayList<>();
        for (String r : req.getResources()) {
            String p = androidPermission(r);
            if (p != null && checkSelfPermission(p) == PackageManager.PERMISSION_GRANTED) ok.add(r);
        }
        if (ok.isEmpty()) req.deny();
        else req.grant(ok.toArray(new String[0]));
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] results) {
        super.onRequestPermissionsResult(code, perms, results);
        if (code == REQ_PERMS && pending != null) {
            PermissionRequest p = pending;
            pending = null;
            grantAllowed(p);
        }
    }

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);
        if (code == REQ_FILE && fileCb != null) {
            fileCb.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result, data));
            fileCb = null;
        }
    }

    // ---- backup file -> Downloads ----
    String save(String name, String text) {
        String safe = String.valueOf(name).replaceAll("[^A-Za-z0-9._-]", "_");
        if (!safe.endsWith(".json")) safe += ".json";
        byte[] data = String.valueOf(text).getBytes(StandardCharsets.UTF_8);
        try {
            if (Build.VERSION.SDK_INT >= 29) {
                ContentValues v = new ContentValues();
                v.put(MediaStore.MediaColumns.DISPLAY_NAME, safe);
                v.put(MediaStore.MediaColumns.MIME_TYPE, "application/json");
                v.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                if (uri == null) return null;
                try (OutputStream o = getContentResolver().openOutputStream(uri)) {
                    if (o == null) return null;
                    o.write(data);
                }
                return "Download/" + safe;
            }
            File dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
            if (dir == null) return null;
            File f = new File(dir, safe);
            try (FileOutputStream o = new FileOutputStream(f)) { o.write(data); }
            return f.getAbsolutePath();
        } catch (Exception e) {
            return null;
        }
    }

    // ---- what the page can call (window.PesuAndroid) ----
    class Bridge {
        @JavascriptInterface
        public void speak(String text, String lang, double rate) {
            if (tts == null || !ttsReady) return;
            Locale loc = new Locale("en", "IN");
            if (tts.isLanguageAvailable(loc) < TextToSpeech.LANG_AVAILABLE) loc = Locale.US;
            tts.setLanguage(loc);
            tts.setSpeechRate((float) Math.max(0.5, Math.min(1.5, rate)));
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "pesu");
        }

        @JavascriptInterface
        public void stopSpeak() {
            if (tts != null) tts.stop();
        }

        @JavascriptInterface
        public void keepAwake(final boolean on) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                    else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
            });
        }

        @JavascriptInterface
        public void saveFile(final String name, final String text) {
            final String where = save(name, text);
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(MainActivity.this, where != null ? "Backup save aayiduchu: " + where : "Backup save aagala", Toast.LENGTH_LONG).show();
                }
            });
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (tts != null) tts.shutdown();
        if (web != null) web.destroy();
        super.onDestroy();
    }
}
