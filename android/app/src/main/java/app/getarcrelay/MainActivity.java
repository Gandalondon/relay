package app.getarcrelay;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import androidx.activity.EdgeToEdge;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    /* Android's start icon stays up until Relay has drawn its first frame (or 2.5 s), so there's no blank flash between them */
    static volatile boolean appReady = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        final long t0 = System.currentTimeMillis();
        appReady = false;
        SplashScreen sp = SplashScreen.installSplashScreen(this);
        sp.setKeepOnScreenCondition(() -> !appReady && System.currentTimeMillis() - t0 < 2500);
        // hand over instantly: Android's default exit fades its icon out first, which showed as a dip to black before Relay (4 Nov)
        sp.setOnExitAnimationListener(view -> view.remove());
        registerPlugin(SystemBarsPlugin.class);
        registerPlugin(RelayVoicePlugin.class);
        registerPlugin(RelayAIPlugin.class);
        registerPlugin(RelayOfflineVoicePlugin.class);
        registerPlugin(RelaySpeechPlugin.class);
        registerPlugin(RelayWakePlugin.class);
        super.onCreate(savedInstanceState);
        // Keep the screen on while Spottr is open beside the game.
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        // 10 Nov, API 36: Android 15+ always draws apps edge to edge and ignores bar colours. As in Sniff, the content is padded
        // clear of the bars and the window behind them takes the screen's colour (SystemBarsPlugin sets it), so it looks as before.
        EdgeToEdge.enable(this);
        View content = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(content, (v, insets) -> {
            Insets sys = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            v.setPadding(sys.left, sys.top, sys.right, sys.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
        ViewCompat.requestApplyInsets(content);
        // No grey bar: system bars start navy, then follow the screen.
        SystemBarsPlugin.apply(getWindow(), Color.parseColor("#1C1E22"), false);
    }
}
