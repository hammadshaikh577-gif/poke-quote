# POKE.QUOTE

## Product concept and build brief for Claude Code

**Tagline:** Gotta catch a quote!
build this app live
## 1. Project overview

Build a fully functional, playful, Pokémon-inspired random quote
generator using Next.js, React, TypeScript, Tailwind CSS and 8bitcn
components.

The experience should feel like playing a nostalgic Pokémon Game Boy
mini-game, with a polished, responsive interface and satisfying
interactions.

The central concept:

Users choose one of four identical, mysterious Poké Balls. The selected
ball shakes, opens, and reveals a randomly selected Pokémon. The Pokémon
speaks in its own fictional gibberish language, which is then playfully
"translated" into a random quote.

This should feel like an interactive mini-game, not a conventional quote
website.

> The world is full of wisdom. Sometimes it just takes a Pikachu to
> explain it.

------------------------------------------------------------------------

## 2. Core experience

1.  The user lands on the welcome screen.
2.  Four identical Poké Balls are displayed at the bottom of the screen.
3.  The user chooses any Poké Ball.
4.  The selected ball shakes and opens with an 8-bit flash effect.
5.  A random Pokémon appears: Pikachu, Charizard, Greninja, or Lucario.
6.  The Pokémon speaks in its own fictional gibberish language.
7.  A translation animation plays.
8.  The gibberish transforms into a meaningful random quote.
9.  The user can copy or favourite the quote, or summon another Pokémon.

### Mystery mechanic --- essential

The four Poké Balls must remain visually identical.

-   Do not display Pokémon names beneath or beside the Poké Balls.
-   Do not use character-specific colours, icons, silhouettes, or clues
    on the Poké Balls.
-   Do not associate a specific ball with a specific Pokémon.
-   Every Poké Ball independently triggers a random selection from the
    full set of four Pokémon.
-   The user must not know which Pokémon will appear until the ball
    opens.
-   The Pokémon reveal must happen after the opening animation, not
    during the initial shake.

Use the heading **"CHOOSE YOUR POKÉ BALL"** and the supporting line
**"Who's hiding inside?"**

The mystery is a defining part of the experience. Preserve it throughout
the design.

------------------------------------------------------------------------

## 3. Design direction

### Visual inspiration

-   Classic Pokémon Game Boy games.
-   8-bit and 16-bit pixel-art RPG interfaces.
-   Retro handheld gaming consoles.
-   Classic Pokémon battle screens and dialogue boxes.

### Visual characteristics

-   Pixelated borders and shadows.
-   Retro pixel typography.
-   Cream-coloured dialogue boxes.
-   Dark forest-green battle arena.
-   Vibrant Pokémon character accents.
-   Pixel-art illustrations and sprites.
-   Subtle CRT scanline effects.
-   Smooth but intentionally retro animations.

Avoid excessive gradients, glassmorphism, generic SaaS UI patterns, and
modern corporate layouts.

The result should look like a beautifully designed retro game.

------------------------------------------------------------------------

## 4. Main screen layout

### A. Top navigation

Include:

-   POKE.QUOTE logo.
-   Small retro subtitle: "Gotta catch a quote!"
-   Sound on/off toggle.
-   Favourite quotes icon with count.
-   Encounter counter.

### B. Main battle arena

This is the main visual focus.

**Initial state:**

-   Retro pixel-art grass or battle arena background.
-   Welcome message: "Welcome, Trainer!"
-   Main heading: "Who's speaking today?"
-   Supporting text: "Choose a Poké Ball and discover a little wisdom."
-   A pixel-art question mark or mystery character silhouette.
-   Subtle idle animation in the background.

**After a Pokémon is selected:**

-   Display its pixel-art sprite prominently.
-   Show its name and Pokémon type only after it has emerged.
-   Play an entrance animation.
-   Add subtle idle animations after the entrance.
-   Give each Pokémon its own accent colour and personality.

### C. Pokémon dialogue area

Create a retro RPG dialogue box beneath the battle arena.

Initial message:

"Waiting for a Pokémon to speak..."

After summoning:

-   Display the generated gibberish dialogue.
-   Animate the text using a typewriter effect.
-   Include a small speaking indicator or character portrait.
-   Make the dialogue feel like a classic RPG conversation.

### D. Translation area

Initially hidden or disabled.

After the gibberish dialogue:

-   Show "TRANSLATING POKÉMON LANGUAGE..."
-   Animate a short loading or translation sequence.
-   Transform the gibberish dialogue into the English quote.

Display:

-   Quote text.
-   Author attribution, when verified.
-   Quote category.

The quote panel should stand out while maintaining the retro aesthetic.

### E. Bottom Poké Ball selector

Create four large, identical, interactive classic red-and-white Poké
Balls arranged horizontally.

Each ball should have:

-   The same appearance and dimensions.
-   A pixel-art appearance.
-   Hover animation.
-   Press animation.
-   Selected/active state.
-   Accessible button semantics and keyboard support.

Do not add Pokémon names or character-specific hints to the balls.

Include a **"SURPRISE ME"** action that also randomly selects one of the
four Pokémon and starts the encounter sequence.

------------------------------------------------------------------------

## 5. Pokémon characters and personalities

Each Pokémon should have a distinct personality, speaking vocabulary,
animation style, and quote preference.

### Pikachu

-   Type: Electric.
-   Personality: Energetic, cheerful, enthusiastic.
-   Vocabulary: Pika, Pikachu, Chu, Pikaa, Pika-Pika.
-   Quote themes: Motivation, optimism, positivity.
-   Visual accent: Yellow.

### Charizard

-   Type: Fire / Flying.
-   Personality: Bold, powerful, confident.
-   Vocabulary: Raa, Char, Zard, Fwoosh, Raaa.
-   Quote themes: Courage, ambition, determination.
-   Visual accent: Red and orange.

### Greninja

-   Type: Water / Dark.
-   Personality: Calm, mysterious, strategic.
-   Vocabulary: Nja, Kree, Sha, Ninja, Njaa.
-   Quote themes: Wisdom, patience, self-reflection.
-   Visual accent: Blue.

### Lucario

-   Type: Fighting / Steel.
-   Personality: Deep, rhythmic, thoughtful.
-   Vocabulary: Lu, Ca, Rio, Aura, Riii.
-   Quote themes: Discipline, self-growth, resilience.
-   Visual accent: Purple.

The Pokémon's identity should only become visible after the Poké Ball
opens.

------------------------------------------------------------------------

## 6. Gibberish language system

Create a small vocabulary and sentence-generation system for each
Pokémon.

Requirements:

-   Generate a different sentence on each encounter where possible.
-   Use each Pokémon's own vocabulary and speaking pattern.
-   Vary sentence length, punctuation, and repetition.
-   Avoid displaying the same gibberish sentence repeatedly.
-   Keep the generated language playful and recognisable.
-   Pair the gibberish with the quote selected for that encounter.

The gibberish is fictional entertainment. It is not actual Pokémon
language translation.

Example dialogue:

  Pokémon     Example dialogue
  ----------- ----------------------------
  Pikachu     "Pika! Pika-chuuu! Pikaa!"
  Charizard   "Raaa! Charrr! Zaaard!"
  Greninja    "Nja! Njaaa! Kree-sha!"
  Lucario     "Lu-ca! Riii! Auraaa!"

------------------------------------------------------------------------

## 7. Quote generator logic

Create a local JSON database containing at least 60 unique quotes.

Include these categories:

-   Motivation
-   Wisdom
-   Life lessons
-   Love and friendship
-   Creativity
-   Humour
-   Philosophy
-   Self-growth

Each quote should contain:

-   Unique ID.
-   Quote text.
-   Author, only when verified; otherwise use "Anonymous".
-   Category.
-   Optional character association.

Requirements:

-   Randomly select a quote when a Pokémon is summoned.
-   Avoid immediately repeating the previous quote.
-   Allow quotes to repeat after the database is exhausted.
-   Match quote categories loosely to Pokémon personalities.
-   Include original, playful Pokémon-inspired quotes alongside
    established quotes.
-   Never fabricate an author's attribution.
-   Ensure the quote and gibberish are paired as part of the same
    encounter.

Example playful quotes:

-   "You don't need to have it all figured out."
-   "Even a Snorlax has its priorities straight."
-   "Sometimes doing nothing is doing something."
-   "Be the Charizard in a world full of Magikarps."

------------------------------------------------------------------------

## 8. Interaction and animation sequence

This sequence is critical to the experience.

### Step 1 --- Poké Ball activation

-   The selected Poké Ball shakes.
-   Use a quick, three-stage shake animation.
-   Keep the Pokémon identity hidden.
-   The ball opens with a pixelated flash.

### Step 2 --- Pokémon entrance

-   Display a flash or particle effect.
-   The randomly selected Pokémon sprite jumps into the arena.
-   Reveal its name and type.
-   Play a short entrance sound if audio is enabled.

### Step 3 --- Gibberish dialogue

-   Generate the Pokémon's fictional language.
-   Display it in the dialogue box.
-   Use a typewriter effect.
-   Play subtle typing sounds if audio is enabled.

### Step 4 --- Translation

-   Show "TRANSLATING..."
-   Display a short loading animation.
-   Transform the gibberish dialogue into the English quote.

### Step 5 --- Quote reveal

-   Reveal the quote with a satisfying pixel-inspired animation.
-   Display attribution and category.
-   Enable Copy and Favourite actions.

### Animation and state requirements

-   Keep the sequence smooth and reasonably quick.
-   Allow users to summon another Pokémon at any time.
-   Selecting another ball must cancel the previous sequence and start a
    new encounter cleanly.
-   Prevent overlapping animation sequences and race conditions.
-   Respect reduced-motion accessibility preferences.
-   Do not reveal the Pokémon before the Poké Ball opens.

------------------------------------------------------------------------

## 9. Functional features

### Copy quote

-   Copy the currently displayed quote to the clipboard.
-   Display an 8-bit toast notification confirming success.
-   Handle clipboard errors gracefully.

### Favourite quote

-   Add or remove quotes from favourites.
-   Persist favourites in localStorage.
-   Show the number of saved quotes in the top navigation.

### Favourite collection

Create a collection view displaying:

-   Saved quote text.
-   Quote authors.
-   Quote categories.
-   Pokémon associated with the encounter.
-   Remove-from-favourites action.
-   Copy action.

Include a thoughtful empty state when there are no saved quotes.

### Sound controls

Include:

-   Poké Ball opening sound.
-   Pokémon entrance sound.
-   Dialogue typing sound.
-   Quote reveal sound.

Use lightweight generated audio or permitted sound assets.

Sound must be OFF by default until the user enables it. The sound toggle
must work throughout the application.

### Encounter counter

Track:

-   Total encounters.
-   Individual Pokémon encounter counts.
-   Unique quotes discovered.

Persist these values in localStorage.

### Surprise Me

-   Randomly select one of the four Pokémon.
-   Start the complete encounter sequence.
-   Do not reveal the selection before the reveal animation.

------------------------------------------------------------------------

## 10. 8bitcn components

Use 8bitcn components wherever appropriate.

Official documentation:

https://www.8bitcn.com/docs

Prioritise:

-   8-bit Button.
-   8-bit Card.
-   8-bit Badge.
-   8-bit Dialogue.
-   8-bit Toast.
-   8-bit Item.
-   8-bit Progress.
-   Other suitable retro components.

Use the official documentation to verify component APIs before
implementation. Install components using the appropriate shadcn/8bitcn
registry workflow.

Do not force every component into the design. Use custom CSS and React
components for the battle arena, Poké Balls, pixel-art animations, and
typewriter dialogue.

Maintain consistent styling throughout.

------------------------------------------------------------------------

## 11. Asset requirements

Use suitable pixel-art sprites for:

-   Pikachu.
-   Charizard.
-   Greninja.
-   Lucario.

Also create:

-   Classic red-and-white Poké Ball sprites.
-   Retro battle arena background.
-   Pixel-art effects and particles.
-   Small UI icons where needed.

The four Poké Balls must be visually identical and must not reveal which
Pokémon will appear.

If suitable assets are unavailable, create original CSS/SVG pixel-art
placeholders.

Keep assets organised inside a `public/assets` directory.

Do not rely on fragile third-party image URLs. Preserve pixel-art
crispness using `image-rendering: pixelated` where appropriate.

Use assets you have permission to use. Do not present the project as an
official Pokémon product.

------------------------------------------------------------------------

## 12. Responsive design

### Desktop

-   Centre the main battle arena.
-   Display the Pokémon prominently.
-   Arrange four Poké Balls horizontally at the bottom.
-   Keep dialogue and quote panels clearly visible.

### Mobile

-   Stack the battle arena and dialogue sections vertically.
-   Keep all four Poké Balls in a single row where space permits.
-   Use comfortable touch targets.
-   Keep quote text readable.
-   Avoid horizontal overflow.
-   Keep important actions accessible without excessive scrolling.

The mobile layout should feel intentionally designed, not like a resized
desktop layout.

------------------------------------------------------------------------

## 13. Technical requirements

Recommended stack:

  Layer         Technology
  ------------- -----------------------------------------
  Framework     Next.js
  UI            React
  Language      TypeScript
  Styling       Tailwind CSS
  Components    8bitcn and shadcn/ui
  Animation     Framer Motion
  Icons         Lucide React
  Quote data    Local JSON database
  Persistence   Browser localStorage
  Sound         Web Audio API or permitted audio assets

No backend or external API is required for the first version.

Organise code into reusable components. Keep quote data, Pokémon
configurations, gibberish generation, persistence, and animation state
management separate from presentation components.

Suggested component structure:

-   `AppHeader`
-   `BattleArena`
-   `PokemonCharacter`
-   `PokemonSprite`
-   `PokeBallSelector`
-   `PokeBall`
-   `PokemonDialogue`
-   `TranslationPanel`
-   `QuoteCard`
-   `QuoteActions`
-   `FavouriteCollection`
-   `SoundController`
-   `EncounterCounter`

Suggested data and logic modules:

-   `data/quotes.json`
-   `data/pokemon.ts`
-   `lib/gibberish-generator.ts`
-   `lib/quote-selector.ts`
-   `lib/storage.ts`
-   `hooks/useEncounter.ts`
-   `hooks/useSound.ts`

------------------------------------------------------------------------

## 14. Accessibility and quality

Pay special attention to:

-   Visual hierarchy.
-   Spacing and alignment.
-   Pixel-art consistency.
-   Animation timing.
-   Colour contrast.
-   Typography.
-   Responsive behaviour.
-   Hover, focus, and active states.
-   Keyboard navigation.
-   Accessible labels for all four mystery Poké Balls.
-   Reduced-motion preferences.
-   Empty, loading, and error states.

Every button must work.

Every Poké Ball must trigger a random encounter.

The quote generator must generate different quotes.

Favourite functionality must persist after refresh.

Copy functionality must work.

Sound controls must work.

Do not leave placeholder buttons or non-functional interactions.

------------------------------------------------------------------------

## 15. Development process

Before coding:

1.  Inspect the existing project structure.
2.  Check the current framework and dependencies.
3.  Read the 8bitcn documentation.
4.  Plan the component architecture.
5.  Identify the assets needed.

Implement in logical stages:

**Stage 1:** Main layout and visual design.

**Stage 2:** Mystery Poké Ball selector and random encounter
functionality.

**Stage 3:** Gibberish generator and quote database.

**Stage 4:** Animation and sound effects.

**Stage 5:** Favourites, copy functionality, encounter counter, and
localStorage.

**Stage 6:** Responsive design, accessibility, and testing.

Do not stop after creating the initial layout. Complete the functional
experience.

Run the application, test all interactions, and fix errors before
considering the project complete.

------------------------------------------------------------------------

## 16. Definition of done

The project is complete when:

-   The application launches successfully.
-   Four identical, unlabeled Poké Balls appear on the home screen.
-   Clicking any ball can summon any of the four Pokémon.
-   The Pokémon remains hidden until the ball opens.
-   Each Pokémon has its own personality and gibberish vocabulary.
-   Gibberish is displayed before the quote.
-   The translation sequence reveals a random quote.
-   Quotes do not immediately repeat.
-   Copy and Favourite actions work.
-   Favourites and encounter statistics persist after refresh.
-   Sound can be enabled and disabled.
-   The interface works on desktop and mobile.
-   Animations can be interrupted safely by a new encounter.
-   No important controls are non-functional.

## Final goal

Create a delightful, polished, fully functional retro Pokémon-inspired
quote generator.

The experience should make users want to keep clicking mysterious Poké
Balls just to discover which Pokémon will appear and what it has to say.

It should feel like a tiny nostalgic game, not a standard quote website.
