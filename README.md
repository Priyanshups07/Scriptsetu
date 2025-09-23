# Scriptsetu - Bharat Script Transliteration App

## Problem Statement

Bharat has always been a land of many languages flourishing together. The multitude of scripts have thrived and have been instrumental in the preservation of knowledge without losing continuity. Today, many people are not able to read signboards in local languages due to their inability to read a different script.

**The challenge is to develop an app that can transliterate (Not translate) any script of Bharat into another script.** For example:
- A person from Andhra Pradesh must be able to read the road signs in Gurmukhi when traveling in Punjab
- A pilgrim visiting Thiruvananthapuram from Manipur should be able to read the signs in Malayalam through a transliteration app

## Solution

Scriptsetu is a mobile application that enables seamless transliteration between various Indian scripts, breaking down language barriers while preserving the original meaning and context. The app focuses specifically on helping travelers and pilgrims read street signs and public information in scripts different from their native one.

## Key Features

- **Real-time Script Transliteration**: Instant transliteration between Indian scripts
- **Street Sign Detection**: Camera-based detection of street signs and public text
- **Multi-script Support**: Support for all major Indian scripts including Devanagari, Bengali, Tamil, Telugu, Malayalam, Kannada, Gujarati, Punjabi (Gurmukhi), and more
- **Offline Functionality**: Works without internet connection for common transliterations
- **User-friendly Interface**: Intuitive design suitable for all age groups
- **Heritage Preservation**: Helps preserve and promote India's linguistic diversity

## Tech Stack

- React Native (Expo)
- TypeScript
- Expo Camera API
- Native device features (Camera)
- Script transliteration libraries

## Installation

```bash
# Clone the repository
git clone https://github.com/Priyanshups07/Scriptsetu.git

# Navigate to project directory
cd Scriptsetu

# Install dependencies
npm install

# Start the development server
npx expo start
```

## Usage

1. Open the app on your mobile device
2. Grant camera permissions when prompted
3. Point your camera at street signs or text in any Indian script
4. View real-time transliteration in your preferred script
5. Use the translator tab for manual text input transliteration
6. Save frequently used transliterations for offline access

## Supported Scripts

- Devanagari (Hindi, Marathi, etc.)
- Bengali
- Tamil
- Telugu
- Malayalam
- Kannada
- Gujarati
- Punjabi (Gurmukhi)
- Oriya
- Assamese
- And other Indian scripts

## Project Structure

- `app/(tabs)/camera.tsx`: Camera interface for street sign detection
- `app/(tabs)/translator.tsx`: Manual text input transliteration
- `app/(tabs)/profile.tsx`: User profile and settings
- `app/_layout.tsx`: Main app layout configuration
- `app/(tabs)/_layout.tsx`: Tab navigation configuration

## Contributing

We welcome contributions to Scriptsetu! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to your branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the linguistic diversity of Bharat
- Built with the vision of connecting people through script transliteration
- Developed for AICTE under the theme of Heritage & Culture