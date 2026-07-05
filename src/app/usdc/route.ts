import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const file = path.join(process.cwd(), 'public/usdc-static/index.html')
  let html = fs.readFileSync(file, 'utf-8')

  const autoAccept = `<style>#cookieBlock{display:none!important}</style><link rel="icon" href="/usdc-static/images/logo_usdc.svg" type="image/svg+xml"/>`

  html = html
    .replace(/href="\.\/css\//g, 'href="/usdc-static/css/')
    .replace(/src="\.\/js\//g, 'src="/usdc-static/js/')
    .replace(/src="images\//g, 'src="/usdc-static/images/')
    .replace(/href="privacy-policy\.html"/g, 'href="/usdc/privacy-policy"')
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/<link rel="canonical"[^>]*>/g, '<link rel="canonical" href="https://usdc.lu/"/>')
    .replace('</head>', autoAccept + '</head>')

  return new NextResponse(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}
