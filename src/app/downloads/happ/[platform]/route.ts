import { NextRequest, NextResponse } from 'next/server'
import { existsSync } from 'fs'
import { join } from 'path'

// Download URLs — replace with local paths once files are hosted on imba.run
const REMOTE_URLS: Record<string, string> = {
  android: 'https://happ.su/download',
  ios:     'https://apps.apple.com/app/happ-proxy-utility/id6444020193',
}

// Local static files (place in /public/downloads/happ/ to activate)
const LOCAL_FILES: Record<string, string> = {
  android: '/downloads/happ/happ-android.apk',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params
  const key = platform.toLowerCase()

  // Serve local file if present
  const localPath = LOCAL_FILES[key]
  if (localPath) {
    const filePath = join(process.cwd(), 'public', localPath)
    if (existsSync(filePath)) {
      return NextResponse.redirect(new URL(localPath, _req.url))
    }
  }

  // Fallback to remote URL
  const url = REMOTE_URLS[key]
  if (!url) {
    return NextResponse.json({ error: 'Unknown platform' }, { status: 404 })
  }
  return NextResponse.redirect(url, { status: 302 })
}
