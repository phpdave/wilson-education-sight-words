#!/usr/bin/env bash
# High-Quality Audio Setup Script

echo "🎵 High-Quality Sight Words Audio Setup"
echo "======================================"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    exit 1
fi

echo "✅ Python 3 and pip3 are available"

# Install required packages
echo "📦 Installing required packages..."
pip3 install requests

# Create audio directories
echo "📁 Creating audio directories..."
mkdir -p audio/{words,letters,encouragement,corrections,phrases,sentences,test}

echo "🔑 Setting up API key..."
echo ""
echo "To use ElevenLabs (recommended for best quality):"
echo "1. Go to https://elevenlabs.io/app/speech-synthesis"
echo "2. Sign up for a free account"
echo "3. Get your API key from the profile section"
echo "4. Run: export ELEVENLABS_API_KEY='your_api_key_here'"
echo ""
echo "To use Google Cloud TTS (cost-effective):"
echo "1. Go to https://cloud.google.com/text-to-speech"
echo "2. Set up a project and enable the API"
echo "3. Create service account credentials"
echo "4. Run: export GOOGLE_APPLICATION_CREDENTIALS='path/to/credentials.json'"
echo ""
echo "To use Amazon Polly:"
echo "1. Go to https://aws.amazon.com/polly/"
echo "2. Set up AWS credentials"
echo "3. Configure AWS CLI or environment variables"
echo ""

# Check if API key is set
if [ -z "$ELEVENLABS_API_KEY" ]; then
    echo "⚠️  ELEVENLABS_API_KEY not set. Please set it before running the generator."
else
    echo "✅ ELEVENLABS_API_KEY is set"
    echo ""
    echo "🚀 Ready to generate high-quality audio!"
    echo "Run: python3 generate_high_quality_audio.py"
fi

echo ""
echo "📚 For detailed instructions, see HIGH_QUALITY_AUDIO_GUIDE.md"
