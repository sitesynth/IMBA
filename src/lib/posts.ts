export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  categoryColor: string
  date: string
  readTime: string
  content: string
  ogImage?: string
}

export const posts: Post[] = [
  {
    slug: 'vpn-na-kompyutere',
    title: 'How to Set Up a VPN on Windows and macOS (2026 Guide)',
    excerpt: 'Step-by-step guide to installing IMBA VPN on Windows or macOS using the Happ app. VLESS Reality protocol, 5-minute setup, 7 days free.',
    category: 'VPN',
    categoryColor: 'var(--violet)',
    date: 'July 11, 2026',
    readTime: '5 min',
    ogImage: 'https://www.imba.live/blog/og-vpn-na-kompyutere.png',
    content: `
To install a VPN on your computer, download the Happ app for Windows or macOS, paste your IMBA subscription link, and disable Mux in server settings. The whole process takes 5 minutes, and the first 7 days are free.

## What you need

- A computer running Windows 10/11 or macOS
- An IMBA account — sign up with just your email, no card needed
- 5 minutes

Important: standard VPN protocols (OpenVPN, WireGuard) suffer from the same DPI blocking on desktop as on mobile. This guide is built around VLESS Reality — to your ISP, this traffic looks like ordinary HTTPS. For context, read our [protocol comparison guide](/blog/vpn-russia-2026).

## Step 1. Create your account and get 7 days free

Sign up at [imba.live/auth/register](https://www.imba.live/auth/register) — email only. After registering, follow IMBA on [Telegram](https://t.me/imba_live) and activate the Start plan in your dashboard: VPN for 7 days free (plus 500 MB eSIM, handy for travel).

## Step 2. Copy your subscription link

In the IMBA dashboard, open the VPN section, find the "Happ — subscription link" block, and click Copy. This link is your access key: the app uses it to pull the full server list.

## Step 3. Install Happ

### Windows

Download the Setup x64 (.exe) from the link in your dashboard (a mirror is available if the main link is blocked). Run the installer — standard Next, Next, Finish.

### macOS

Option 1: download the .dmg (Universal — works on both Intel and Apple Silicon), drag Happ to Applications.
Option 2: install from the Mac App Store if you have access.

## Step 4. Add your subscription

Open Happ, tap "+", then "Add subscription", then paste the link you copied. The app will pull in the IMBA server list.

## Step 5. Disable Mux and connect

Go to server settings, find Mux, and turn it off. This step is required — the connection won't establish with Mux enabled.

Now pick a server (start with the lowest ping) and hit Connect. Done: check by opening YouTube — video should load in high quality without buffering.

## Troubleshooting

- **Can't connect** — double-check that Mux is disabled (the most common cause)
- **Slow speeds** — try a different server; ping for each is visible in the dashboard
- **ISP is throttling the connection** — switch to another server from the list; VLESS Reality works on all major ISPs
- Still stuck? IMBA support responds in the dashboard

## FAQ

### Which VPN protocol works on desktop in 2026?

Only protocols with traffic obfuscation are reliable — VLESS with XTLS Reality. Classic OpenVPN and WireGuard are identified by DPI and blocked in censored networks. [Full protocol comparison](/blog/vpn-russia-2026).

### Can I use one subscription on desktop and mobile?

Yes. One subscription link works across multiple devices: add it to Happ on [Android](/blog/vpn-android) and [iPhone](/blog/vpn-iphone) and on your [Smart TV](/blog/vpn-smart-tv).

### Is it free?

The first 7 days are free with a Telegram follow. After that, the Pro plan is $9.99/mo, which includes VPN, eSIM, and a virtual card.
    `.trim(),
  },
  {
    slug: 'vpn-russia-2026',
    title: 'Best VPN Protocols in 2026: Which One Actually Works?',
    excerpt: 'A complete breakdown of VPN protocols — from OpenVPN to VLESS Reality — and why some get blocked within seconds while others are invisible to DPI.',
    category: 'VPN',
    categoryColor: 'var(--violet)',
    date: 'June 3, 2026',
    readTime: '7 min',
    ogImage: 'https://www.imba.live/blog/og-vpn-russia-2026.png',
    content: `
## Why your VPN stopped working

Governments and ISPs in China, UAE, Turkey, Iran, and many other countries have deployed deep packet inspection (DPI) systems at the network level. These systems identify most VPN protocols by their traffic signatures and block them in real time.

**Blocked or unstable:**
- **PPTP** — outdated, blocked everywhere
- **OpenVPN** — easily identified by its distinctive handshake pattern
- **WireGuard** — works in less restricted regions, unstable in heavily censored networks

**What still works:**
- **Shadowsocks** — masks traffic as HTTPS, works in most cases
- **V2Ray/VLESS** — advanced obfuscation, very reliable
- **VLESS + XTLS Reality** — the gold standard for 2026

## VLESS Reality — why it works

Reality is a protocol that makes VPN traffic indistinguishable from a regular HTTPS connection to a real website (like apple.com or microsoft.com). DPI sees what looks like "normal" TLS and doesn't block it.

Here's how it works technically:
1. Your client connects to the IMBA VPN server
2. Traffic appears to be accessing a legitimate domain
3. DPI finds no VPN signatures — request passes through

## Countries with aggressive DPI

| Country / Region | DPI Level | Recommendation |
|---|---|---|
| China (Great Firewall) | Very aggressive | VLESS Reality required |
| UAE | Aggressive | VLESS Reality required |
| Turkey | Moderate to aggressive | Obfuscation needed |
| Iran | Very aggressive | VLESS Reality required |
| Russia | Moderate to aggressive | VLESS Reality recommended |

## Protocol comparison table

| Protocol | DPI visibility | Speed | Works in censored networks |
|---|---|---|---|
| VLESS + XTLS Reality | No | High | Yes, reliably |
| Shadowsocks | Partial | High | Sometimes |
| WireGuard | Yes | High | Blocked in most restricted networks |
| OpenVPN | Yes | Medium | Blocked |
| PPTP | Yes | Low | Blocked |

## Conclusion

If you're in a country with internet censorship and want a reliable VPN, you need a protocol with proper obfuscation. IMBA VPN uses VLESS Reality, which is currently the most censorship-resistant protocol available.

[Try IMBA free for 7 days](/auth/register)
    `.trim(),
  },
  {
    slug: 'esim-russia-abroad',
    title: 'eSIM for International Travel: Everything You Need to Know',
    excerpt: 'How to get local mobile data in any country without hunting for a physical SIM card — and why it costs 5-10x less than roaming.',
    category: 'eSIM',
    categoryColor: 'var(--blue)',
    date: 'May 28, 2026',
    readTime: '5 min',
    ogImage: 'https://www.imba.live/blog/og-esim-russia-abroad.png',
    content: `
## What is an eSIM and why does it matter for travel?

An eSIM (embedded SIM) is a digital SIM card built into your phone. Instead of swapping physical SIM cards, you download a data plan as a QR code and activate it in minutes. Your original SIM stays active alongside it — you keep your home number for calls and texts while using cheap local data for everything else.

## eSIM vs. roaming: the cost difference

Traditional roaming through your carrier can cost anywhere from $5 to $25 per day depending on the country. IMBA eSIM plans typically cost $3-8 for a week of data in most destinations. The math is straightforward.

| Option | Cost (1 week, Europe) | Setup time |
|---|---|---|
| Carrier roaming | $35-80 | None (automatic) |
| Local SIM card | $10-20 | 30-60 min at the airport |
| IMBA eSIM | $5-12 | 5 min before you leave |

## Which phones support eSIM?

Most modern smartphones support eSIM:
- **iPhone**: XS and later (iPhone 14+ has dual eSIM, no physical SIM required)
- **Samsung**: Galaxy S20 and later
- **Google Pixel**: Pixel 3a and later
- **Other Android**: check Settings for "SIM card & mobile network" — if you see "Add eSIM", you're good

## How to set up an IMBA eSIM

1. **Buy a plan** in your IMBA dashboard under the eSIM section — pick your destination and data amount
2. **Receive a QR code** instantly via email and in the dashboard
3. **Scan the QR code** on your phone: Settings, then Mobile Network, then Add eSIM
4. **Activate when you land** — the eSIM connects to a local carrier automatically

No airport queues. No hunting for a SIM shop. No compatibility issues.

## Tips for using an eSIM abroad

- **Download the eSIM before you leave** — you need an internet connection to install it
- **Keep data roaming on** for the eSIM profile (and off for your home SIM to avoid roaming charges)
- **Check coverage**: IMBA eSIM covers 190+ countries through local carrier partnerships

## Frequently asked questions

### Can I make calls with an eSIM?

IMBA eSIM is a data-only plan. Keep your home SIM active for calls and use VoIP apps (WhatsApp, FaceTime, Telegram) over the eSIM data connection.

### What if I run out of data?

Top up directly in the IMBA dashboard — new data activates within minutes.

### Does eSIM work on a cruise ship or in remote areas?

Coverage depends on local carrier infrastructure. In most populated areas and popular tourist destinations, you'll have reliable 4G/LTE connectivity.

[Get your eSIM](/esim)
    `.trim(),
  },
  {
    slug: 'pay-abroad-from-russia',
    title: 'How to Pay for Netflix, Spotify & Amazon from Any Country',
    excerpt: 'A virtual card in USD, EUR, or AED lets you subscribe to any global service — even if your local card gets declined.',
    category: 'Card',
    categoryColor: 'var(--green)',
    date: 'May 20, 2026',
    readTime: '5 min',
    ogImage: 'https://www.imba.live/blog/og-pay-abroad.png',
    content: `
## The problem: your card gets declined

International payment systems are complicated. Cards issued in certain countries get blocked by US or European services. Cards linked to sanctioned banks don't process on global platforms. Or you simply don't have a card in the right currency.

The result: Netflix says "payment failed", Spotify can't verify your method, Amazon won't complete checkout.

## The solution: a virtual card in the right currency

A virtual Visa or Mastercard in USD, EUR, or AED works globally — because it's issued by IMBA SRL in Costa Rica, outside any restricted banking system.

**What it looks like:**
- A standard 16-digit card number plus expiry and CVV
- Issued in under a minute, no physical card required
- Funded via USDT, BTC, or bank transfer
- Works anywhere Visa/Mastercard is accepted online

## Services you can pay for

**Streaming:** Netflix, Hulu, Disney+, HBO Max, Apple TV+, Spotify, Apple Music, YouTube Premium

**AI tools:** ChatGPT Plus, Claude Pro, Midjourney, Adobe Firefly

**Software and cloud:** Adobe Creative Cloud, Microsoft 365, Notion, Figma, AWS, Google Cloud

**Shopping and travel:** Amazon, eBay, Booking.com, Airbnb, Expedia

**Gaming:** Steam, PlayStation Store, Xbox Game Pass, Epic Games

## How to issue your IMBA virtual card

1. Log in to your IMBA dashboard
2. Go to the **Card** section
3. Choose your currency (USD, EUR, or AED)
4. Fund the card via USDT, BTC, or bank transfer
5. Card number appears instantly — copy it to any payment form

## Tips

- **Use USD for US services** (Netflix US, Amazon) and EUR for European ones (Spotify DE, Adobe EU)
- **3D Secure is supported** — some services send a verification code; you'll receive it in the dashboard
- **Multiple cards** — on the COMBO plan you get 3 cards, useful for keeping services separate

[Issue your virtual card](/virtual-card)
    `.trim(),
  },
  {
    slug: 'vless-reality-explained',
    title: 'VLESS Reality Explained: The Most Censorship-Resistant VPN Protocol',
    excerpt: 'A technical deep-dive into VLESS with XTLS Reality — why it\'s invisible to DPI systems that block conventional VPNs.',
    category: 'VPN',
    categoryColor: 'var(--violet)',
    date: 'May 15, 2026',
    readTime: '8 min',
    ogImage: 'https://www.imba.live/blog/og-vless-reality.png',
    content: `
## The arms race between VPNs and censorship

Every time a VPN protocol becomes popular, censors study its traffic patterns and add it to their blocklist. OpenVPN was blocked in China within months of widespread adoption. WireGuard, despite its elegance, has a recognizable handshake that DPI systems catch immediately in heavily restricted networks.

The industry response has been a series of obfuscation layers — making VPN traffic look like something else. Shadowsocks made it look like HTTPS. V2Ray added more sophistication. VLESS Reality takes a different approach entirely.

## What makes Reality different

Reality doesn't just imitate HTTPS — it actually uses real HTTPS infrastructure as its cover. Here's how:

**Standard TLS-based VPN:**
1. Client connects to server: "I'm starting a VPN session"
2. Server responds with its own VPN certificate
3. DPI inspection sees a VPN certificate and blocks it

**VLESS Reality:**
1. Client connects to server: "I'm connecting to apple.com"
2. Server presents apple.com's actual TLS certificate via domain fronting
3. DPI inspection sees a legitimate HTTPS connection to Apple
4. Traffic passes through — the actual payload is encrypted separately

This is the core insight: Reality leverages SNI (Server Name Indication) to present a legitimate domain's certificate to inspection systems, while the actual VPN tunnel runs underneath.

## The XTLS component

XTLS (Xtreme TLS) is the transport layer that makes this efficient. Standard VPN protocols encrypt traffic twice — once with TLS (for the transport) and once with the VPN's own encryption. XTLS recognizes when traffic is already encrypted (like HTTPS websites you visit) and passes it through without double-encrypting, cutting overhead dramatically.

Result: speeds close to your raw connection speed, especially for HTTPS traffic (which is most of what people actually use).

## Why DPI can't block it without collateral damage

The fundamental problem for censors: to block VLESS Reality, they'd have to block legitimate traffic to the domains being used as covers (Apple, Microsoft, Amazon). That would take down services their own government and population depends on.

This is why VLESS Reality has remained stable in China, UAE, and other censored networks even as they've aggressively blocked other protocols.

## Protocol comparison

| Protocol | Obfuscation method | DPI-resistant | Speed overhead |
|---|---|---|---|
| PPTP | None | No | None |
| OpenVPN | None | No | Medium |
| WireGuard | None | No (blocked in restricted networks) | Very low |
| Shadowsocks | AEAD cipher disguise | Partial | Very low |
| VLESS + Reality | Real TLS/domain fronting | Yes | Minimal |

## Using VLESS Reality with IMBA

IMBA runs VLESS Reality as its primary protocol on all servers. When you install Happ and add your subscription link, Reality is configured automatically. The only manual step: **disable Mux** in server settings (Mux interferes with Reality's TLS handling).

[Set up IMBA VPN](/auth/register)
    `.trim(),
  },
  {
    slug: 'esim-turkey-2026',
    title: 'eSIM in Turkey 2026: Best Plans and How to Stay Connected',
    excerpt: 'Traveling to Turkey? Here\'s how to get affordable mobile data without paying roaming fees — and what to know about internet access there.',
    category: 'eSIM',
    categoryColor: 'var(--blue)',
    date: 'June 25, 2026',
    readTime: '5 min',
    ogImage: 'https://www.imba.live/blog/og-esim-turkey.png',
    content: `
## Turkey: great destination, complicated internet

Turkey is one of the most visited countries in the world — Istanbul alone attracts over 15 million tourists a year. The mobile network is solid (Turkcell, Vodafone TR, and Turk Telekom provide strong 4G/5G coverage), but there's one catch: Turkey has one of the highest rates of website blocking in Europe. Social media platforms have been periodically blocked or throttled.

For most travelers, a combination of a local eSIM for data plus a VPN for unrestricted access is the practical solution.

## eSIM coverage in Turkey

IMBA eSIM connects to local Turkish carriers through roaming agreements, giving you 4G/LTE access across the country. Cities and tourist areas have excellent coverage. Remote eastern regions have more limited connectivity.

## Cost comparison

| Option | 1 week of data | Data included |
|---|---|---|
| Home carrier roaming | $25-70 | Usually 1-5 GB |
| Local SIM (airport) | $8-15 | 5-15 GB |
| IMBA eSIM | $6-12 | 3-10 GB |

The local SIM requires standing in a queue at the airport or hunting for a shop in the city. IMBA eSIM activates before you board.

## Setting up for Turkey: the checklist

**Before you leave:**
- Buy your IMBA eSIM Turkey plan
- Install the eSIM on your phone (Settings, then Mobile Network, then Add eSIM, then scan QR)
- Make sure IMBA VPN is set up on your devices

**On arrival:**
- Enable the eSIM profile and set it as your data line
- Keep your home SIM active (data roaming OFF) for calls
- Connect to IMBA VPN for unrestricted browsing

## Which phones work with eSIM in Turkey?

Turkey's carriers support eSIM on most modern iPhones and Android flagships. If your phone was carrier-locked in a country that restricts eSIM, you may need to unlock it first.

[Buy Turkey eSIM](/esim)
    `.trim(),
  },
  {
    slug: 'esim-iphone-setup',
    title: 'How to Set Up an eSIM on iPhone: Complete Step-by-Step Guide',
    excerpt: 'Everything you need to know to install and activate an eSIM on your iPhone — from iPhone XS to iPhone 16.',
    category: 'eSIM',
    categoryColor: 'var(--blue)',
    date: 'June 10, 2026',
    readTime: '4 min',
    ogImage: 'https://www.imba.live/blog/og-esim-iphone.png',
    content: `
## Which iPhones support eSIM?

All iPhones from **iPhone XS (2018)** onwards support eSIM. From **iPhone 14** (US models), the phone has no physical SIM slot at all — everything is eSIM-only.

Supported models:
- iPhone XS, XS Max, XR and later
- iPhone SE (2nd and 3rd generation)
- iPhone 11, 12, 13, 14, 15, 16 series

On iPhone 13 and earlier, you can have one physical SIM and one eSIM active simultaneously. From iPhone 14, you can have multiple eSIM profiles.

## Before you start

- Make sure your iPhone is unlocked (not carrier-locked). Go to Settings, then General, then About, and check "Carrier Lock"
- Have your IMBA eSIM QR code ready (find it in your dashboard after purchase)
- You'll need a Wi-Fi or cellular connection to download the eSIM profile

## Method 1: Scan the QR code

1. Go to **Settings, then Mobile Service** (or "Cellular" in some regions)
2. Tap **Add eSIM** (or "Add Cellular Plan")
3. Tap **Use QR Code**
4. Scan the QR code from your IMBA dashboard
5. Tap **Continue** when asked to activate the plan
6. Choose a label for the plan (e.g., "IMBA Travel")
7. Select which line to use for data: choose the eSIM for data when abroad

## Method 2: Enter details manually

If you can't scan the QR code, tap **Enter Details Manually** and type in the activation code (SM-DP+ address and activation code), available in your IMBA dashboard alongside the QR.

## Setting up dual SIM

After installing your eSIM:
1. Go to Settings, then Mobile Service
2. Tap the eSIM profile (e.g., "IMBA Travel")
3. Turn **Data Roaming** ON for the eSIM
4. Go back and set **Mobile Data** to use the eSIM
5. Keep your home SIM as the default for calls and texts

This way you receive calls on your regular number while using the IMBA eSIM for cheap local data.

## Troubleshooting

**"eSIM not supported"** — Your phone might be carrier-locked. Contact your carrier to unlock it.

**"Unable to complete cellular plan change"** — Restart your iPhone and try again. If the problem persists, try adding the eSIM via QR code instead of manual entry.

**No connection after activation** — Toggle Airplane Mode on and off. Make sure Data Roaming is enabled for the eSIM profile.

**QR code already used** — Each QR code can only be scanned once. Contact IMBA support to get a new one.

[Buy IMBA eSIM](/esim)
    `.trim(),
  },
  {
    slug: 'pay-chatgpt-from-russia',
    title: 'How to Pay for ChatGPT Plus from Anywhere in 2026',
    excerpt: 'Your card declined on OpenAI? A virtual card in USD solves the problem instantly — here\'s how to set it up.',
    category: 'Card',
    categoryColor: 'var(--green)',
    date: 'July 1, 2026',
    readTime: '4 min',
    ogImage: 'https://www.imba.live/blog/og-chatgpt-plus.png',
    content: `
## Why ChatGPT Plus payments fail

OpenAI uses Stripe for payment processing. Stripe declines cards from certain countries and cards issued by banks under sanctions. Even if ChatGPT itself is accessible in your country, the payment step can block you.

The practical solution: a virtual card issued outside the restricted banking system.

## What you need

- An IMBA virtual card (issued in USD by IMBA SRL, Costa Rica)
- A VPN connected to the US (for OpenAI's geo-checks)
- An OpenAI account

## Step 1: Issue your virtual card

1. Log into your [IMBA dashboard](https://www.imba.live/dashboard)
2. Go to the **Card** section
3. Issue a card in **USD**
4. Fund it via USDT, BTC, or bank transfer (minimum $25 recommended for the first month)

The card number is available instantly after funding.

## Step 2: Connect your VPN to a US server

OpenAI restricts ChatGPT Plus subscriptions to certain regions. Connect IMBA VPN to a US server (New York works well) before opening OpenAI's website.

## Step 3: Subscribe to ChatGPT Plus

1. Go to chat.openai.com while connected to a US VPN server
2. Click **Upgrade to Plus**, then **Subscribe**
3. Enter your IMBA virtual card details (card number, expiry, CVV)
4. For billing address, use any valid US address or ZIP code such as 10001
5. Complete payment

## If the payment fails

- Make sure your VPN is connected to a US server
- Check that the card has enough balance (ChatGPT Plus is $20/month)
- Try a different browser or incognito mode
- Clear cookies before trying again

## Keeping the subscription active

ChatGPT Plus renews monthly. Keep your IMBA card funded with at least $20 before each renewal date. You'll see the renewal date in your OpenAI account settings.

The VPN is only needed for the initial subscription — once subscribed, OpenAI doesn't require a VPN for regular usage in most countries.

[Get your virtual card](/virtual-card)
    `.trim(),
  },
  {
    slug: 'pay-netflix-from-russia',
    title: 'How to Subscribe to Netflix from Any Country in 2026',
    excerpt: 'Netflix blocks cards from certain countries and regions. A virtual card in USD or EUR solves this — with the right steps.',
    category: 'Card',
    categoryColor: 'var(--green)',
    date: 'June 15, 2026',
    readTime: '4 min',
    ogImage: 'https://www.imba.live/blog/og-netflix.png',
    content: `
## The Netflix payment problem

Netflix operates in 190+ countries but its payment processing is not universal. Cards from certain countries or banks get declined at checkout, even if Netflix is technically available in your region. This is a common frustration for expats, travelers, and users in countries with restricted banking.

The fix is straightforward: use a virtual card in USD or EUR from a non-restricted issuer.

## What you need

- An IMBA virtual card in USD or EUR
- A VPN to access the regional library you want (optional, but useful)

## Choosing your Netflix region

Netflix content varies significantly by country. The US library has the largest selection. UK, Canada, and Japan are also popular for their exclusive content.

With IMBA VPN, you can connect to a server in any of these countries and access that region's library.

## Step 1: Get your IMBA virtual card

1. Open your IMBA dashboard, then go to **Card**
2. Issue a card in **USD** (for Netflix US) or **EUR** (for European Netflix)
3. Fund it — Netflix plans range from $7 to $23/month depending on your plan and region

## Step 2: Connect to VPN (if needed)

If you want to access a specific Netflix region:
- Connect IMBA VPN to the relevant server (US, UK, etc.)
- Stay connected to the same region when signing up

## Step 3: Subscribe

1. Go to netflix.com
2. Choose your plan (Standard with ads is cheapest; Standard or Premium for HD/4K)
3. Enter your IMBA card details
4. For the billing address, use an address in the same country as your VPN server

## Notes on Netflix and VPNs

Netflix actively blocks known VPN IP ranges. IMBA uses residential and datacenter IPs that are not on Netflix's blocklists. If you get the "you seem to be using an unblocker or proxy" message, try a different server in the same country.

Once subscribed, you can watch Netflix on any device — phone, tablet, laptop, TV — using your regular account.

[Get your virtual card](/virtual-card)
    `.trim(),
  },
  {
    slug: 'vpn-smart-tv',
    title: 'VPN on Android TV: Setup in 10 Minutes',
    excerpt: 'How to install IMBA VPN on an Android TV box or smart TV with Android OS — step by step, with the Happ app.',
    category: 'VPN',
    categoryColor: 'var(--violet)',
    date: 'July 15, 2026',
    readTime: '5 min',
    ogImage: 'https://www.imba.live/blog/og-vpn-smart-tv.png',
    content: `
## Why put a VPN on your TV?

Two main reasons: access geo-blocked streaming content (Netflix US, BBC iPlayer, Disney+ libraries), and bypass censorship if you're in a country where streaming services or video platforms are restricted.

Android TV makes this possible because it runs full Android apps — including Happ, IMBA's VPN client.

## What you need

- An Android TV device (NVIDIA Shield, Xiaomi TV Box, Chromecast with Google TV, or a TV with built-in Android TV)
- Your IMBA subscription link (find it in your dashboard under VPN)
- A mouse or keyboard connected to the TV (helpful for typing the subscription URL)

## Step 1: Enable "Unknown sources"

Since Happ is not available on the Google Play Store in all regions, you need to allow installations from outside the store:

1. Go to Settings, then Security & Privacy (or Device Preferences, then Security)
2. Enable **Unknown sources** (or "Allow installation from unknown sources")

## Step 2: Install a file manager

If you don't have one, install **File Commander** or **FX File Explorer** from the Play Store — you'll need it to open the downloaded APK.

## Step 3: Download and install Happ

**Option A — via browser:**
1. Open the browser on your TV
2. Navigate to the APK download link (find it in your IMBA dashboard under "Download Happ for Android TV")
3. Download and open the file
4. Tap Install

**Option B — from a USB drive:**
1. Download the Happ APK on your phone or computer
2. Copy it to a USB drive
3. Plug the USB into your TV, open the file manager, and install

## Step 4: Add your subscription

1. Open Happ on the TV
2. Select **Subscription**, then **Add**
3. Enter your IMBA subscription URL (use a keyboard if available, or paste via clipboard from your phone using apps like Send Files to TV)

## Step 5: Configure and connect

1. Select a server from the list
2. Go to server settings, find **Mux**, and disable it
3. Tap **Connect**

Your TV traffic now routes through IMBA VPN. All streaming apps will see the IP of your chosen server.

## Tips

- **Netflix**: connect to a US server for the US library, UK for BBC content
- **Speed**: pick the server with the lowest ping for the smoothest streaming
- **Reconnect on startup**: in Happ settings, enable auto-connect so VPN restarts automatically after a reboot

[Get IMBA VPN free for 7 days](/auth/register)
    `.trim(),
  },
  {
    slug: 'happ-setup',
    title: 'How to Download and Set Up Happ for IMBA VPN',
    excerpt: 'A complete guide to installing and configuring the Happ app on Android, iOS, Windows, and macOS to use IMBA VPN.',
    category: 'VPN',
    categoryColor: 'var(--violet)',
    date: 'July 5, 2026',
    readTime: '6 min',
    ogImage: 'https://www.imba.live/blog/og-happ-setup.png',
    content: `
## What is Happ?

Happ is the VPN client app that powers IMBA VPN. It supports VLESS Reality and WireGuard protocols and works on Android, iOS, Windows, macOS, and Linux. You add your IMBA subscription link to Happ, and it automatically pulls all available servers.

## Before you start

You need an IMBA account and your subscription link:
1. Sign up at [imba.live](https://www.imba.live/auth/register)
2. Follow IMBA on Telegram to activate your free 7-day trial
3. In your dashboard, go to **VPN** and copy the **subscription link**

## Installing on Android

1. Open your IMBA dashboard on your Android phone
2. Go to VPN, then Download Happ, then tap the Android link
3. Download the APK file
4. When prompted, allow installation from this source
5. Install and open

Note: Happ may not appear in your regional Play Store. The APK from the dashboard is the official version.

## Installing on iOS

1. In your IMBA dashboard, go to VPN, then Download Happ, then iOS
2. You'll be directed to the App Store or TestFlight depending on availability in your region
3. Install and open Happ

## Installing on Windows

1. Download the Setup .exe from your IMBA dashboard (VPN, then Download Happ, then Windows)
2. Run the installer: Next, Next, Finish
3. Open Happ from the Start menu

## Installing on macOS

1. Download the .dmg from your IMBA dashboard (VPN, then Download Happ, then macOS)
2. Open the .dmg and drag Happ to Applications
3. Open from Applications (you may need to right-click, then Open the first time, since it's downloaded from outside the App Store)

## Adding your subscription link

This step is the same on all platforms:

1. Open Happ
2. Tap or click the **+** button, then **Add subscription**
3. Paste your IMBA subscription URL (copied from your dashboard)
4. Confirm — Happ will download the server list

## Critical: disable Mux

After adding the subscription, you must disable Mux before connecting:

1. Long-press (or right-click) any server, then **Edit**
2. Find the **Mux** setting, and turn it **OFF**
3. Save

Alternatively, if there's a global Mux setting in Happ's preferences, disable it there. **VLESS Reality does not work with Mux enabled.**

## Connecting and choosing a server

1. From the server list, tap any server to select it
2. Tap **Connect** (or the power button icon)
3. Accept the VPN permission request on your device
4. You're connected — look for the VPN icon in your status bar

Choosing the right server: the ping shown next to each server is your latency. Lower ping means faster response. For streaming, pick a server in the country whose library you want to access. For privacy only, pick the nearest server with the lowest ping.

## Troubleshooting

| Problem | Solution |
|---|---|
| Can't connect | Mux is likely still enabled — disable it |
| Slow speeds | Switch to a different server |
| Connection drops frequently | Try VLESS Reality on a different port (options in server settings) |
| iOS says VPN configuration failed | Delete and reinstall the VPN profile in Settings, then VPN |

[Start your free trial](/auth/register)
    `.trim(),
  },
  {
    slug: 'vpn-android',
    title: 'VPN on Android in 2026: The Complete Setup Guide',
    excerpt: 'How to install IMBA VPN on any Android phone in under 5 minutes — using the Happ app with VLESS Reality protocol.',
    category: 'VPN',
    categoryColor: 'var(--violet)',
    date: 'July 15, 2026',
    readTime: '5 min',
    ogImage: 'https://www.imba.live/blog/og-vpn-android.png',
    content: `
## Why standard VPN apps don't work everywhere

Most VPN apps on the Play Store use OpenVPN or WireGuard. These protocols have recognizable traffic patterns — DPI systems in China, UAE, Turkey, and other countries identify and block them. The result: your VPN connects, then stops working. Or doesn't connect at all.

IMBA VPN uses VLESS Reality, which looks like regular HTTPS traffic to your ISP. It passes deep packet inspection in every major censored network.

## What you need

- Any Android phone running Android 5.0 or later
- Your IMBA subscription link (from your dashboard)
- 5 minutes

## Step 1: Create your IMBA account

Sign up at [imba.live](https://www.imba.live/auth/register) with your email. Follow IMBA on Telegram and activate the free 7-day trial in your dashboard.

## Step 2: Copy your subscription link

In your dashboard, go to VPN, find the subscription link block, and tap **Copy**.

## Step 3: Download and install Happ

Happ may not be available in your regional Play Store. Download the APK directly:

1. In your IMBA dashboard, go to VPN, then **Download Happ**, then Android
2. On your phone, open the downloaded APK
3. If prompted, tap **Settings** to allow installation from this source, then go back and install
4. Open Happ

## Step 4: Add your subscription

1. In Happ, tap **+**, then **Add subscription**
2. Paste your subscription link
3. Tap OK — the server list loads automatically

## Step 5: Disable Mux (required)

1. Long-press any server in the list, then **Edit**
2. Find **Mux**, and turn it **OFF**
3. Save

This is mandatory. VLESS Reality won't work with Mux enabled.

## Step 6: Connect

Tap a server, then tap **Connect**, then accept the VPN permission prompt.

You're connected. Verify by opening a blocked website or checking your IP at whatismyip.com.

## Battery and performance

VLESS Reality uses minimal battery — XTLS avoids double encryption, so the overhead is close to zero. You won't notice the VPN running in terms of battery life.

## Frequently asked questions

### Does it work on older Android phones?

Happ supports Android 5.0+. Performance may be limited on very old hardware, but it will function.

### Can I use one subscription on multiple phones?

Yes. Paste the same subscription link into Happ on any number of devices.

### What if the APK gets blocked?

Your IMBA dashboard always has the latest download links, including mirrors. If one link is blocked, use the mirror.

[Start your 7-day free trial](/auth/register)
    `.trim(),
  },
  {
    slug: 'vpn-iphone',
    title: 'VPN on iPhone in 2026: 5-Minute Setup Guide',
    excerpt: 'Install IMBA VPN on your iPhone with the Happ app and VLESS Reality protocol. Works where other VPNs get blocked.',
    category: 'VPN',
    categoryColor: 'var(--violet)',
    date: 'July 15, 2026',
    readTime: '4 min',
    ogImage: 'https://www.imba.live/blog/og-vpn-iphone.png',
    content: `
## Why most VPN apps on the App Store don't work in censored countries

VPN apps available in Apple's regional App Stores are frequently removed at the request of local authorities. Apps that remain often use protocols (OpenVPN, WireGuard) that get blocked by DPI systems anyway.

IMBA VPN uses VLESS Reality — a protocol that makes your VPN traffic look like HTTPS to your carrier. It works in China, UAE, Turkey, and other restricted networks.

## What you need

- iPhone running iOS 14 or later
- An IMBA account with your subscription link
- 5 minutes

## Step 1: Create your account and get your subscription link

Sign up at [imba.live](https://www.imba.live/auth/register). Follow IMBA on Telegram, activate the free 7-day trial, and copy your subscription link from the VPN section of your dashboard.

## Step 2: Install Happ on iPhone

Depending on your App Store region, you have two options:

**Option A — App Store:**
In your IMBA dashboard, go to VPN, then Download Happ, then iOS. If the App Store link is available in your region, install directly.

**Option B — TestFlight:**
If the App Store version isn't available in your region, use the TestFlight link from your dashboard. TestFlight is Apple's official beta app distribution platform — no sideloading required.

## Step 3: Add your subscription

1. Open Happ
2. Tap **+**, then **Add subscription**
3. Paste your IMBA subscription link
4. Tap OK

Happ downloads the server list automatically.

## Step 4: Disable Mux

1. Long-press a server, then **Edit**
2. Find **Mux**, and set it to **OFF**
3. Save

Required step — VLESS Reality doesn't work with Mux enabled.

## Step 5: Connect

Tap a server, then tap **Connect**, then approve the VPN configuration request (you'll see "VPN" in your status bar when connected).

## Tips

- **Lowest ping is fastest**: the dashboard shows server latency. Pick the lowest ping for general use
- **Streaming**: pick a server in the country whose content library you want to access
- **Always-on VPN**: in iOS Settings, then VPN, then IMBA, you can set it to always reconnect if the connection drops

## Troubleshooting

**"Cannot connect to the server"** — check that Mux is disabled. This is the cause in 90% of cases.

**App disappeared from App Store** — use the TestFlight version from your dashboard. Apple periodically removes VPN apps at local authority requests; TestFlight bypasses this.

**Slow speeds** — try a different server. Geographic distance matters; pick servers closer to you for everyday use.

[Start your 7-day free trial](/auth/register)
    `.trim(),
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug)
}
