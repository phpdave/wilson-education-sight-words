#!/usr/bin/env python3
"""
Generate high-quality audio for word stories
"""

import os
import sys
import requests
import json
import time
from pathlib import Path

class WordStoriesAudioGenerator:
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

    def generate_word_stories_audio(self):
        """Generate audio files for all word stories"""
        word_stories = {
            'her': 'Her name is Sarah.',
            'who': 'Who is at the door?',
            'some': 'I have some cookies.',
            'out': 'Let\'s go out to play.',
            'about': 'Tell me about your day.',
            'too': 'I want to go too!',
            'two': 'I have two cats.',
            'were': 'We were happy yesterday.',
            'what': 'What is your favorite color?',
            'come': 'Come here, please.',
            'comes': 'The bus comes at eight.',
            'coming': 'The train is coming now.',
            'become': 'I want to become a teacher.',
            'becomes': 'She becomes happy when she sings.',
            'becoming': 'The sky is becoming dark.',
            'their': 'Their house is big.',
            'no': 'No, thank you.',
            'so': 'I am so excited!',
            'also': 'I also like pizza.',
            'how': 'How are you today?',
            'now': 'We can play now.',
            'where': 'Where is my book?',
            'here': 'Come here, please.',
            'there': 'The park is over there.',
            'any': 'Do you have any questions?',
            'anywhere': 'We can go anywhere you want.',
            'anyone': 'Anyone can join the game.',
            'anything': 'You can ask me anything.',
            'many': 'There are many flowers.',
            'front': 'The car is in front of the house.',
            'very': 'This cake is very good.',
            'every': 'Every day is special.',
            'everywhere': 'We looked everywhere for the toy.',
            'everyone': 'Everyone is welcome here.',
            'everything': 'Everything will be okay.',
            'could': 'Could you help me, please?',
            'would': 'Would you like some juice?',
            'should': 'You should eat your vegetables.',
            'when': 'When is your birthday?',
            'which': 'Which book do you want?',
            'been': 'I have been waiting for you.',
            'said': 'She said hello to me.',
            'each': 'Each child gets a toy.',
            'asked': 'He asked for help.',
            'why': 'Why did you do that?',
            'by': 'The book is by the window.',
            'my': 'My name is Alex.',
            'try': 'Try your best!',
            'put': 'Put the book on the table.',
            'putting': 'She is putting on her shoes.',
            'only': 'Only one cookie left.',
            'work': 'I work at school.',
            'word': 'This is a new word.',
            'world': 'The world is beautiful.'
        }
        
        print("🎵 Generating word stories audio files...")
        success_count = 0
        
        # Create sentences directory
        sentences_dir = Path("audio/sentences")
        sentences_dir.mkdir(parents=True, exist_ok=True)
        
        for word, story in word_stories.items():
            output_path = sentences_dir / f"{word}-story.mp3"
            if not output_path.exists():
                if self.generate_audio(story, output_path):
                    success_count += 1
                time.sleep(0.5)  # Rate limiting
            else:
                print(f"⏭️  Already exists: {output_path}")
                success_count += 1
        
        print(f"✅ Generated {success_count}/{len(word_stories)} word story audio files")

def main():
    print("🎵 Word Stories Audio Generator 🎵")
    print("=" * 50)
    
    generator = WordStoriesAudioGenerator()
    generator.generate_word_stories_audio()
    
    print("\n🎉 Word stories audio generation complete!")
    print("📋 All word stories will now use high-quality audio instead of browser TTS")

if __name__ == "__main__":
    main()
