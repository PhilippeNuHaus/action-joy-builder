

## Plan: Update Default Letter Text

**One file to change:** `src/components/SenatorContactForm.tsx`

Replace the `DEFAULT_MESSAGE` constant with the new letter text. The sender's name already appears via the form's firstName/lastName fields — no changes needed there.

The new default message will end with `Sincerely,` followed by a blank line, and the user's name will continue to be captured separately by the form fields and included in the email as it already is.

