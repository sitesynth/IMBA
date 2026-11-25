import type { ReactNode } from 'react'
import Link from 'next/link'

const BASE = 'https://api.imba.live/v1/partner'

const SECTIONS = [
  ['start', 'Quick start'],
  ['auth', 'Authentication'],
  ['catalog-esim', 'eSIM catalog'],
  ['catalog-vpn', 'VPN catalog'],
  ['order-esim', 'Buy an eSIM'],
  ['order-vpn', 'Buy or extend VPN'],
  ['trial', 'VPN trial key'],
  ['keys', 'VPN keys: status, block, unblock'],
  ['orders', 'Order history'],
  ['balance', 'Balance and top-up'],
  ['domain', 'Your own domain'],
  ['webhooks', 'Webhooks'],
  ['idempotency', 'Idempotency'],
  ['errors', 'Errors and limits'],
] as const

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-gray-900 text-gray-100 rounded-xl px-4 py-3.5 text-[13px] leading-relaxed overflow-x-auto font-mono">
      <code>{children.trim()}</code>
    </pre>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 scroll-mt-6">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  )
}

function Endpoint({ method, path }: { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; path: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${method === 'GET' ? 'bg-green-100 text-green-700' : method === 'DELETE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
        {method}
      </span>
      <span className="text-gray-900 break-all">{path}</span>
    </div>
  )
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] text-gray-700 leading-relaxed">{children}</p>
}

function Ic({ children }: { children: ReactNode }) {
  return <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-[13px] font-mono">{children}</code>
}


/** The API description. Shown on the public /api page and as a tab of the API cabinet (`embedded`). */
export function DocsContent({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className="space-y-6">
        <div className="space-y-3 pb-2">
          <h1 className="text-4xl font-bold tracking-tight">IMBA API</h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Sell eSIM data plans and VPN subscriptions from your own app, bot or site. You top up a balance, we
            issue the product and take the price from it.
          </p>
          <nav className="flex flex-wrap gap-2 pt-2" aria-label="Sections">
            {SECTIONS.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-100">
                {label}
              </a>
            ))}
          </nav>
        </div>

        <Section id="start" title="Quick start">
          <P>
            Every request goes to <Ic>{BASE}</Ic> over HTTPS and returns JSON. All prices are in US dollars.
          </P>
          <ol className="list-decimal pl-5 space-y-1.5 text-[15px] text-gray-700">
            <li>
              {embedded ? (
                <>
                  Get your key on the <Link href="/api/cabinet" className="text-blue-600 hover:underline">Overview</Link> tab.
                </>
              ) : (
                <>
                  <Link href="/auth/login?for=partner&redirect=%2Fapi%2Fcabinet" className="text-blue-600 hover:underline">Sign in</Link>{' '}
                  with your IMBA account (or create one) and open the IMBA API cabinet to get a key.
                </>
              )}{' '}
              It is shown once, so keep it in your server config, never in a browser or app.
            </li>
            <li>
              Top up your balance with crypto{' '}
              {embedded
                ? <>(<Link href="/api/cabinet/topup" className="text-blue-600 hover:underline">Top up</Link> tab)</>
                : <>(<a href="#balance" className="text-blue-600 hover:underline">details</a>)</>}.
            </li>
            <li>Read the catalog, pick a <Ic>sku</Ic>, and place the order.</li>
          </ol>
          <Code>{`
curl ${BASE}/me \\
  -H "Authorization: Bearer imba_live_xxxxxxxx"
`}</Code>
          <Code>{`
{
  "name": "TravelBot",
  "status": "active",
  "balance_usd": 42.5,
  "limits": {
    "requests_per_minute": 60, "daily_spend_usd": 200.0, "spent_today_usd": 3.4,
    "trials_per_day": 100, "trials_today": 12
  }
}
`}</Code>
        </Section>

        <Section id="auth" title="Authentication">
          <P>
            Send the key as a bearer token: <Ic>Authorization: Bearer &lt;key&gt;</Ic>. The header{' '}
            <Ic>X-API-Key: &lt;key&gt;</Ic> works as well. A missing or wrong key returns <Ic>401</Ic>; a suspended key
            returns <Ic>403</Ic>.
          </P>
          <P>
            Call the API from your server. If a key leaks, we replace it and the old one stops working at once.
          </P>
        </Section>

        <Section id="catalog-esim" title="eSIM catalog">
          <Endpoint method="GET" path="/catalog/esim" />
          <P>Every country we cover, with the number of packages and the lowest price:</P>
          <Code>{`
{
  "currency": "USD",
  "countries": [
    { "code": "DE", "name": "Germany", "packages": 24, "from_price_usd": 0.72 },
    { "code": "TH", "name": "Thailand", "packages": 40, "from_price_usd": 0.68 }
  ]
}
`}</Code>
          <Endpoint method="GET" path="/catalog/esim?country=TH" />
          <P>
            The packages for one country (ISO 3166-1 alpha-2 code). The <Ic>sku</Ic> is our own package id: stable, and the only thing you pass when ordering.
          </P>
          <Code>{`
{
  "currency": "USD",
  "country": "TH",
  "name": "Thailand",
  "packages": [
    { "sku": "imba_rkcnusvuczf6", "name": "Thailand 1 GB, 30 days", "data_gb": 1.0,
      "duration_days": 30, "speed": "4G/5G", "price_usd": 3.99 }
  ]
}
`}</Code>
          <P>
            The catalog is refreshed from our suppliers every 30 minutes and answers in milliseconds, so you can read
            it on every page view. Prices can change between refreshes: the price you are charged is the one in
            the order response.
          </P>
        </Section>

        <Section id="catalog-vpn" title="VPN catalog">
          <Endpoint method="GET" path="/catalog/vpn" />
          <Code>{`
{
  "currency": "USD",
  "plans": [
    { "months": 1, "price_usd": 2.99 },
    { "months": 3, "price_usd": 7.49 },
    { "months": 6, "price_usd": 13.49 },
    { "months": 12, "price_usd": 19.99 }
  ]
}
`}</Code>
          <P>
            A VPN key is sold in whole months: 1, 3, 6 or 12. The price of a plan does not change when you
            extend an existing key — you always pay for the number of months you add. If you need a shorter
            period than a month, take a trial key (up to 7 days, free) or write to us: we can issue a key with
            a custom length.
          </P>
        </Section>

        <Section id="order-esim" title="Buy an eSIM">
          <Endpoint method="POST" path="/orders/esim" />
          <P>
            Body: <Ic>sku</Ic> (required) and <Ic>label</Ic> (optional note, up to 100 characters). Send an{' '}
            <Ic>Idempotency-Key</Ic> header (<a href="#idempotency" className="text-blue-600 hover:underline">why</a>).
          </P>
          <Code>{`
curl -X POST ${BASE}/orders/esim \\
  -H "Authorization: Bearer imba_live_xxxxxxxx" \\
  -H "Idempotency-Key: order-2041" \\
  -H "Content-Type: application/json" \\
  -d '{"sku": "imba_rkcnusvuczf6", "label": "Anna, Bangkok trip"}'
`}</Code>
          <Code>{`
{
  "order_id": "a5f0b74b-b1b2-44a0-90f4-490e6477adfa",
  "kind": "esim",
  "sku": "imba_rkcnusvuczf6",
  "name": "Thailand 1 GB, 30 days",
  "country": "TH",
  "data_gb": 1.0,
  "duration_days": 30,
  "iccid": "8910300000012345678",
  "activation_code": "LPA:1$smdp.example.com$ABCD-1234",
  "qr_code": "https://api.imba.live/v1/partner/qr/a5f0b74b-b1b2-44a0-90f4-490e6477adfa.png",
  "charged_usd": 3.99,
  "balance_usd": 38.51
}
`}</Code>
          <P>
            Show the customer the <Ic>qr_code</Ic> image, or give them the <Ic>activation_code</Ic> to type in under
            Settings, Cellular, Add eSIM. The QR image is a plain link that works in an <Ic>&lt;img&gt;</Ic> tag or an
            e-mail; anyone who has the link can see the code, so send it only to your customer. If the order fails,
            you are not charged.
          </P>
        </Section>

        <Section id="order-vpn" title="Buy or extend VPN">
          <Endpoint method="POST" path="/orders/vpn" />
          <P>
            Body: <Ic>months</Ic> (one of the plans in the VPN catalog). Add <Ic>key_id</Ic> to extend a key you
            bought earlier instead of issuing a new one.
          </P>
          <Code>{`
curl -X POST ${BASE}/orders/vpn \\
  -H "Authorization: Bearer imba_live_xxxxxxxx" \\
  -H "Idempotency-Key: vpn-2042" \\
  -H "Content-Type: application/json" \\
  -d '{"months": 3}'
`}</Code>
          <Code>{`
{
  "order_id": "9d1c2f3e-1b2a-4c5d-8e9f-0a1b2c3d4e5f",
  "kind": "vpn",
  "key_id": "7e0ec2f7-0cf4-48e9-875c-64ab77f587b7",
  "subscription_url": "https://vpn.imba.live/4aW06QUhcCV8pPHA",
  "months": 3,
  "expires_at": "2027-02-06T19:23:42+00:00",
  "charged_usd": 7.49,
  "balance_usd": 34.33
}
`}</Code>
          <P>
            <Ic>subscription_url</Ic> is a standard subscription link. It opens in Happ, V2Box and other clients that
            import VLESS subscriptions, and lists every server we run. Keep the <Ic>key_id</Ic>
            to extend the key later. Extending keeps the same link and adds the plan to the current end date (or to
            today if the key has already expired). A key you blocked with <Ic>/disable</Ic> cannot be extended until
            you unblock it: the request returns <Ic>409</Ic>.
          </P>
        </Section>

        <Section id="trial" title="VPN trial key">
          <Endpoint method="POST" path="/orders/vpn-trial" />
          <P>
            A 7-day trial key. Body: <Ic>days</Ic> (optional, 1 to 7, default 7). It needs an{' '}
            <Ic>Idempotency-Key</Ic> like any order. A trial costs nothing by default and has a traffic cap
            (20 GB by default); the response shows the price actually charged and the cap. You can issue up to
            100 trials a day; the limits can be changed for your account on request.
          </P>
          <Code>{`
curl -X POST ${BASE}/orders/vpn-trial \\
  -H "Authorization: Bearer imba_live_xxxxxxxx" \\
  -H "Idempotency-Key: trial-2043" \\
  -H "Content-Type: application/json" \\
  -d '{"days": 7}'
`}</Code>
          <Code>{`
{
  "order_id": "b1f4c1de-6a2e-4d3c-9a77-2f0e8b6c1a10",
  "kind": "vpn",
  "trial": true,
  "key_id": "b2cc5ddc-c0f4-4d0a-a4ff-deb712eb51fc",
  "subscription_url": "https://vpn.imba.live/43cHrvcgvewLpT6q",
  "days": 7,
  "expires_at": "2026-11-24T11:43:55+00:00",
  "traffic_limit_gb": 20.0,
  "charged_usd": 0.0,
  "balance_usd": 20.0
}
`}</Code>
          <P>
            Devices are counted by the panel by HWID. We set no device limit by default. On request we can set
            a limit for your trial keys only (for example 3 devices): it applies to trial keys issued after the
            change, and keys issued earlier keep the limit they had unless we update them. The limit of a key is{' '}
            <Ic>devices.limit</Ic> in <Ic>GET /keys/{'{key_id}'}</Ic> (<Ic>null</Ic> means no limit).
          </P>
          <P>
            To turn a trial into a paid key, extend it with <Ic>POST /orders/vpn</Ic> and its <Ic>key_id</Ic>. The
            link stays the same, the plan is added to the current end date, the trial 20 GB cap is removed and{' '}
            <Ic>trial</Ic> becomes <Ic>false</Ic> in <Ic>GET /keys/{'{key_id}'}</Ic>. A device limit that was set
            for trial keys only is lifted at the same time; a limit we set for all your keys stays.
          </P>
        </Section>

        <Section id="keys" title="VPN keys: status, block, unblock">
          <Endpoint method="GET" path="/keys?limit=50&offset=0" />
          <P>
            The keys you issued, newest first (up to 200 per page): <Ic>key_id</Ic>, <Ic>state</Ic>,{' '}
            <Ic>subscription_url</Ic>, <Ic>expires_at</Ic>, <Ic>days_left</Ic>, <Ic>created_at</Ic>. This list is
            cheap to call. Traffic and last connection are only in the single-key request below.
          </P>
          <Endpoint method="GET" path="/keys/{key_id}" />
          <P>
            One key with live data from our VPN panel. <Ic>state</Ic> is <Ic>active</Ic>, <Ic>throttled</Ic> (a paid key
            that used its 300 GB for the month: the speed is cut to 10 Mbit until the 1st of next month, the key keeps
            working), <Ic>limited</Ic> (a trial that used its 20 GB cap: no connection; renew the key to lift it),{' '}
            <Ic>disabled</Ic> (blocked by you) or <Ic>expired</Ic> (the paid period ended). <Ic>last_online_at</Ic> and{' '}
            <Ic>first_connected_at</Ic> are <Ic>null</Ic> until the customer connects for the first time.
          </P>
          <Code>{`
curl ${BASE}/keys/7e0ec2f7-0cf4-48e9-875c-64ab77f587b7 \
  -H "Authorization: Bearer imba_live_xxxxxxxx"
`}</Code>
          <Code>{`
{
  "key_id": "7e0ec2f7-0cf4-48e9-875c-64ab77f587b7",
  "state": "active",
  "trial": false,
  "subscription_url": "https://vpn.imba.live/4aW06QUhcCV8pPHA",
  "expires_at": "2027-02-06T19:23:42+00:00",
  "days_left": 91,
  "created_at": "2026-11-08T19:23:42",
  "last_online_at": "2026-11-17T08:41:10.000Z",
  "first_connected_at": "2026-11-08T20:02:11.000Z",
  "devices": { "limit": 5, "connected": 2 },
  "traffic": { "used_bytes": 5368709120, "lifetime_bytes": 21474836480, "limit_bytes": null }
}
`}</Code>
          <P>
            When a paid key reaches 300 GB, the current server address stops working and the customer&apos;s app moves
            to the slower 10 Mbit server the next time it refreshes the subscription. We ask apps to refresh every
            hour, so the break is normally up to about an hour; an app with auto-update turned off needs a manual
            refresh. The check itself runs hourly. On the 1st of the month the key goes back to full speed, again
            after the app refreshes.
          </P>
          <P>
            <Ic>trial</Ic> is <Ic>true</Ic> for a trial key and turns <Ic>false</Ic> once you extend it. <Ic>devices.limit</Ic> is the number of devices the key allows (<Ic>null</Ic> when unlimited) and{' '}
            <Ic>devices.connected</Ic> is how many are registered on it now. <Ic>traffic.limit_bytes</Ic> is <Ic>null</Ic> when no cap is set. <Ic>traffic</Ic> and <Ic>devices</Ic> are{' '}
            <Ic>null</Ic> if the VPN panel did not answer; the other fields are still returned.
          </P>
          <Endpoint method="POST" path="/keys/{key_id}/disable" />
          <P>
            Blocks the key right away, for example for non-payment on your side. The customer&apos;s apps lose access
            at their next connection or subscription refresh. The end date stays as it was and nothing is refunded.
            Calling it again on a blocked key is safe. Returns the same body as <Ic>GET /keys/{'{key_id}'}</Ic>.
          </P>
          <Endpoint method="POST" path="/keys/{key_id}/enable" />
          <P>
            Unblocks a key you disabled, with the same link and the same end date. An expired key cannot be
            enabled: renew it with <Ic>POST /orders/vpn</Ic> and <Ic>key_id</Ic> instead. To stop a customer
            without blocking, simply do not renew: the key stops working on its end date.
          </P>
          <Code>{`
curl -X POST ${BASE}/keys/7e0ec2f7-0cf4-48e9-875c-64ab77f587b7/disable \
  -H "Authorization: Bearer imba_live_xxxxxxxx"
`}</Code>
        </Section>

        <Section id="orders" title="Order history">
          <Endpoint method="GET" path="/orders?limit=50" />
          <Endpoint method="GET" path="/orders/{order_id}" />
          <P>
            Your latest orders (up to 200) and a single order, in the same shape the purchase returned, plus{' '}
            <Ic>created_at</Ic>.
          </P>
        </Section>

        <Section id="balance" title="Balance and top-up">
          <Endpoint method="GET" path="/me" />
          <P>Returns <Ic>balance_usd</Ic> and your limits.</P>
          <Endpoint method="POST" path="/topup" />
          <P>
            Creates a crypto invoice (paid in cryptocurrency through Heleket). Body: <Ic>amount_usd</Ic>, from 5 to
            5000. Send the customer or your accountant to <Ic>payment_url</Ic>; the balance is credited automatically
            after the network confirms the payment.
          </P>
          <Code>{`
curl -X POST ${BASE}/topup \\
  -H "Authorization: Bearer imba_live_xxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"amount_usd": 100}'
`}</Code>
          <Code>{`
{ "payment_id": "heleket_7a19aeb9-cd74-4c62-91a9-5fbdd7641e33",
  "payment_url": "https://pay.heleket.com/pay/...", "amount_usd": 100.0 }
`}</Code>
          <Endpoint method="GET" path="/topups" />
          <P>Your latest top-ups with their status (<Ic>pending</Ic>, <Ic>confirmed</Ic>, <Ic>expired</Ic>).</P>
          <P>
            Your balance is <Ic>balance_usd</Ic> in <Ic>GET /me</Ic> and in every order response. Top-ups can be
            followed with the <Ic>topup.confirmed</Ic> webhook event.
          </P>
        </Section>

        <Section id="domain" title="Your own domain">
          <P>
            Your customers can see your domain instead of ours in two places: the server addresses inside the
            subscription, and the subscription link itself. Both are optional, independent and managed through
            the API. Domains under <Ic>imba.live</Ic> are not accepted.
          </P>
          <Endpoint method="PUT" path="/domain" />
          <P>
            Body: <Ic>node_domain</Ic> (server addresses, for example <Ic>nodes.example.com</Ic>) and/or{' '}
            <Ic>subscription_domain</Ic> (the link, for example <Ic>vpn.example.com</Ic>). Send one or both; a field
            you leave out stays as it was. A new <Ic>subscription_domain</Ic> replaces the previous one.
          </P>
          <Code>{`
curl -X PUT ${BASE}/domain \\
  -H "Authorization: Bearer imba_live_xxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"node_domain": "nodes.example.com", "subscription_domain": "vpn.example.com"}'
`}</Code>
          <Endpoint method="GET" path="/domain?check=true" />
          <Endpoint method="GET" path="/domain/records?check=true" />
          <Endpoint method="DELETE" path="/domain" />
          <P>
            <Ic>GET /domain</Ic> returns your settings and what to create at your DNS provider. With{' '}
            <Ic>check=true</Ic> every record is resolved and reported as <Ic>ok</Ic> or <Ic>missing</Ic>.{' '}
            <Ic>DELETE</Ic> removes both domains: keys go back to our link and our addresses.
          </P>

          <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">Server addresses</h3>
          <P>
            Pick one of two ways. Locations change over time; with the first one you never touch DNS again.
          </P>
          <ul className="list-disc pl-5 text-[15px] text-gray-700 leading-relaxed space-y-1">
            <li>
              <strong>Delegate the subdomain (recommended).</strong> At your DNS provider create two NS records for{' '}
              <Ic>nodes.example.com</Ic>: <Ic>ns1.imba.live</Ic> and <Ic>ns2.imba.live</Ic>. We answer for every
              name under it, so a new or replaced location works at once, with nothing for you to do. The whole
              subdomain then belongs to us, so use one you do not need for anything else.
            </li>
            <li>
              <strong>Create the CNAME records yourself.</strong> <Ic>GET /domain/records</Ic> lists them: for each
              location a <Ic>host</Ic> to create and the <Ic>cname_target</Ic> it must point to. A replaced
              location keeps its record. When a location is added, you need one new record; we send the{' '}
              <Ic>domain.records_changed</Ic> webhook event with the new name.
            </li>
          </ul>
          <P>
            A server address is replaced in your customers' subscriptions only while its name resolves, so a
            missing record never breaks a connection: that server simply keeps our address. Names keep working when
            we move a location to another host.
          </P>
          <Code>{`
{
  "node_domain": "nodes.example.com",
  "available": true,
  "records": [
    { "name": "prague", "host": "prague.nodes.example.com",
      "cname_target": "prague.nodes.imba.live", "status": "ok" },
    { "name": "lisbon", "host": "lisbon.nodes.example.com",
      "cname_target": "lisbon.nodes.imba.live", "status": "missing" }
  ],
  "subscription_domain": null
}
`}</Code>

          <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">Subscription link</h3>
          <P>
            After <Ic>PUT /domain</Ic> with <Ic>subscription_domain</Ic>, create one CNAME record at your DNS
            provider: your domain pointing to the <Ic>cname.target</Ic> from the response (currently{' '}
            <Ic>fallback.imba.live</Ic>). We issue the TLS certificate automatically, usually within a few
            minutes. Poll <Ic>GET /domain</Ic> until <Ic>live</Ic> is <Ic>true</Ic>; until then your keys keep our
            link. From that moment <Ic>subscription_url</Ic> in order and key responses uses your domain.
          </P>
          <Code>{`
{
  "subscription_domain": {
    "domain": "vpn.example.com",
    "cname": { "host": "vpn.example.com", "target": "fallback.imba.live" },
    "status": "active",
    "ssl_status": "active",
    "live": true,
    "errors": []
  }
}
`}</Code>
          <P>
            The path of the link stays the same (the short key id), only the host changes, so links you already
            handed out keep working. The link opens in the same clients with the same servers. If the domain
            sits behind Cloudflare, keep this record on DNS only (grey cloud).
          </P>
        </Section>

        <Section id="webhooks" title="Webhooks">
          <P>
            Instead of polling, give us an HTTPS address and we call it when something changes. Events are detected
            every few minutes, so expect a delay of up to about 5 minutes.
          </P>
          <Endpoint method="PUT" path="/webhook" />
          <P>
            Body: <Ic>url</Ic> (public <Ic>https://</Ic> address, no credentials in it) and optional{' '}
            <Ic>rotate_secret</Ic>. The response contains the signing <Ic>secret</Ic> only the first time (and after a
            rotation), so save it. You get events that happen after you register; older states are not replayed.
          </P>
          <Code>{`
curl -X PUT ${BASE}/webhook \\
  -H "Authorization: Bearer imba_live_xxxxxxxx" -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/imba-hook"}'
`}</Code>
          <Code>{`
{ "configured": true, "url": "https://example.com/imba-hook",
  "events": ["key.expiring", "key.expired", "key.limited", "key.throttled", "key.first_connected", "topup.confirmed"],
  "secret": "whsec_..." }
`}</Code>
          <Endpoint method="GET" path="/webhook" />
          <Endpoint method="DELETE" path="/webhook" />
          <Endpoint method="POST" path="/webhook/test" />
          <P>
            Sends a <Ic>webhook.test</Ic> event right now, with one attempt and no retries, and returns{' '}
            <Ic>delivered</Ic>, <Ic>status_code</Ic> and <Ic>error</Ic>. It needs a URL set with <Ic>PUT /webhook</Ic>,
            otherwise it answers <Ic>409</Ic>.
          </P>
          <Endpoint method="GET" path="/webhook/deliveries?limit=50" />
          <P>
            The latest events (up to 200) with their delivery status: <Ic>pending</Ic> (waiting or being retried),{' '}
            <Ic>delivered</Ic> or <Ic>failed</Ic> (gave up). Use it to see why your endpoint is not receiving events.
          </P>
          <Code>{`
{
  "deliveries": [
    { "id": "5b0b7d3e-...", "event": "key.expired", "status": "delivered", "attempts": 1,
      "created_at": "2026-11-20T11:30:00+00:00", "delivered_at": "2026-11-20T11:30:01+00:00",
      "last_status_code": 200, "last_error": null },
    { "id": "9c1f2a40-...", "event": "key.limited", "status": "pending", "attempts": 2,
      "created_at": "2026-11-20T11:35:00+00:00", "delivered_at": null,
      "last_status_code": 500, "last_error": "HTTP 500" }
  ]
}
`}</Code>
          <P>Events, each reported once per state:</P>
          <ul className="text-[15px] text-gray-700 leading-relaxed list-disc pl-5 space-y-1">
            <li><Ic>key.expiring</Ic>: a paid key ends within 3 days, a trial within 24 hours. Fields: <Ic>key_id</Ic>, <Ic>trial</Ic>, <Ic>expires_at</Ic>, <Ic>days_left</Ic>.</li>
            <li><Ic>key.expired</Ic>: the period ended. Fields: <Ic>key_id</Ic>, <Ic>trial</Ic>, <Ic>expires_at</Ic>.</li>
            <li><Ic>key.throttled</Ic>: a paid key used its 300 GB and is cut to 10 Mbit until the 1st. Fields: <Ic>key_id</Ic>, <Ic>trial</Ic>, <Ic>speed_limit_mbit</Ic>, <Ic>restored_at</Ic>.</li>
            <li><Ic>key.limited</Ic>: a trial used its 20 GB cap and stopped working. Fields: <Ic>key_id</Ic>, <Ic>trial</Ic>, <Ic>used_bytes</Ic>, <Ic>limit_bytes</Ic>.</li>
            <li><Ic>key.first_connected</Ic>: the customer connected for the first time. Fields: <Ic>key_id</Ic>, <Ic>first_connected_at</Ic>.</li>
            <li><Ic>topup.confirmed</Ic>: a balance top-up was paid. Fields: <Ic>payment_id</Ic>, <Ic>amount_usd</Ic>, <Ic>balance_usd</Ic>.</li>
            <li><Ic>domain.records_changed</Ic>: a location was added or removed, so the records for your <Ic>node_domain</Ic> changed. Fields: <Ic>node_domain</Ic>, <Ic>added</Ic>, <Ic>removed</Ic> (names). Sent only if you set a <Ic>node_domain</Ic>; you need it only when you create the CNAME records yourself.</li>
          </ul>
          <P>Keys you blocked with <Ic>/disable</Ic> produce no events. After you renew a key, it can report expiry again for the new date.</P>
          <Code>{`
POST https://example.com/imba-hook
Content-Type: application/json
X-IMBA-Event: key.expired
X-IMBA-Delivery: 5b0b7d3e-...        (unique id of this event, use it to ignore repeats)
X-IMBA-Timestamp: 1763640000
X-IMBA-Signature: t=1763640000,v1=<hex hmac>

{ "id": "5b0b7d3e-...", "event": "key.expired", "created_at": "2026-11-20T11:30:00+00:00",
  "data": { "key_id": "7e0ec2f7-...", "trial": false, "expires_at": "2026-11-20T11:00:00+00:00" } }
`}</Code>
          <P>
            Verify the signature: compute HMAC-SHA256 with your secret over <Ic>timestamp + &quot;.&quot; + raw body</Ic>, compare
            it with <Ic>v1</Ic>, and reject requests whose timestamp is more than 5 minutes old.
          </P>
          <Code>{`
import hmac, hashlib

def valid(secret, header_ts, raw_body, header_sig):
    expected = hmac.new(secret.encode(), f"{header_ts}.".encode() + raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(header_sig.split("v1=")[1], expected)
`}</Code>
          <P>
            Answer with any <Ic>2xx</Ic> within 10 seconds. Otherwise we retry after 1 minute, 5 minutes, 30 minutes, 2
            hours and 12 hours, then give up (the event stays in <Ic>/webhook/deliveries</Ic> as <Ic>failed</Ic> for 30
            days). Redirects are not followed. The same event can arrive twice, so make your handler idempotent.
          </P>
        </Section>

        <Section id="idempotency" title="Idempotency">
          <P>
            Orders move money, and networks drop connections. Every purchase needs an <Ic>Idempotency-Key</Ic> header
            (8 to 80 characters, for example your own order number). If you repeat a request with the same key, we
            return the original result with <Ic>&quot;idempotent_replay&quot;: true</Ic> and do not charge again. Use a
            new key for a new purchase. Reusing a key for a different kind of order returns <Ic>409</Ic>.
          </P>
        </Section>

        <Section id="errors" title="Errors and limits">
          <P>
            Errors return a JSON body <Ic>{`{"detail": "..."}`}</Ic> and an HTTP status:
          </P>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['400', 'Bad request: a missing idempotency key, an unknown VPN plan, a top-up outside 5 to 5000, or an invalid webhook URL.'],
                  ['401', 'Missing or invalid API key.'],
                  ['402', 'Not enough balance for this order. Top up and retry.'],
                  ['403', 'The key is suspended.'],
                  ['404', 'Unknown sku, country, key_id or order.'],
                  ['409', 'The idempotency key is already in use by another request; or the key is blocked and cannot be renewed; or it has expired and cannot be enabled; or you called /webhook/test with no webhook URL set.'],
                  ['422', 'A field failed validation, such as trial days outside 1 to 7.'],
                  ['429', 'Too many requests (the response carries a Retry-After header), the daily spend limit or the daily trial limit is reached.'],
                  ['502 / 503', 'A supplier, the VPN panel or the payment provider failed. Check the order or key state before retrying.'],
                ].map(([code, text]) => (
                  <tr key={code}>
                    <td className="px-4 py-2.5 font-mono text-gray-900 whitespace-nowrap">{code}</td>
                    <td className="px-4 py-2.5 text-gray-700">{text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>
            New keys start at 60 requests per minute with no daily spend limit. The limits are shown in{' '}
            <Ic>GET /me</Ic>; the rate can be raised on request.
          </P>
          <P>
            The rate limit counts requests <Ic>per API key</Ic>, not per IP address. If every request for your
            customers comes through one server of yours, that does not change anything — the limit is still
            counted on your key.
          </P>
        </Section>

        <p className="text-sm text-gray-500 pb-8">
          Questions or higher limits: <a href="https://t.me/imba_live_bot" className="text-blue-600 hover:underline">@imba_live_bot</a> on Telegram.
        </p>
    </div>
  )
}
