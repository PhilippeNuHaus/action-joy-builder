## Fix: iPhone H1 spacing

The previous edit set `leading-none` on the H1 on mobile, which collapsed the line-height inside spans that wrap to a second line ("Catherine Blakespear for" → "Catherine Blakespear" / "FOR"). That made "FOR" sit too close to "BLAKESPEAR" while sibling spans still had the gap-4 between them — uneven rhythm.

### Change

In `src/components/HeroSection.tsx`, on the H1 element only:

- Apply `leading-[1.2]` to all child spans on mobile (md and up reverts to `leading-normal`).
- This gives every wrapped line the same ~20% extra breathing room, matching the gap-4 rhythm between sibling spans.
- Desktop and iPad untouched.

### Technical

Replace the H1 wrapper class:

```tsx
<h1 className="font-heading text-2xl md:text-4xl lg:text-[2.8rem] font-bold uppercase mb-10 flex flex-col items-center gap-4 leading-[1.2] md:leading-normal [&>span]:leading-[1.2] md:[&>span]:leading-normal">
```

And drop the per-span `leading-[1.2]` override on the "Protecting Our Community" line since it's now inherited.

No other files change.
