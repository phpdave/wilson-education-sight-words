#!/usr/bin/env python3
"""
High-Quality Audio Generator for Sight Words Game
Uses ElevenLabs API for premium TTS quality
"""

import os
import sys
import requests
import json
import time
from pathlib import Path

class HighQualityAudioGenerator:
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
            print("Please set ELEVENLABS_API_KEY environment variable or get one from:")
            print("https://elevenlabs.io/app/speech-synthesis")
            sys.exit(1)

    def create_directories(self):
        """Create the audio directory structure"""
        base_path = Path("audio")
        directories = [
            "words",
            "letters", 
            "encouragement",
            "corrections",
            "phrases",
            "sentences",
            "test"
        ]
        
        for directory in directories:
            (base_path / directory).mkdir(parents=True, exist_ok=True)
            print(f"Created directory: audio/{directory}")

    def generate_audio(self, text, output_path, voice_id=None):
        """Generate high-quality audio using ElevenLabs API"""
        try:
            url = f"{self.base_url}/text-to-speech/{voice_id or self.voice_id}"
            
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

    def generate_word_audio(self):
        """Generate audio files for all sight words with optimal pronunciation"""
        words = [
            'her', 'who', 'some', 'out', 'about', 'too', 'two', 'were', 'what', 'come', 
            'comes', 'coming', 'become', 'becomes', 'becoming', 'their', 'no', 'so', 
            'also', 'how', 'now', 'where', 'here', 'there', 'any', 'anywhere', 'anyone', 
            'anything', 'many', 'front', 'very', 'every', 'everywhere', 'everyone', 
            'everything', 'could', 'would', 'should', 'when', 'which', 'been', 'said', 
            'each', 'asked', 'why', 'by', 'my', 'try', 'put', 'putting', 'only', 'work', 
            'word', 'world'
        ]
        
        print("🎵 Generating high-quality word audio files...")
        success_count = 0
        
        for i, word in enumerate(words):
            output_path = f"audio/words/{word}.mp3"
            if not os.path.exists(output_path):
                # Clear, slow pronunciation for children
                text = f"{word}."
                if self.generate_audio(text, output_path):
                    success_count += 1
                
                # Rate limiting - be respectful to API
                if i % 10 == 0 and i > 0:
                    print(f"⏳ Processed {i}/{len(words)} words, pausing...")
                    time.sleep(2)
            else:
                print(f"⏭️  Already exists: {output_path}")
                success_count += 1
        
        print(f"✅ Generated {success_count}/{len(words)} word audio files")

    def generate_letter_audio(self):
        """Generate audio files for each letter with clear pronunciation"""
        letters = 'abcdefghijklmnopqrstuvwxyz'
        
        print("🔤 Generating letter audio files...")
        success_count = 0
        
        for i, letter in enumerate(letters):
            output_path = f"audio/letters/{letter}.mp3"
            if not os.path.exists(output_path):
                # Clear letter pronunciation for children
                text = f"The letter {letter.upper()}. {letter.upper()}."
                if self.generate_audio(text, output_path):
                    success_count += 1
                
                # Rate limiting
                if i % 5 == 0 and i > 0:
                    time.sleep(1)
            else:
                print(f"⏭️  Already exists: {output_path}")
                success_count += 1
        
        print(f"✅ Generated {success_count}/{len(letters)} letter audio files")

    def generate_encouragement_audio(self):
        """Generate encouraging phrases with warm, positive tone"""
        encouragements = [
            "Great job!",
            "Excellent work!",
            "Perfect!",
            "Amazing!",
            "Fantastic!",
            "Wonderful!",
            "Awesome!",
            "Correct!",
            "Nice job!",
            "Well done!",
            "Outstanding!",
            "You got it!"
        ]
        
        print("🎉 Generating encouragement audio files...")
        success_count = 0
        
        for i, encouragement in enumerate(encouragements):
            filename = encouragement.lower().replace('!', '').replace(' ', '-')
            output_path = f"audio/encouragement/{filename}.mp3"
            if not os.path.exists(output_path):
                if self.generate_audio(encouragement, output_path):
                    success_count += 1
                
                # Rate limiting
                if i % 5 == 0 and i > 0:
                    time.sleep(1)
            else:
                print(f"⏭️  Already exists: {output_path}")
                success_count += 1
        
        print(f"✅ Generated {success_count}/{len(encouragements)} encouragement audio files")

    def generate_correction_audio(self):
        """Generate correction phrases with gentle, helpful tone"""
        corrections = [
            "The correct word is",
            "Try again. The word is",
            "Not quite. It's",
            "The word is",
            "Let's try again. The word is",
            "Close! The word is"
        ]
        
        print("🔄 Generating correction audio files...")
        success_count = 0
        
        for i, correction in enumerate(corrections):
            output_path = f"audio/corrections/correction-{i+1}.mp3"
            if not os.path.exists(output_path):
                if self.generate_audio(correction, output_path):
                    success_count += 1
                
                # Rate limiting
                if i % 3 == 0 and i > 0:
                    time.sleep(1)
            else:
                print(f"⏭️  Already exists: {output_path}")
                success_count += 1
        
        print(f"✅ Generated {success_count}/{len(corrections)} correction audio files")

    def generate_test_audio(self):
        """Generate test audio file"""
        test_message = "Hello! This is how I sound. I hope you like my voice!"
        output_path = "audio/test/hello.mp3"
        
        print("🧪 Generating test audio file...")
        if not os.path.exists(output_path):
            if self.generate_audio(test_message, output_path):
                print("✅ Generated test audio file")
        else:
            print(f"⏭️  Already exists: {output_path}")

    def get_available_voices(self):
        """Get list of available voices"""
        try:
            url = f"{self.base_url}/voices"
            headers = {"xi-api-key": self.api_key}
            
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                voices = response.json()
                print("Available voices:")
                for voice in voices['voices']:
                    print(f"  - {voice['name']} (ID: {voice['voice_id']})")
                return voices['voices']
            else:
                print(f"Failed to get voices: {response.status_code}")
                return []
        except Exception as e:
            print(f"Error getting voices: {e}")
            return []

def main():
    """Main function to generate all high-quality audio files"""
    print("🎵 High-Quality Sight Words Audio Generator 🎵")
    print("=" * 50)
    print("Using ElevenLabs API for premium TTS quality")
    print("=" * 50)
    
    # Initialize generator
    generator = HighQualityAudioGenerator()
    
    # Show available voices
    print("\n🔍 Available voices:")
    voices = generator.get_available_voices()
    
    # Create directories
    generator.create_directories()
    
    # Generate all audio files
    print("\n🚀 Starting audio generation...")
    generator.generate_word_audio()
    generator.generate_letter_audio()
    generator.generate_encouragement_audio()
    generator.generate_correction_audio()
    generator.generate_test_audio()
    
    print("\n🎉 High-quality audio generation complete!")
    print("\n📋 Next steps:")
    print("1. Test the audio files in your browser")
    print("2. Update audio.js to use the new MP3 files")
    print("3. Consider using different voices for variety")
    print("4. Monitor your ElevenLabs usage and costs")

if __name__ == "__main__":
    main()
