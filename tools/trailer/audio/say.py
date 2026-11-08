"""say.py <sid> <text> <out.wav> [speed, default 1.3 = Faster]  Supertonic 3 through sherpa-onnx, as in the app (sids: F 0-4, M 5-9)."""
import sys, sherpa_onnx, soundfile as sf
D = "/home/claude/voices/sherpa-onnx-supertonic-3-tts-int8-2026-05-11/"
s = sherpa_onnx.OfflineTtsSupertonicModelConfig(duration_predictor=D+"duration_predictor.int8.onnx", text_encoder=D+"text_encoder.int8.onnx",
    vector_estimator=D+"vector_estimator.int8.onnx", vocoder=D+"vocoder.int8.onnx", tts_json=D+"tts.json", unicode_indexer=D+"unicode_indexer.bin", voice_style=D+"voice.bin")
tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(supertonic=s, num_threads=4)))
a = tts.generate(sys.argv[2], sid=int(sys.argv[1]), speed=float(sys.argv[4]) if len(sys.argv) > 4 else 1.3)  # 1.3 = the app's Faster
sf.write(sys.argv[3], a.samples, a.sample_rate); print(sys.argv[3], round(len(a.samples)/a.sample_rate, 2), "s")
