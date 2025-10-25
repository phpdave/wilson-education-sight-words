#!/usr/bin/env python3
"""
Test script to generate a single word with improved voice settings
"""

import os
import sys
import requests
import json
from pathlib import Path

def test_voice():
    """Generate a test word with improved settings"""
    api_key = os.getenv('ELEVENLABS_API_KEY')
    if not api_key:
        print("❌ Error: ElevenLabs API key not found!")
        return
    
    # Use Sarah voice (woman's voice) with improved settings
    voice_id = "EXAVITQu4vr4xnSDxMaL"  # Sarah voice
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }
    
    # Improved settings for children's learning
    data = {
        "text": "her",
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.75,     # More consistent pronunciation
            "similarity_boost": 0.9,  # Maximum clarity for children
            "style": 0.0,         # Neutral style
            "use_speaker_boost": True
        }
    }
    
    # Create test directory
    Path("audio/test").mkdir(parents=True, exist_ok=True)
    
    try:
        print("🎵 Generating test audio with Sarah voice (woman's voice)...")
        print("📝 Settings: Slower, clearer pronunciation for children")
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            output_path = "audio/test/her-improved.mp3"
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"✅ Generated improved test file: {output_path}")
            print("🎧 Play this file to hear the difference!")
            return True
        else:
            print(f"❌ Failed to generate audio: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_voice()
