'use client'
import { SocialVerify } from './SocialVerify'

export function SocialVerifyWrapper() {
  return <SocialVerify onActivated={() => window.location.reload()} />
}
