#!/usr/bin/env python3
"""
Generate Audio Files for Sentence Variations
Uses ElevenLabs API to generate MP3 files for all 3 sentence variations of each word
"""

import os
import sys
import requests
import json
import time
from pathlib import Path

class SentenceVariationsAudioGenerator:
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
                # Ensure directory exists
                output_path = Path(output_path)
                output_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Save audio file
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                
                print(f"✅ Generated: {output_path}")
                return True
            else:
                print(f"❌ Error generating {output_path}: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error generating {output_path}: {e}")
            return False

    def generate_sentence_variations_audio(self):
        """Generate audio files for all sentence variations"""
        word_stories = {
            'her': ['Her name is Sarah.', 'Her dog is very friendly.', 'Her favorite color is blue.'],
            'who': ['Who is at the door?', 'Who wants to play?', 'Who made this cake?'],
            'some': ['I have some cookies.', 'Can I have some water?', 'Some kids like to read.'],
            'out': ['Let\'s go out to play.', 'The cat ran out the door.', 'It is sunny out today.'],
            'about': ['Tell me about your day.', 'What is this book about?', 'I know about that game.'],
            'too': ['I want to go too!', 'This cake is too sweet.', 'She likes ice cream too.'],
            'two': ['I have two cats.', 'Two plus two equals four.', 'We have two minutes left.'],
            'were': ['We were happy yesterday.', 'They were playing outside.', 'Where were you?'],
            'what': ['What is your favorite color?', 'What time is it?', 'What did you say?'],
            'come': ['Come here, please.', 'Come and see this!', 'When will you come?'],
            'comes': ['The bus comes at eight.', 'Spring comes after winter.', 'She comes to school early.'],
            'coming': ['The train is coming now.', 'I am coming right away.', 'Winter is coming soon.'],
            'become': ['I want to become a teacher.', 'The sky will become dark.', 'You can become anything.'],
            'becomes': ['She becomes happy when she sings.', 'The day becomes warmer.', 'He becomes a good friend.'],
            'becoming': ['The sky is becoming dark.', 'I am becoming stronger.', 'The weather is becoming cold.'],
            'their': ['Their house is big.', 'Their dog is very cute.', 'Their favorite game is fun.'],
            'no': ['No, thank you.', 'No, I do not want that.', 'There is no time left.'],
            'so': ['I am so excited!', 'It is so hot today.', 'You are so kind.'],
            'also': ['I also like pizza.', 'She also wants to play.', 'We also have cookies.'],
            'how': ['How are you today?', 'How do you do that?', 'How many are there?'],
            'now': ['We can play now.', 'I want to go now.', 'It is time to eat now.'],
            'where': ['Where is my book?', 'Where are you going?', 'Where did it go?'],
            'here': ['Come here, please.', 'I am here with you.', 'Put it here on the table.'],
            'there': ['The park is over there.', 'There are many flowers.', 'Look there at the sky.'],
            'any': ['Do you have any questions?', 'I do not have any cookies.', 'Any time is fine.'],
            'anywhere': ['We can go anywhere you want.', 'I cannot find it anywhere.', 'You can sit anywhere.'],
            'anyone': ['Anyone can join the game.', 'Is anyone here?', 'Anyone can learn to read.'],
            'anything': ['You can ask me anything.', 'I do not want anything.', 'Anything is possible.'],
            'many': ['There are many flowers.', 'How many do you want?', 'Many kids like to play.'],
            'front': ['The car is in front of the house.', 'Stand in front of the line.', 'The front door is open.'],
            'very': ['This cake is very good.', 'I am very happy today.', 'It is very cold outside.'],
            'every': ['Every day is special.', 'Every child gets a cookie.', 'Every book is different.'],
            'everywhere': ['We looked everywhere for the toy.', 'Flowers grow everywhere.', 'I see it everywhere.'],
            'everyone': ['Everyone is welcome here.', 'Everyone likes to play.', 'Everyone can learn.'],
            'everything': ['Everything will be okay.', 'Everything looks good.', 'I like everything here.'],
            'could': ['Could you help me, please?', 'I could do that tomorrow.', 'Could we play now?'],
            'would': ['Would you like some juice?', 'I would like to go.', 'Would that be okay?'],
            'should': ['You should eat your vegetables.', 'Should we go now?', 'I should finish my work.'],
            'when': ['When is your birthday?', 'When will you come?', 'When did that happen?'],
            'which': ['Which book do you want?', 'Which way should we go?', 'Which one is yours?'],
            'been': ['I have been waiting for you.', 'Have you been here before?', 'It has been a long day.'],
            'said': ['She said hello to me.', 'He said it was fun.', 'I said yes to the game.'],
            'each': ['Each child gets a cookie.', 'Each day is different.', 'Each book has a story.'],
            'asked': ['He asked a good question.', 'She asked for help.', 'I asked my teacher.'],
            'why': ['Why is the sky blue?', 'Why did you do that?', 'Why are you sad?'],
            'by': ['The book is by my bed.', 'I will be there by three.', 'Stand by the door.'],
            'my': ['My favorite color is blue.', 'My dog is very friendly.', 'My friend likes to read.'],
            'try': ['Try your best!', 'I will try to help.', 'Try this game, it is fun.'],
            'put': ['Put the toy in the box.', 'Put your coat on.', 'I put the book away.'],
            'putting': ['I am putting on my shoes.', 'She is putting away toys.', 'We are putting up decorations.'],
            'only': ['Only five minutes left!', 'I only have one cookie.', 'Only you can do this.'],
            'work': ['I work hard at school.', 'This will work well.', 'The work is done.'],
            'word': ['This is a new word.', 'What does this word mean?', 'I know that word.'],
            'world': ['The world is beautiful.', 'People all over the world.', 'The whole world is watching.']
        }
        
        print("🎵 Generating sentence variations audio files...")
        print(f"📝 Total words: {len(word_stories)}")
        print(f"📝 Total sentences: {sum(len(sentences) for sentences in word_stories.values())}")
        print()
        
        success_count = 0
        total_count = 0
        
        # Create sentences directory
        sentences_dir = Path("audio/sentences")
        sentences_dir.mkdir(parents=True, exist_ok=True)
        
        for word, sentences in word_stories.items():
            for index, sentence in enumerate(sentences):
                total_count += 1
                # File naming: {word}-sentence-{index}.mp3
                output_path = sentences_dir / f"{word}-sentence-{index}.mp3"
                
                if not output_path.exists():
                    print(f"🎤 [{total_count}] Generating: {word}-sentence-{index}.mp3")
                    print(f"   Text: \"{sentence}\"")
                    if self.generate_audio(sentence, output_path):
                        success_count += 1
                    time.sleep(0.5)  # Rate limiting
                else:
                    print(f"⏭️  [{total_count}] Already exists: {output_path}")
                    success_count += 1
        
        print()
        print(f"✅ Generated {success_count}/{total_count} sentence variation audio files")
        print(f"📁 Files saved to: {sentences_dir}")

def main():
    print("🎵 Sentence Variations Audio Generator 🎵")
    print("=" * 50)
    print()
    
    generator = SentenceVariationsAudioGenerator()
    generator.generate_sentence_variations_audio()
    
    print()
    print("=" * 50)
    print("✨ Done!")

if __name__ == "__main__":
    main()

