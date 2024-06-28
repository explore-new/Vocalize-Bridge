import streamlit as st
import speech_recognition as sr

def voice_to_text():
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()

    with microphone as source:
        st.write("Say something...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    try:
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        st.warning("Could not understand audio.")
        return ""
    except sr.RequestError as e:
        st.error(f"Could not request results from Google Speech Recognition service; {e}")
        return ""

def main():
    st.title("Voice to Text Converter")
    st.subheader("Convert Your Voice to Text")

    # Voice-to-text section
    st.subheader("Voice To Text Converter")
    convert_text = st.text_area("Converted Text")
    click_to_record = st.button("Start Recording")

    if click_to_record:
        recorded_text = voice_to_text()
        st.write("Converted Text:")
        st.write(recorded_text)

if __name__ == '__main__':
    main()
