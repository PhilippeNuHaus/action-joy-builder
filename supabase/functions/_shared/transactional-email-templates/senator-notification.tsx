import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Right to Know"

interface SenatorNotificationProps {
  firstName?: string
  lastName?: string
  email?: string
  address?: string
  zip?: string
  message?: string
}

const SenatorNotificationEmail = ({
  firstName = '',
  lastName = '',
  email = '',
  address = '',
  zip = '',
  message = '',
}: SenatorNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Constituent message regarding SB 954 and CEQA protections</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={accentBar} />

        <Heading style={h1}>
          Constituent Message
        </Heading>

        <Text style={infoText}>
          My name is <strong>{firstName} {lastName}</strong> and I am a verified constituent of Senate District 38.
        </Text>
        <Text style={verifiedAddress}>
          Verified constituent address: {address}, {zip}
        </Text>

        <Hr style={divider} />

        <Text style={subheading}>Message:</Text>
        <Text style={messageText}>
          {message}
        </Text>

        <Hr style={divider} />

        <Text style={infoText}>
          Contact email: {email}
        </Text>

        <Text style={footerText}>
          This message was sent via {SITE_NAME} (righttoknow-blakespear.org). The sender's address has been verified as being within Senate District 38.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: SenatorNotificationEmail,
  subject: (data: Record<string, any>) =>
    `Constituent Message: ${data.firstName || ''} ${data.lastName || ''} — SB 954 / CEQA`,
  displayName: 'Senator notification',
  previewData: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    address: '123 Main St',
    zip: '92024',
    message: 'Dear Senator Blakespear,\n\nThank you for authoring SB 954...',
  },
} satisfies TemplateEntry

// Styles
const goldColor = 'hsl(45, 100%, 50%)'
const navyColor = 'hsl(220, 30%, 12%)'

const main = { backgroundColor: '#ffffff', fontFamily: "'Open Sans', Arial, sans-serif" }
const container = { padding: '0 25px 30px' }
const accentBar = { backgroundColor: goldColor, height: '4px', margin: '0 0 30px' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: navyColor, margin: '0 0 20px', fontFamily: "'Oswald', Arial, sans-serif", textTransform: 'uppercase' as const }
const subheading = { fontSize: '13px', fontWeight: '600' as const, color: navyColor, margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoText = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 8px' }
const messageText = { fontSize: '14px', color: '#333333', lineHeight: '1.8', margin: '0 0 16px', whiteSpace: 'pre-wrap' as const }
const divider = { borderColor: '#e5e5e5', margin: '24px 0' }
const footerText = { fontSize: '12px', color: '#999999', lineHeight: '1.4', margin: '0', fontStyle: 'italic' as const }
