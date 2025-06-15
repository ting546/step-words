export default async function Speech(text, lang) {
  const utterance =  new  SpeechSynthesisUtterance(text);

  let voices =  speechSynthesis.getVoices();

  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
  }
  if (lang === "ru-RU") {
    utterance.voice = voices.find(
      (voice) => voice.lang === "ru-RU" && voice.name === "Google русский"
    );
  } else {
    utterance.voice = voices.find(
      (voice) => voice.lang === "en-US" && voice.name === "Google US English"
    );
  }

  speechSynthesis.speak(utterance);
}
