# Development Setup Guide

## 📦 Package Management

**IMPORTANT: Always use Poetry for Python package management in this project.**

### Why Poetry?
- Consistent dependency management across environments
- Better dependency resolution than pip
- Automatic virtual environment management
- Lock file ensures reproducible builds

### Installation

1. **Install Poetry** (if not already installed):
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. **Add Poetry to your PATH**:
   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   ```

3. **Verify installation**:
   ```bash
   poetry --version
   ```

### Usage

**Always use Poetry commands instead of pip:**

```bash
# ❌ DON'T use pip
pip install requests

# ✅ DO use Poetry
poetry add requests

# Run Python scripts with Poetry
poetry run python script_name.py

# Install dependencies from pyproject.toml
poetry install
```

### Project Structure

```
wilson-education-sight-words/
├── pyproject.toml          # Poetry configuration
├── poetry.lock            # Locked dependencies
├── audio/                 # Generated audio files
├── generate_*.py          # Audio generation scripts
└── ...
```

### Audio Generation Scripts

All audio generation scripts should be run with Poetry:

```bash
# Generate high-quality audio files
poetry run python generate_high_quality_audio.py

# Generate additional phrase audio
poetry run python generate_additional_audio.py

# Generate word story audio
poetry run python generate_word_stories_audio.py

# Generate correction audio
poetry run python generate_correction_audio.py
```

### Environment Variables

Make sure to set your ElevenLabs API key:

```bash
export ELEVENLABS_API_KEY="your_api_key_here"
```

### Troubleshooting

If you encounter Poetry issues:

1. **Reinstall Poetry**:
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. **Check PATH**:
   ```bash
   echo $PATH | grep -o "$HOME/.local/bin"
   ```

3. **Use full path**:
   ```bash
   ~/.local/bin/poetry --version
   ```

## 🎯 Development Workflow

1. **Always use Poetry** for package management
2. **Run scripts with Poetry** to ensure proper environment
3. **Commit poetry.lock** to version control
4. **Document Poetry usage** in any new scripts

---

**Remember: Poetry is the standard for this project. Always use `poetry run python` instead of `python` directly.**
