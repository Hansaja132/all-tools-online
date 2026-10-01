import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Free Online Multi-Tools';
    const category = searchParams.get('category') || 'MultiTools';
    const description =
      searchParams.get('description') ||
      'Free online client-side and backend developer, image, and text tools to speed up your workflow.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#09090b',
            backgroundImage:
              'radial-gradient(circle at 15% 15%, rgba(124, 58, 237, 0.22) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(99, 102, 241, 0.15) 0%, transparent 45%)',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            color: '#fafafa',
          }}
        >
          {/* Top category badge */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                color: '#c4b5fd',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </div>
          </div>

          {/* Center Title and Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h1
              style={{
                fontSize: 54,
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 24,
                lineHeight: 1.45,
                color: '#a1a1aa',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </p>
          </div>

          {/* Bottom Branding Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: 28,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 22,
                  color: '#ffffff',
                }}
              >
                M
              </div>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                MultiTools
              </span>
            </div>
            <div
              style={{
                fontSize: 18,
                color: '#71717a',
                fontWeight: 600,
              }}
            >
              Free Online Developer & Content Tools
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
