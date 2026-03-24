import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Right to Know"
const SITE_URL = "https://righttoknow-blakespear.org"

interface TakeActionConfirmationProps {
  firstName?: string
}

const TakeActionConfirmationEmail = ({ firstName }: TakeActionConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thank you for standing up for your community</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Gold accent bar */}
        <Section style={accentBar} />

        <Heading style={h1}>
          {firstName ? `Thank you, ${firstName}!` : 'Thank you for taking action!'}
        </Heading>

        <Text style={text}>
          Your message to Senator Blakespear has been sent. Every voice counts toward closing the advanced manufacturing loophole in CEQA and protecting our communities.
        </Text>

        <Hr style={divider} />

        <Text style={subheading}>Keep the pressure on — here's what else you can do:</Text>

        <Section style={buttonSection}>
          <Button style={primaryButton} href="mailto:senator.blakespear@senate.ca.gov">
            Email the Senator Directly
          </Button>
        </Section>

        <Section style={buttonSection}>
          <Button style={secondaryButton} href="tel:+19168516038">
            Call: (916) 651-6038
          </Button>
        </Section>

        <Hr style={divider} />

        <Text style={footerText}>
          Together, we can ensure communities have the right to know about dangerous facilities being built in our neighborhoods.
        </Text>

        <Text style={footerText}>
          — The {SITE_NAME} Team
        </Text>

        <Text style={linkText}>
          <Link href={SITE_URL} style={linkStyle}>{SITE_URL}</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: TakeActionConfirmationEmail,
  subject: 'Your voice has been heard — thank you for taking action',
  displayName: 'Take Action confirmation',
  previewData: { firstName: 'Jane' },
} satisfies TemplateEntry

// Styles — brand colors from the app
const goldColor = 'hsl(45, 100%, 50%)'
const navyColor = 'hsl(220, 30%, 12%)'
const mutedColor = 'hsl(210, 20%, 70%)'

const main = { backgroundColor: '#ffffff', fontFamily: "'Open Sans', Arial, sans-serif" }
const container = { padding: '0 25px 30px' }
const accentBar = { backgroundColor: goldColor, height: '4px', margin: '0 0 30px' }
const h1 = { fontSize: '24px', fontWeight: '700' as const, color: navyColor, margin: '0 0 20px', fontFamily: "'Oswald', Arial, sans-serif", textTransform: 'uppercase' as const }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 20px' }
const subheading = { fontSize: '14px', fontWeight: '600' as const, color: navyColor, margin: '0 0 16px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const divider = { borderColor: '#e5e5e5', margin: '24px 0' }
const buttonSection = { margin: '0 0 12px' }
const primaryButton = {
  backgroundColor: goldColor,
  color: navyColor,
  padding: '12px 24px',
  borderRadius: '2px',
  fontWeight: '700' as const,
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  textDecoration: 'none',
  fontFamily: "'Oswald', Arial, sans-serif",
}
const secondaryButton = {
  backgroundColor: navyColor,
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '2px',
  fontWeight: '600' as const,
  fontSize: '13px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  textDecoration: 'none',
  fontFamily: "'Oswald', Arial, sans-serif",
}
const footerText = { fontSize: '13px', color: '#777777', lineHeight: '1.5', margin: '0 0 8px' }
const linkText = { fontSize: '12px', margin: '16px 0 0' }
const linkStyle = { color: goldColor }
