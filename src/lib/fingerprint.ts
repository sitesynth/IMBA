import FingerprintJS from '@fingerprintjs/fingerprintjs'

let agent: Promise<import('@fingerprintjs/fingerprintjs').Agent> | null = null

export async function getFingerprint(): Promise<string | null> {
  try {
    if (!agent) agent = FingerprintJS.load()
    const fp = await agent
    const result = await fp.get()
    return result.visitorId
  } catch {
    return null
  }
}
