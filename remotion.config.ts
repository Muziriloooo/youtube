import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setAudioCodec("aac");
Config.setChromiumOpenGlRenderer("angle");
Config.setBrowserExecutable("/usr/bin/chromium");
Config.setConcurrency(4);
Config.setOverwriteOutput(true);
