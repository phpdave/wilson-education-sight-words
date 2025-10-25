#!/usr/bin/env python3
"""
Simple High-Quality Audio Generator for Sight Words Game
Uses curl instead of requests to avoid dependency issues
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path

class SimpleAudioGenerator:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('ELEVENLABS_API_KEY')
        self.voice_id = "pNInz6obpgDQGcFmaJgB"  # Adam voice (good for children)
        self.model_id = "eleven_monolingual_v1"  # High quality model
        
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
            "test"
        ]
        
        for directory in directories:
            (base_path / directory).mkdir(parents=True, exist_ok=True)
            print(f"Created directory: audio/{directory}")

    def generate_audio(self, text, output_path):
        """Generate high-quality audio using ElevenLabs API via curl"""
        try:
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}"
            
            # Prepare the JSON data
            data = {
                "text": text,
                "model_id": self.model_id,
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.8,
                    "style": 0.0,
                    "use_speaker_boost": True
                }
            }
            
            # Create curl command
            curl_cmd = [
                "curl",
                "-X", "POST",
                url,
                "-H", "Accept: audio/mpeg",
                "-H", "Content-Type: application/json",
                "-H", f"xi-api-key: {self.api_key}",
                "-d", json.dumps(data),
                "-o", str(output_path)
            ]
            
            # Execute curl command
            result = subprocess.run(curl_cmd, capture_output=True, text=True)
            
            if result.returncode == 0 and os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                print(f"✅ Generated: {output_path}")
                return True
            else:
                print(f"❌ Failed to generate {output_path}")
                print(f"Curl error: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error generating {output_path}: {e}")
            return False

    def generate_word_audio(self):
        """Generate audio files for all sight words"""
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
                text = f"{word}."
                if self.generate_audio(text, output_path):
                    success_count += 1
                
                # Rate limiting - be respectful to API
                if i % 5 == 0 and i > 0:
                    print(f"⏳ Processed {i}/{len(words)} words, pausing...")
                    time.sleep(2)
            else:
                print(f"⏭️  Already exists: {output_path}")
                success_count += 1
        
        print(f"✅ Generated {success_count}/{len(words)} word audio files")

    def generate_letter_audio(self):
        """Generate audio files for each letter"""
        letters = 'abcdefghijklmnopqrstuvwxyz'
        
        print("🔤 Generating letter audio files...")
        success_count = 0
        
        for i, letter in enumerate(letters):
            output_path = f"audio/letters/{letter}.mp3"
            if not os.path.exists(output_path):
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
        """Generate encouraging phrases"""
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
                if i % 3 == 0 and i > 0:
                    time.sleep(1)
            else:
                print(f"⏭️  Already exists: {output_path}")
                success_count += 1
        
        print(f"✅ Generated {success_count}/{len(encouragements)} encouragement audio files")

    def generate_correction_audio(self):
        """Generate correction phrases"""
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

def main():
    """Main function to generate all high-quality audio files"""
    print("🎵 Simple High-Quality Sight Words Audio Generator 🎵")
    print("=" * 60)
    print("Using ElevenLabs API via curl for premium TTS quality")
    print("=" * 60)
    
    # Initialize generator
    generator = SimpleAudioGenerator()
    
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
    print("2. The audio.js file is already updated to use these MP3 files")
    print("3. Monitor your ElevenLabs usage and costs")

if __name__ == "__main__":
    main()
