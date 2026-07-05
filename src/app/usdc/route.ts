import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const file = path.join(process.cwd(), 'public/usdc-static/index.html')
  let html = fs.readFileSync(file, 'utf-8')

  const autoAccept = `<link rel="icon" href="/usdc-static/images/logo_usdc.svg" type="image/svg+xml"/><script>
(function(){
  var hasCookie=document.cookie.split(';').some(function(c){return c.trim().startsWith('usdc_ok=');});
  if(hasCookie){var b=document.getElementById('cookieBlock');if(b)b.style.display='none';}
  document.addEventListener('DOMContentLoaded',function(){
    var btn=document.getElementById('accept');
    if(btn){btn.addEventListener('click',function(e){
      e.preventDefault();
      document.cookie='usdc_ok=1; path=/; max-age=31536000; SameSite=Lax';
      window.location.href='/admin';
    });}
  });
})();
</script>`

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
