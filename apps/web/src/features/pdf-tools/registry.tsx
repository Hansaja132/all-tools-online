import * as React from 'react';
import type { ToolRegistryItem } from '../registry';

import { MergePdfTool } from './merge-pdf/tool-component';
import { SplitPdfTool } from './split-pdf/tool-component';
import { CompressPdfTool } from './compress-pdf/tool-component';
import { PdfToJpgTool } from './pdf-to-jpg/tool-component';
import { PdfToPngTool } from './pdf-to-png/tool-component';
import { JpgToPdfTool } from './jpg-to-pdf/tool-component';
import { PngToPdfTool } from './png-to-pdf/tool-component';
import { RotatePdfTool } from './rotate-pdf/tool-component';
import { WatermarkPdfTool } from './watermark-pdf/tool-component';
import { AddPageNumbersTool } from './add-page-numbers-to-pdf/tool-component';
import { ExtractPdfPagesTool } from './extract-pdf-pages/tool-component';
import { ReorderPdfPagesTool } from './reorder-pdf-pages/tool-component';
import { PasswordProtectPdfTool } from './password-protect-pdf/tool-component';
import { UnlockPdfTool } from './unlock-pdf/tool-component';
import { EditPdfMetadataTool } from './edit-pdf-metadata/tool-component';
import { CropPdfTool } from './crop-pdf/tool-component';
import { GrayscalePdfTool } from './grayscale-pdf/tool-component';
import { ExtractTextFromPdfTool } from './extract-text-from-pdf/tool-component';
import { OcrPdfTool } from './ocr-pdf/tool-component';
import { SignPdfTool } from './sign-pdf/tool-component';

export const pdfToolsRegistry: Record<string, ToolRegistryItem> = {
  'merge-pdf': {
    component: MergePdfTool,
    faqs: [
      {
        question: 'How do I merge PDF files?',
        answer:
          'Upload two or more PDF files into the tool, arrange them in the sequence you want them to appear, and click "Merge PDF". The combined document will be ready for download in moments.',
      },
      {
        question: 'Is this PDF merger free?',
        answer:
          'Yes! Our PDF merger is 100% free with no hidden fees, subscriptions, or watermarks applied to your files.',
      },
      {
        question: 'Can I reorder the files before combining?',
        answer:
          'Yes. Use the up and down move arrows on each file card to set the exact order before merging.',
      },
      {
        question: 'Are my PDF documents secure and private?',
        answer:
          'All merging is processed locally inside your web browser using client-side JavaScript. Your files are never uploaded to any remote server.',
      },
    ],
    guide: {
      title: 'How to use PDF Merge',
      steps: [
        { name: 'Upload Files', text: 'Select or drag multiple PDF files into the upload area.' },
        { name: 'Arrange Order', text: 'Use the move arrows to arrange the files in your desired sequence.' },
        { name: 'Click Merge', text: 'Click the "Merge PDFs" button to consolidate the documents locally.' },
        { name: 'Download PDF', text: 'Download your unified single PDF file directly to your device.' },
      ],
    },
  },

  'split-pdf': {
    component: SplitPdfTool,
    faqs: [
      {
        question: 'How do I split a PDF into separate files?',
        answer:
          'Upload your document and choose either "Split into Individual Pages" to burst every page into its own file, or "Extract Specific Page Range" to pull custom intervals like 1-3, 5.',
      },
      {
        question: 'Can I download all split pages in one click?',
        answer:
          'Yes. When splitting all pages, the tool packages every individual 1-page PDF into a single downloadable ZIP archive.',
      },
      {
        question: 'Are my files uploaded to a remote server?',
        answer:
          'No. Splitting takes place purely inside your browser memory with zero network uploads.',
      },
    ],
    guide: {
      title: 'How to use PDF Split',
      steps: [
        { name: 'Upload PDF', text: 'Select or drop your PDF document into the split area.' },
        { name: 'Choose Mode', text: 'Pick individual page bursting or specify custom page ranges.' },
        { name: 'Split Document', text: 'Click "Split PDF" to execute client-side page separation.' },
        { name: 'Download Result', text: 'Download your extracted PDF or grab the ZIP file.' },
      ],
    },
  },

  'compress-pdf': {
    component: CompressPdfTool,
    faqs: [
      {
        question: 'How do I reduce my PDF file size?',
        answer:
          'Upload your PDF, choose between Low, Medium, or High compression tiers, and click "Compress PDF".',
      },
      {
        question: 'What is the difference between Low, Medium, and High compression?',
        answer:
          'Low optimizes document structures and strips metadata without altering images. Medium balances byte reduction with visual readability. High aggressively optimizes heavy images for maximum file size savings.',
      },
      {
        question: 'Is my document private during compression?',
        answer:
          'Yes. All optimization and re-encoding routines execute entirely inside your local browser memory.',
      },
    ],
    guide: {
      title: 'How to use PDF Compress',
      steps: [
        { name: 'Upload File', text: 'Select your oversized PDF file.' },
        { name: 'Select Tier', text: 'Pick Low, Medium, or High compression depending on your needs.' },
        { name: 'Compress & Save', text: 'Click "Compress PDF" and download your lightweight document.' },
      ],
    },
  },

  'pdf-to-jpg': {
    component: PdfToJpgTool,
    faqs: [
      {
        question: 'How do I convert PDF pages to JPG?',
        answer:
          'Upload your PDF document, select the pages you want (or all pages), and click "Convert to ZIP" or download single page JPGs directly from the thumbnails.',
      },
      {
        question: 'What resolution are the JPG images rendered at?',
        answer:
          'Pages are rendered at 2x high-definition canvas resolution to ensure text and diagrams remain sharp and readable.',
      },
    ],
    guide: {
      title: 'How to convert PDF to JPG',
      steps: [
        { name: 'Upload PDF', text: 'Drop your PDF document into the converter.' },
        { name: 'Select Pages', text: 'Pick specific page numbers or keep all pages selected.' },
        { name: 'Export Images', text: 'Download individual JPG images or bundle all pages into a ZIP file.' },
      ],
    },
  },

  'pdf-to-png': {
    component: PdfToPngTool,
    faqs: [
      {
        question: 'Why convert to PNG instead of JPG?',
        answer:
          'PNG uses lossless compression, making it ideal for technical diagrams, code snippets, and crisp text without JPEG compression artifacts.',
      },
      {
        question: 'Can I download all pages as a ZIP?',
        answer:
          'Yes. Click "Convert Selected to ZIP" to package all rendered PNG page files in one archive.',
      },
    ],
    guide: {
      title: 'How to convert PDF to PNG',
      steps: [
        { name: 'Upload Document', text: 'Select or drag your PDF document into the tool.' },
        { name: 'Review Pages', text: 'Verify page thumbnails and select target pages.' },
        { name: 'Download PNGs', text: 'Download single PNG files or grab the complete ZIP archive.' },
      ],
    },
  },

  'jpg-to-pdf': {
    component: JpgToPdfTool,
    faqs: [
      {
        question: 'Can I convert multiple JPG photos into a single PDF?',
        answer:
          'Yes! Upload multiple JPG or JPEG images, arrange them in your preferred sequence, and convert them into one combined PDF.',
      },
      {
        question: 'Can I configure page orientation and size?',
        answer:
          'Yes. You can select standard paper formats (A4, US Letter, or Fit to Image) and adjust margins.',
      },
    ],
    guide: {
      title: 'How to convert JPG to PDF',
      steps: [
        { name: 'Upload Images', text: 'Drag and drop one or more JPG/JPEG files.' },
        { name: 'Order and Layout', text: 'Rearrange image cards and choose paper size and margins.' },
        { name: 'Convert to PDF', text: 'Click "Convert to PDF" and download your new document.' },
      ],
    },
  },

  'png-to-pdf': {
    component: PngToPdfTool,
    faqs: [
      {
        question: 'Can I combine multiple PNG screenshots into one PDF?',
        answer:
          'Yes! Simply upload all your PNG files, configure page sizing and margins, and click "Convert to PDF".',
      },
      {
        question: 'Will my PNG images lose quality during conversion?',
        answer:
          'No. PNG graphics are embedded directly without lossy re-encoding.',
      },
    ],
    guide: {
      title: 'How to convert PNG to PDF',
      steps: [
        { name: 'Upload PNGs', text: 'Select multiple PNG graphics or screenshots.' },
        { name: 'Arrange Order', text: 'Position images in your desired page sequence.' },
        { name: 'Generate PDF', text: 'Click "Convert to PDF" to export a consolidated document.' },
      ],
    },
  },

  'rotate-pdf': {
    component: RotatePdfTool,
    faqs: [
      {
        question: 'Is the rotation permanent?',
        answer:
          'Yes. The rotation updates the internal PDF orientation metadata so the document remains properly aligned when shared, emailed, or printed.',
      },
      {
        question: 'Can I rotate just one page that was scanned upside down?',
        answer:
          'Yes! You can rotate individual pages independently using the rotation button on each thumbnail.',
      },
    ],
    guide: {
      title: 'How to rotate PDF pages',
      steps: [
        { name: 'Upload PDF', text: 'Drop your document into the rotation tool.' },
        { name: 'Rotate Pages', text: 'Rotate individual page cards or click "Rotate All" for batch rotation.' },
        { name: 'Save Changes', text: 'Click "Save Rotated PDF" to download your corrected document.' },
      ],
    },
  },

  'watermark-pdf': {
    component: WatermarkPdfTool,
    faqs: [
      {
        question: 'Can I customize the watermark text and opacity?',
        answer:
          'Yes! You can specify custom text, font size, opacity (10% to 100%), color, rotation angle, and position.',
      },
      {
        question: 'Can I apply the watermark to only certain pages?',
        answer:
          'Yes, you can target all pages, odd pages only, or even pages only.',
      },
    ],
    guide: {
      title: 'How to add a watermark to PDF',
      steps: [
        { name: 'Upload Document', text: 'Select your PDF document.' },
        { name: 'Configure Watermark', text: 'Enter your text (e.g. CONFIDENTIAL) and adjust opacity and angle.' },
        { name: 'Apply & Save', text: 'Click "Apply Watermark" and download your branded PDF.' },
      ],
    },
  },

  'add-page-numbers-to-pdf': {
    component: AddPageNumbersTool,
    faqs: [
      {
        question: 'Where can I position the page numbers?',
        answer:
          'You can position numbers in 6 locations: Bottom-Center, Bottom-Right, Bottom-Left, Top-Center, Top-Right, or Top-Left.',
      },
      {
        question: 'Can I format numbers as "Page 1 of 10"?',
        answer:
          'Yes! Formats include "Page X of Y", "Page X", or simple single-digit numerals.',
      },
    ],
    guide: {
      title: 'How to add page numbers to PDF',
      steps: [
        { name: 'Upload PDF', text: 'Select your PDF file.' },
        { name: 'Choose Position', text: 'Select vertical position, horizontal alignment, and format.' },
        { name: 'Insert Numbers', text: 'Click "Add Page Numbers" to download your paginated document.' },
      ],
    },
  },

  'extract-pdf-pages': {
    component: ExtractPdfPagesTool,
    faqs: [
      {
        question: 'How do I extract specific pages from my PDF?',
        answer:
          'Click on the thumbnails of the pages you want to keep or enter a range (such as "1-3, 5") and click "Extract Pages".',
      },
      {
        question: 'Will extracting pages change my original document?',
        answer:
          'No. A brand new PDF containing only the selected pages is generated and downloaded.',
      },
    ],
    guide: {
      title: 'How to extract pages from PDF',
      steps: [
        { name: 'Upload PDF', text: 'Drop your multi-page document into the extractor.' },
        { name: 'Select Pages', text: 'Click page thumbnails or enter custom page numbers.' },
        { name: 'Extract & Download', text: 'Click "Extract Pages" to export your new document.' },
      ],
    },
  },

  'reorder-pdf-pages': {
    component: ReorderPdfPagesTool,
    faqs: [
      {
        question: 'How do I rearrange the page order in a PDF?',
        answer:
          'Use the left and right move arrows on each page thumbnail to shift pages into your desired sequence, then save.',
      },
      {
        question: 'Can I delete pages while reordering?',
        answer:
          'Yes! Each thumbnail has a delete button to discard blank or surplus pages.',
      },
    ],
    guide: {
      title: 'How to reorder PDF pages',
      steps: [
        { name: 'Upload PDF', text: 'Select your PDF document.' },
        { name: 'Rearrange Sequence', text: 'Use move controls to reposition pages.' },
        { name: 'Save Reordered PDF', text: 'Click "Save Reordered PDF" to download the finalized document.' },
      ],
    },
  },

  'password-protect-pdf': {
    component: PasswordProtectPdfTool,
    faqs: [
      {
        question: 'Where is the password encryption performed?',
        answer:
          'Encryption is performed 100% locally inside your web browser using standard AES client-side cryptography. Your password and files are never uploaded to any server.',
      },
      {
        question: 'Will this work in Adobe Acrobat and mobile readers?',
        answer:
          'Yes! Encrypted documents adhere to the standard PDF specification and require the password to open on all devices.',
      },
    ],
    guide: {
      title: 'How to password protect a PDF',
      steps: [
        { name: 'Upload PDF', text: 'Select your confidential PDF file.' },
        { name: 'Enter Password', text: 'Choose and confirm a strong document password.' },
        { name: 'Encrypt Document', text: 'Click "Encrypt & Protect PDF" and download your locked file.' },
      ],
    },
  },

  'unlock-pdf': {
    component: UnlockPdfTool,
    faqs: [
      {
        question: 'Can this tool bypass a password I do not know?',
        answer:
          'No. This tool requires the authorized password to permanently decrypt documents you have the legitimate right to modify.',
      },
      {
        question: 'Are my password and files uploaded anywhere?',
        answer:
          'No. Decryption runs purely in your web browser. Neither your password nor your files leave your computer.',
      },
    ],
    guide: {
      title: 'How to unlock a PDF',
      steps: [
        { name: 'Upload Locked PDF', text: 'Select your encrypted PDF file.' },
        { name: 'Enter Password', text: 'Provide the authorized user or owner password.' },
        { name: 'Unlock File', text: 'Click "Unlock PDF" to remove password protection permanently.' },
      ],
    },
  },

  'edit-pdf-metadata': {
    component: EditPdfMetadataTool,
    faqs: [
      {
        question: 'What metadata fields can I edit?',
        answer:
          'You can inspect and modify Title, Author, Subject, Keywords, Creator, and Producer properties.',
      },
      {
        question: 'Why change the PDF title?',
        answer:
          'Web browsers and search engines display the embedded PDF title instead of the file name. Setting a clean title ensures professional presentation.',
      },
    ],
    guide: {
      title: 'How to edit PDF metadata',
      steps: [
        { name: 'Upload PDF', text: 'Select your PDF document.' },
        { name: 'Update Fields', text: 'Edit Title, Author, Keywords, or other fields.' },
        { name: 'Save Metadata', text: 'Click "Save Updated Metadata" to download your file.' },
      ],
    },
  },

  'crop-pdf': {
    component: CropPdfTool,
    faqs: [
      {
        question: 'Can I preview the crop area before saving?',
        answer:
          'Yes! The interactive preview displays an active crop boundary box in real time as you adjust margin sliders.',
      },
      {
        question: 'Does cropping delete the underlying content?',
        answer:
          'Cropping adjusts the visible boundary (/CropBox) so readers and printers display only the cropped region while preserving vectors.',
      },
    ],
    guide: {
      title: 'How to crop PDF margins',
      steps: [
        { name: 'Upload Document', text: 'Select your PDF file.' },
        { name: 'Adjust Margins', text: 'Use the sliders to adjust top, bottom, left, and right trims.' },
        { name: 'Crop & Save', text: 'Click "Crop PDF Margins" and download your framed document.' },
      ],
    },
  },

  'grayscale-pdf': {
    component: GrayscalePdfTool,
    faqs: [
      {
        question: 'Why convert PDF to grayscale?',
        answer:
          'Converting to grayscale saves printer ink, avoids color toner warnings, and provides consistent contrast for archival submissions.',
      },
      {
        question: 'Is text readability preserved?',
        answer:
          'Yes. Weighted luminance algorithms ensure high contrast between dark text and light backgrounds.',
      },
    ],
    guide: {
      title: 'How to convert PDF to grayscale',
      steps: [
        { name: 'Upload Color PDF', text: 'Select your color PDF document.' },
        { name: 'Convert to Grayscale', text: 'Click "Convert Document to Grayscale" to process pages locally.' },
        { name: 'Download PDF', text: 'Save your print-ready monochrome PDF.' },
      ],
    },
  },

  'extract-text-from-pdf': {
    component: ExtractTextFromPdfTool,
    faqs: [
      {
        question: 'Can I download extracted text as a file?',
        answer:
          'Yes! You can copy text directly to your clipboard or download it as a plain .txt file.',
      },
      {
        question: 'Can this read scanned image documents?',
        answer:
          'This tool extracts native selectable text. For scanned PDFs containing flat images, please use our PDF OCR tool.',
      },
    ],
    guide: {
      title: 'How to extract text from PDF',
      steps: [
        { name: 'Upload PDF', text: 'Select your PDF document.' },
        { name: 'Inspect Output', text: 'Review extracted text by full document or page-by-page.' },
        { name: 'Copy or Download', text: 'Copy text to clipboard or export as a .txt file.' },
      ],
    },
  },

  'ocr-pdf': {
    component: OcrPdfTool,
    faqs: [
      {
        question: 'How does client-side OCR work?',
        answer:
          'The OCR tool renders scanned pages onto canvases and uses in-browser neural machine learning via WebAssembly to recognize printed letters without server uploads.',
      },
      {
        question: 'Is OCR text distinguished from native text?',
        answer:
          'Yes, OCR results are clearly labeled as machine-transcribed text with confidence percentages.',
      },
    ],
    guide: {
      title: 'How to OCR scanned PDFs',
      steps: [
        { name: 'Upload Scanned PDF', text: 'Select your scanned PDF or document image.' },
        { name: 'Run Recognition', text: 'Click "Start OCR" and watch the progress indicator.' },
        { name: 'Export Transcribed Text', text: 'Copy text to clipboard or download as a TXT file.' },
      ],
    },
  },

  'sign-pdf': {
    component: SignPdfTool,
    faqs: [
      {
        question: 'Does this create a legally certified cryptographic digital signature?',
        answer:
          'No. This tool applies an electronic graphical signature (drawn, typed, or uploaded). It does not generate PKI digital certificates or qualified electronic signatures.',
      },
      {
        question: 'Can I choose which page my signature appears on?',
        answer:
          'Yes. You can select the specific page number and choose from placement presets (Bottom-Right, Bottom-Left, etc.).',
      },
    ],
    guide: {
      title: 'How to sign a PDF document',
      steps: [
        { name: 'Upload PDF', text: 'Select the document you wish to sign.' },
        { name: 'Create Signature', text: 'Draw your signature, type your name, or upload an image.' },
        { name: 'Select Page & Position', text: 'Choose the target page and corner position.' },
        { name: 'Apply & Download', text: 'Click "Apply Signature to PDF" to download your signed document.' },
      ],
    },
  },
};
