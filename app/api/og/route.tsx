import { createCanvas, CanvasRenderingContext2D, registerFont } from 'canvas';
import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to load font
async function loadFont() {
  try {
    const fontResponse = await fetch('https://www.v0id.me/fonts/IBMPlexSansArabic-Regular.ttf');
    const fontBuffer = await fontResponse.arrayBuffer();
    const tempFontPath = join(os.tmpdir(), 'IBMPlexSansArabic-Regular.ttf');
    
    await writeFile(tempFontPath, Buffer.from(fontBuffer));
    registerFont(tempFontPath, {
      family: 'IBM Plex Sans Arabic',
      weight: '400',
    });
    
    return true;
  } catch (error) {
    console.error('Error loading font:', error);
    return false;
  }
}

// Helper function to create grain pattern
function createGrainPattern(ctx: CanvasRenderingContext2D) {
  const patternCanvas = createCanvas(150, 150);
  const patternCtx = patternCanvas.getContext('2d');
  
  // Create noise pattern
  const imageData = patternCtx.createImageData(150, 150);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255;
    data[i] = value;     // r
    data[i + 1] = value; // g
    data[i + 2] = value; // b
    data[i + 3] = 15;    // alpha
  }
  
  patternCtx.putImageData(imageData, 0, 0);
  return ctx.createPattern(patternCanvas, 'repeat');
}

export async function GET(req: NextRequest) {
  try {
    // Load font first
    const fontLoaded = await loadFont();
    if (!fontLoaded) {
      throw new Error('Failed to load font');
    }
    
    const searchParams = req.nextUrl.searchParams;
    const title = searchParams.get('title') || 'Blog Post Title';
    const author = searchParams.get('author') || 'Author Name';

    // Create canvas with dimensions
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#FFFCF6');
    gradient.addColorStop(0.45, '#FFF8E8');
    gradient.addColorStop(1, '#FFFCF6');
    
    // Fill background with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add grain effect
    const grainPattern = createGrainPattern(ctx);
    if (grainPattern) {
      ctx.fillStyle = grainPattern;
      ctx.fillRect(0, 0, width, height);
    }

    // Configure text settings
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';

    // Draw title with IBM Plex Sans Arabic
    ctx.font = 'bold 72px "IBM Plex Sans Arabic"';
    ctx.fillStyle = '#000000';
    const titleLines = getLines(ctx, title, width - 120);
    titleLines.forEach((line: string, i: number) => {
      ctx.fillText(line, width - 60, 200 + (i * 84));
    });

    // Draw author under title with IBM Plex Sans Arabic
    ctx.font = '36px "IBM Plex Sans Arabic"';
    ctx.fillStyle = '#666666';
    const titleHeight = titleLines.length * 84;
    ctx.fillText(author, width - 60, 240 + titleHeight);

    // Convert to buffer
    const buffer = canvas.toBuffer('image/png');
    
    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    console.error('Error generating image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

// Helper function to wrap text
function getLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}
