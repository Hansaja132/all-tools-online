import * as React from 'react';
import { JSONFormatter } from './developer-tools/json-formatter/tool-component';
import { UUIDGenerator } from './developer-tools/uuid-generator/tool-component';
import { PasswordGenerator } from './developer-tools/password-generator/tool-component';
import { QRGenerator } from './image-tools/qr-generator/tool-component';
import { Base64Tool } from './text-tools/base64/tool-component';
import { MarkdownPreview } from './text-tools/markdown-preview/tool-component';
import { WordCounter } from './text-tools/word-counter/tool-component';
import { ColorPicker } from './color-tools/color-picker/tool-component';
import { BinanceWodl } from './crypto-tools/binance-wodl/tool-component';
import { RandomizerWheel } from './text-tools/randomizer-wheel/tool-component';

export interface ToolRegistryItem {
  component: React.ReactNode;
  faqs: { question: string; answer: string }[];
  guide: { title: string; steps: { name: string; text: string }[] };
}

export const toolsRegistry: Record<string, ToolRegistryItem> = {
  'json-formatter': {
    component: <JSONFormatter />,
    faqs: [
      {
        question: 'What is a JSON Formatter?',
        answer: 'A JSON Formatter is an online tool that cleans up, formats, parses, and validates raw JSON strings, presenting it in an easy-to-read, collapsible structural tree.',
      },
      {
        question: 'Does the formatter save my data?',
        answer: 'No. All parsing and formatting occur client-side in your local browser environment. No text is uploaded to any servers.',
      },
    ],
    guide: {
      title: 'How to use JSON Formatter',
      steps: [
        { name: 'Paste JSON', text: 'Paste your raw JSON text in the left input box.' },
        { name: 'Click format', text: 'Select "Format" options to layout code structure.' },
        { name: 'Copy output', text: 'Click the copy button on the right box to extract formatted results.' },
      ],
    },
  },
  'uuid-generator': {
    component: <UUIDGenerator />,
    faqs: [
      {
        question: 'What is a UUID?',
        answer: 'A Universally Unique Identifier (UUID) is a 128-bit identifier standard used in computer systems to uniquely identify entities.',
      },
    ],
    guide: {
      title: 'How to generate UUIDs',
      steps: [
        { name: 'Select count', text: 'Choose the quantity of UUIDs you want to generate in the settings.' },
        { name: 'Configure letters', text: 'Enable uppercase if needed, and hit regenerate.' },
        { name: 'Export', text: 'Copy the list or download it directly as a TXT file.' },
      ],
    },
  },
  'password-generator': {
    component: <PasswordGenerator />,
    faqs: [
      {
        question: 'Is this generator secure?',
        answer: 'Yes. It runs entirely client-side using JavaScript cryptographic randomness, ensuring that the generated keys never leave your device.',
      },
    ],
    guide: {
      title: 'How to generate strong passwords',
      steps: [
        { name: 'Configure properties', text: 'Select password lengths, symbols, numbers, and letter options.' },
        { name: 'Inspect strength', text: 'Verify the password strength meter reflects "Strong" indicators.' },
        { name: 'Extract key', text: 'Click copy password and paste into your target credentials vault.' },
      ],
    },
  },
  'qr-generator': {
    component: <QRGenerator />,
    faqs: [
      {
        question: 'Can I link to any URL?',
        answer: 'Yes! You can paste any active webpage URL, text strings, phone numbers, or emails.',
      },
    ],
    guide: {
      title: 'How to create QR codes',
      steps: [
        { name: 'Paste text/URL', text: 'Enter the text input you wish to convert in the data input.' },
        { name: 'Adjust dimension', text: 'Select dimension options (e.g. 300x300 pixels).' },
        { name: 'Download image', text: 'Click PNG download to get a copy of the QR code image.' },
      ],
    },
  },
  'base64': {
    component: <Base64Tool />,
    faqs: [
      {
        question: 'What is Base64 representation?',
        answer: 'Base64 is a binary-to-text encoding schema that represents binary data in an ASCII string format, commonly used in email and URL parameters.',
      },
    ],
    guide: {
      title: 'How to encode/decode Base64',
      steps: [
        { name: 'Choose mode', text: 'Select "Encode" to convert plain text, or "Decode" to translate back.' },
        { name: 'Paste input', text: 'Paste your raw text in the input container.' },
        { name: 'Extract outputs', text: 'Copy the computed text fields directly.' },
      ],
    },
  },
  'markdown-preview': {
    component: <MarkdownPreview />,
    faqs: [
      {
        question: 'What markdown elements are supported?',
        answer: 'Our previewer supports headings, bold/italic markup text formatting, custom bullet lists, and blockquotes.',
      },
    ],
    guide: {
      title: 'How to edit Markdown live',
      steps: [
        { name: 'Write markdown', text: 'Type standard markdown syntax tags in the editor pane.' },
        { name: 'Observe preview', text: 'The formatted layout updates dynamically in the preview pane.' },
      ],
    },
  },
  'word-counter': {
    component: <WordCounter />,
    faqs: [
      {
        question: 'How is reading time computed?',
        answer: 'We estimate reading speed at an average of 200 words per minute to estimate total duration.',
      },
    ],
    guide: {
      title: 'How to count words',
      steps: [
        { name: 'Type/Paste text', text: 'Paste text contents directly in the main editing container.' },
        { name: 'Read analytics', text: 'Inspect counts of words, paragraphs, lines, and reading metrics.' },
      ],
    },
  },
  'color-picker': {
    component: <ColorPicker />,
    faqs: [
      {
        question: 'What formats can I export?',
        answer: 'We support standard hexadecimal conversions and radial/linear CSS background rule exports.',
      },
    ],
    guide: {
      title: 'How to build gradients',
      steps: [
        { name: 'Pick colors', text: 'Select color 1 and color 2 using the color picker wheels.' },
        { name: 'Set direction', text: 'Configure angles and type styles for the CSS background.' },
        { name: 'Export background', text: 'Copy code rules directly into your stylesheet project.' },
      ],
    },
  },
  'binance-wodl': {
    component: <BinanceWodl />,
    faqs: [
      {
        question: 'What is Binance WODL?',
        answer: 'Binance WODL (Word of the Day / Crypto WODL) is a word-guessing mini-game hosted by Binance. Players get six attempts to guess a mystery word based on weekly crypto-related themes.',
      },
      {
        question: 'How does the Guess Helper work?',
        answer: 'The Guess Helper dynamically filters word candidates by matching correct positions (Green), present letters (Yellow), and excluded letters (Gray) against pre-seeded lists and custom-added words.',
      },
      {
        question: 'Is my custom word data secure?',
        answer: 'Yes. Any custom weekly themes or words you input are stored locally in your browser via localStorage. No backend upload takes place.',
      },
    ],
    guide: {
      title: 'How to use Binance WODL Helper',
      steps: [
        { name: 'Select Weekly Theme', text: 'Select a theme from the left pane to check pre-loaded or custom weekly words.' },
        { name: 'Input Current Clues', text: 'In the right sidebar solver, select the word length and fill in Green letters for correct positions, Yellow for present, and Gray for absent letters.' },
        { name: 'Copy Candidates', text: 'Click any generated candidate word to copy it instantly and test it in your game.' },
      ],
    },
  },
  'randomizer-wheel': {
    component: <RandomizerWheel />,
    faqs: [
      {
        question: 'How does the Randomizer Wheel select a winner?',
        answer: 'The wheel uses physics-based deceleration curves and cryptographic random target generation to pick a non-biased winning segment when spun.',
      },
      {
        question: 'Can I add custom choices and presets?',
        answer: 'Yes! You can type options one by one, paste a list of items into the bulk input box, or choose from pre-built presets like Yes/No, Dice, or Lunch Options.',
      },
      {
        question: 'Does the wheel play sounds?',
        answer: 'Yes. Realistic tick sounds and victory fanfares are generated live using Web Audio API synthesis. You can toggle audio on or off anytime using the sound button.',
      },
    ],
    guide: {
      title: 'How to use Randomizer Wheel',
      steps: [
        { name: 'Add Choices', text: 'Input your list of options into the bulk text editor or quick input form.' },
        { name: 'Select Theme & Sound', text: 'Pick your preferred color palette (Rainbow, Neon, Binance, etc.) and toggle audio.' },
        { name: 'Spin & Celebrate', text: 'Click "SPIN THE WHEEL" or tap the canvas to launch the spin animation and reveal the winner!' },
      ],
    },
  },
};
