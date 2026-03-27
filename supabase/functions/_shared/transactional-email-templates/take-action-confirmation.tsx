import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Right to Know"
const SITE_URL = "https://righttoknow-blakespear.org"
const SHARE_MESSAGE = `A dangerous loophole is allowing polluting industrial projects to bypass environmental review—and put our communities at risk. I just took action to support efforts to fix it. You can too: ${SITE_URL} #SaveCEQA`
const FACEBOOK_QUOTE = "Protect our communities from toxic pollution. Thank Senator Blakespear for fighting to restore CEQA protections."
...
          <Button
            style={fbButton}
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(FACEBOOK_QUOTE)}`}
          >
            Share on Facebook
          </Button>
        </Section>
        <Section style={socialButtonsRow}>
          <Button
            style={twitterButton}
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_MESSAGE)}`}
          >
            Share on X (Twitter)
          </Button>
        </Section>
        <Section style={socialButtonsRow}>
          <Button
            style={linkedinButton}
            href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(SHARE_MESSAGE)}`}
          >
            Share on LinkedIn
          </Button>
        </Section>

        <Hr style={divider} />

        <Text style={text}>
          Every message, every share, every conversation helps build the pressure needed to protect our communities and restore transparency.
        </Text>

        <Text style={text}>
          Thanks again for stepping up—we couldn't do this without you.
        </Text>

        <Text style={signoff}>
          Sincerely,
        </Text>

        <Text style={signoff}>
          The {SITE_NAME} Team
        </Text>

        <Hr style={divider} />

        <Text style={footerText}>
          Right To Know is a Planning and Conservation League Campaign.
        </Text>

        <Text style={linkText}>
          <Link href={SITE_URL} style={linkStyle}>{SITE_URL.replace('https://', 'www.')}</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: TakeActionConfirmationEmail,
  subject: 'Thank you for taking action — here\'s how to do even more',
  displayName: 'Take Action confirmation',
  previewData: { firstName: 'Jane' },
} satisfies TemplateEntry

// Styles — brand colors from the app
const goldColor = 'hsl(45, 100%, 50%)'
const navyColor = 'hsl(220, 30%, 12%)'

const main = { backgroundColor: '#ffffff', fontFamily: "'Open Sans', Arial, sans-serif" }
const container = { padding: '0 25px 30px' }
const accentBar = { backgroundColor: goldColor, height: '4px', margin: '0 0 30px' }
const h1 = { fontSize: '24px', fontWeight: '700' as const, color: navyColor, margin: '0 0 20px', fontFamily: "'Oswald', Arial, sans-serif" }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.7', margin: '0 0 16px' }
const subheading = { fontSize: '16px', fontWeight: '700' as const, color: navyColor, margin: '0 0 12px', fontFamily: "'Oswald', Arial, sans-serif", textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const divider = { borderColor: '#e5e5e5', margin: '24px 0' }
const quoteBlock = { backgroundColor: '#f5f5f0', padding: '16px 20px', borderLeft: `3px solid ${goldColor}`, margin: '0 0 16px' }
const quoteText = { fontSize: '14px', color: '#444444', lineHeight: '1.7', margin: '0', fontStyle: 'italic' as const, whiteSpace: 'pre-wrap' as const }
const socialButtonsRow = { margin: '0 0 8px' }
const fbButton = {
  backgroundColor: '#1877F2',
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '2px',
  fontWeight: '600' as const,
  fontSize: '13px',
  textDecoration: 'none',
  fontFamily: "'Oswald', Arial, sans-serif",
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}
const twitterButton = {
  backgroundColor: '#000000',
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '2px',
  fontWeight: '600' as const,
  fontSize: '13px',
  textDecoration: 'none',
  fontFamily: "'Oswald', Arial, sans-serif",
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}
const linkedinButton = {
  backgroundColor: '#0A66C2',
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '2px',
  fontWeight: '600' as const,
  fontSize: '13px',
  textDecoration: 'none',
  fontFamily: "'Oswald', Arial, sans-serif",
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}
const signoff = { fontSize: '15px', color: '#333333', lineHeight: '1.5', margin: '0 0 4px', fontWeight: '600' as const }
const footerText = { fontSize: '12px', color: '#999999', lineHeight: '1.4', margin: '0 0 4px', fontStyle: 'italic' as const }
const linkText = { fontSize: '12px', margin: '8px 0 0' }
const linkStyle = { color: goldColor }
