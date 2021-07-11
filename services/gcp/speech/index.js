const gSpeechClient = require("../../../config/gcp/speech");

async function synthesizer(content) {
  try {
    if (!content || typeof content !== "string") return undefined;
    const request = {
      input: { text: content },
      voice: {
        languageCode: "en-US",
        ssmlGender: "FEMALE",
        voiceName: "en-US-Standard-F",
      },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await gSpeechClient.synthesizeSpeech(request);
    return response.audioContent;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = synthesizer;
