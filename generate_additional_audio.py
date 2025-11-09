#!/usr/bin/env python3
"""
Generate additional audio files for dynamic phrases used in the game
"""

import os
import sys
import requests
import json
import time
from pathlib import Path

class AdditionalAudioGenerator:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('ELEVENLABS_API_KEY')
        self.base_url = "https://api.elevenlabs.io/v1"
        self.voice_id = "EXAVITQu4vr4xnSDxMaL"  # Sarah voice (clear woman's voice)
        self.model_id = "eleven_monolingual_v1"  # High quality model
        
        # Audio settings optimized for children's learning - slower and clearer
        self.voice_settings = {
            "stability": 0.75,     # More consistent pronunciation
            "similarity_boost": 0.9,  # Maximum clarity for children
            "style": 0.0,         # Neutral style
            "use_speaker_boost": True
        }
        
        if not self.api_key:
            print("❌ Error: ElevenLabs API key not found!")
            sys.exit(1)

    def generate_audio(self, text, output_path):
        """Generate high-quality audio using ElevenLabs API"""
        try:
            url = f"{self.base_url}/text-to-speech/{self.voice_id}"
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.api_key
            }
            
            data = {
                "text": text,
                "model_id": self.model_id,
                "voice_settings": self.voice_settings
            }
            
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Generated: {output_path}")
                return True
            else:
                print(f"❌ Failed to generate {output_path}: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error generating {output_path}: {e}")
            return False

    def generate_dynamic_phrases(self):
        """Generate audio for dynamic phrases used in the game"""
        phrases = {
            # Game instructions
            "welcome-spelling": "Welcome to the Spelling Challenge! Listen to the word and type it in the box. Click the speaker button if you need to hear the word again.",
            "welcome-scramble": "Welcome to Letter Scramble! Listen to the word and arrange the letters in the correct order. Click the speaker button if you need to hear the word again.",
            "welcome-multiple-choice": "Welcome to Multiple Choice! Listen to the word and click on the correct spelling. Click the speaker button if you need to hear the word again.",
            "welcome-flashcards": "Welcome to Flash Cards! Look at the word and listen to help you remember it. Click 'Show Next Card' when you're ready.",
            "welcome-reading-practice": "Welcome to Reading Practice! Look at the word and try to say it out loud. If you get it wrong, you'll hear the correct pronunciation to help you learn.",
            "welcome-word-cards": "Welcome to Word Cards! Choose Beat the Clock to read words quickly, or Trace, Flip, and Spell to practice spelling.",
            "welcome-self-dictation": "Welcome to Self-Dictation! Read the sentence, then cover it and write it from memory. Check your spelling, punctuation, and capitalization before uncovering.",
            "welcome-oral-fluency": "Welcome to Oral Reading Fluency! Read the sentence out loud. Try to read it three times, getting faster and more fluent each time. After you read, you can hear your recording back.",
            
            # Dynamic feedback phrases
            "good-try-template": "Good try! I heard you say",
            "but-the-word-is": "but the word is",
            "look-at-word-template": "Look at the word and listen to help you remember it. The word is",
            "click-speaker-to-hear": "Click the speaker button to hear the word",
            "the-correct-sentence-is": "The correct sentence is",
            "but-you-wrote": "But you wrote",
            
            # Common error messages
            "didnt-hear-anything": "I didn't hear anything. Please speak clearly and try again!",
            "speech-not-supported": "Speech recognition is not supported on this device. Please use the speaker button to hear the word.",
        }
        
        print("🎵 Generating dynamic phrase audio files...")
        success_count = 0
        
        # Create phrases directory
        phrases_dir = Path("audio/phrases")
        phrases_dir.mkdir(parents=True, exist_ok=True)
        
        for key, text in phrases.items():
            output_path = phrases_dir / f"{key}.mp3"
            if not output_path.exists():
                if self.generate_audio(text, output_path):
                    success_count += 1
                time.sleep(0.5)  # Rate limiting
            else:
                print(f"⏭️  Already exists: {output_path}")
                success_count += 1
        
        print(f"✅ Generated {success_count}/{len(phrases)} dynamic phrase audio files")

def main():
    print("🎵 Additional Audio Generator for Dynamic Phrases 🎵")
    print("=" * 60)
    
    generator = AdditionalAudioGenerator()
    generator.generate_dynamic_phrases()
    
    print("\n🎉 Additional audio generation complete!")
    print("📋 These phrases will now use high-quality audio instead of browser TTS")

if __name__ == "__main__":
    main()
