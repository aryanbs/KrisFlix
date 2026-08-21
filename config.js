/* ============================================================
   SITE_CONFIG — everything editable lives in this file.

   ADDING REAL MEDIA
   ------------------
   Any item can carry a "media" object to power its Play button:
     media: { type: "video", src: "media/first-date.mp4" }
     media: { type: "image", src: "media/us-at-dinner.heic" }
   Supported: .mp4 / .mov for video, .jpg/.jpeg/.png/.heic/.heif
   for images (HEIC is auto-converted in the browser).
   Leave "media" out entirely (or src: "") and the Play button
   will show a friendly "add your media here" placeholder instead
   of erroring — nothing breaks while you're still collecting files.

   The hero's "video" field is the looping muted background clip
   behind "Us — Season One". Leave it blank to keep the gradient.
   ============================================================ */

const SITE_CONFIG = {

  profiles: [
    // Add a real photo by setting "photo" to a path, e.g. "media/kristina.jpg" —
    // the profile picker and nav will automatically use it instead of the initial.
    { id: "kristina", label: "Kristina", initial: "K", photo: "", locked: false },
    {
      id: "us",
      label: "Us",
      initial: "U",
      photo: "",
      locked: true,
      lockMessage: "🔒 Unlocks at our 2-month anniversary."
    }
  ],

  // Text that updates when you switch profiles in the top nav
  personalization: {
    kristina: {
      heroEyebrow: "RECOMMENDED FOR KRISTINA",
      continueRow: "Continue Watching for Kristina"
    },
    us: {
      heroEyebrow: "US ORIGINAL · SPECIAL",
      continueRow: "Continue Watching for Us"
    }
  },

  couple: {
    // Everything you'd want to change for the nav timer lives right here.
    startDate: "2026-07-22T00:00:00",
    milestoneLabel: "Day 30 of forever",
    milestoneNote: "One month down. Every episode so far has been worth it."
  },

  hero: {
    eyebrow: "US ORIGINAL · SPECIAL",
    title: "Us — Season One",
    tagline: "A slow-burn romance, one month in, already renewed for a lifetime.",
    meta: ["2026", "1 Season", "Romance, Comedy, Real Life"],
    synopsis: "The story of two people who somehow keep choosing each other, one very unserious text at a time. Critics (me) call it the best thing that's happened all year.",
    poster: "poster-a", // gradient fallback while there's no real background video
    video: "" // e.g. "media/hero-background.mp4" — muted looping background
  },

  rows: [
    {
      id: "continue-watching",
      title: "Continue Watching for Kristina",
      layout: "wide",
      items: [
        {
          id: "our-story",
          title: "Our Story",
          blurb: "Day 30 of forever",
          synopsis: "The story so far: one very lucky first message, a lot of overthinking, and somehow, one whole month. Still no notes.",
          tag: "S1 · Episode: Today",
          badge: "NEW EPISODE",
          gradient: "poster-a",
          progress: 100,
          media: { type: "", src: "" }
        }
      ]
    },
    {
      id: "how-we-met",
      title: "Chapter One: How We Met",
      layout: "poster",
      items: [
        { id: "first-hello", title: "The First Hello", blurb: "Where it all started", synopsis: "In which one of us finally says something, and the other one actually replies. A slow start with a great payoff.", tag: "Ep. 1", gradient: "poster-b", media: { type: "", src: "" } },
        { id: "nervous-texting", title: "Nervous Texting 101", blurb: "A masterclass in overthinking", synopsis: "Featuring seventeen drafts of a single text message and one very unnecessary amount of screenshotting friends for advice.", tag: "Ep. 2", gradient: "poster-c", media: { type: "", src: "" } },
        { id: "the-first-date", title: "The First Date", blurb: "Nobody knew where to sit", synopsis: "Two people, one table, and a conversation that somehow never ran out. A quiet classic.", tag: "Ep. 3", gradient: "poster-d", media: { type: "", src: "" } },
        { id: "overthinking-comedy", title: "Overthinking Every Text (A Comedy)", blurb: "Based on true events", synopsis: "An unflinching look at reading the same message eleven times before replying with 'haha yeah'.", tag: "Ep. 4", gradient: "poster-e", media: { type: "", src: "" } },
        { id: "falling-slowly", title: "Falling, Slowly", blurb: "Then all at once", synopsis: "The episode where it stopped being 'talking' and started being something worth showing up for, every day.", tag: "Ep. 5", gradient: "poster-f", media: { type: "", src: "" } }
      ]
    },
    {
      id: "date-nights",
      title: "Date Night Collection",
      layout: "poster",
      items: [
        { id: "dinner-bad-jokes", title: "Dinner & Bad Jokes", blurb: "5-star food, 2-star puns", synopsis: "A romantic dinner, mostly derailed by terrible jokes that somehow landed anyway.", tag: "Special", gradient: "poster-c", media: { type: "", src: "" } },
        { id: "movie-not-watched", title: "The Movie We Didn't Watch", blurb: "0% plot retention", synopsis: "We pressed play. We remember none of it. 10/10, would recommend.", tag: "Special", gradient: "poster-a", media: { type: "", src: "" } },
        { id: "late-night-drives", title: "Late Night Drives", blurb: "No destination, all vibes", synopsis: "Just the two of us, questionable music choices, and conversations that got a little too honest.", tag: "Special", gradient: "poster-d", media: { type: "", src: "" } },
        { id: "cooking-disaster", title: "Cooking Disaster: The Sequel", blurb: "Smoke alarm's favorite episode", synopsis: "We tried to cook something impressive. The smoke alarm disagreed. We ordered takeout and called it a win.", tag: "Special", gradient: "poster-b", media: { type: "", src: "" } },
        { id: "stargazing", title: "Stargazing (Unscripted)", blurb: "Mostly just talked, tbh", synopsis: "Technically we went to look at stars. Mostly we just talked until 2am and forgot to look up.", tag: "Special", gradient: "poster-f", media: { type: "", src: "" } }
      ]
    },
    {
      id: "inside-jokes",
      title: "Inside Jokes: The Series",
      layout: "poster",
      items: [
        { id: "that-one-text", title: "That One Text", blurb: "You know the one", synopsis: "We are legally not allowed to explain this one in writing. You know exactly what it is.", tag: "Cult classic", gradient: "poster-e", media: { type: "", src: "" } },
        { id: "nickname-origins", title: "The Nickname Origins", blurb: "An origin story", synopsis: "How a completely normal name turned into something only we're allowed to use.", tag: "Cult classic", gradient: "poster-a", media: { type: "", src: "" } },
        { id: "running-bit", title: "Running Bit: Vol. 1", blurb: "Still not old yet", synopsis: "The joke that should have stopped being funny weeks ago. It has not stopped being funny.", tag: "Cult classic", gradient: "poster-c", media: { type: "", src: "" } },
        { id: "do-not-ask", title: "Do Not Ask About This", blurb: "Viewer discretion advised", synopsis: "Some stories are better left as inside jokes. This is one of them.", tag: "Cult classic", gradient: "poster-d", media: { type: "", src: "" } },
        { id: "meme-that-started-it", title: "The Meme That Started It All", blurb: "Screenshot preserved forever", synopsis: "A single meme, sent at exactly the right moment, that somehow changed everything.", tag: "Cult classic", gradient: "poster-b", media: { type: "", src: "" } }
      ]
    },
    {
      id: "little-things",
      title: "Little Things I Love About You",
      layout: "poster",
      items: [
        { id: "your-laugh", title: "Your Laugh", blurb: "Best sound in the house", synopsis: "Loud, unfiltered, and immediately contagious. The best part of any room.", tag: "Fan favorite", gradient: "poster-f", media: { type: "", src: "" } },
        { id: "the-way-you", title: "The Way You Care About Everything", blurb: "Even the small stuff", synopsis: "How you show up for the little things, every single time, without being asked.", tag: "Fan favorite", gradient: "poster-a", media: { type: "", src: "" } },
        { id: "terrible-puns", title: "Your Terrible Puns", blurb: "Groan-worthy, every time", synopsis: "Objectively bad. Somehow still makes me laugh every single time.", tag: "Fan favorite", gradient: "poster-c", media: { type: "", src: "" } },
        { id: "make-better", title: "How You Make Everything Better", blurb: "Even the bad days", synopsis: "The way an average day turns into a good one, just because you're in it.", tag: "Fan favorite", gradient: "poster-e", media: { type: "", src: "" } },
        { id: "your-smile", title: "Your Smile (In 4K)", blurb: "Now in ultra high definition", synopsis: "No further commentary needed. Just watch.", tag: "Fan favorite", gradient: "poster-d", media: { type: "", src: "" } }
      ]
    },
    {
      id: "coming-soon",
      title: "Coming Soon",
      layout: "poster",
      items: [
        { id: "the-trip", title: "The Trip We Haven't Taken Yet", blurb: "Currently in pre-production", synopsis: "Somewhere new, just the two of us. Release date: TBD, but it's happening.", tag: "Trailer", gradient: "poster-b", media: { type: "", src: "" } },
        { id: "meeting-parents-2", title: "Meeting the Parents: Part 2", blurb: "Sequel, allegedly scarier", synopsis: "Round two. Higher stakes. Snacks recommended.", tag: "Trailer", gradient: "poster-a", media: { type: "", src: "" } },
        { id: "two-months", title: "Two Months and Counting", blurb: "Next season drops soon", synopsis: "If month one was this good, we're not worried about what's next.", tag: "Trailer", gradient: "poster-c", media: { type: "", src: "" } },
        { id: "concert-night", title: "Concert Night (TBD)", blurb: "Loud, in the best way", synopsis: "A whole night of bad singing along and good memories. Date pending.", tag: "Trailer", gradient: "poster-f", media: { type: "", src: "" } },
        { id: "forever", title: "Forever (Ongoing Series)", blurb: "No end date announced", synopsis: "Renewed indefinitely. No cancellation in sight.", tag: "Trailer", gradient: "poster-e", media: { type: "", src: "" } }
      ]
    },
    {
      id: "recently-added",
      title: "Recently Added",
      layout: "poster",
      items: [
        {
          id: "letter-for-you",
          title: "Letter For You",
          subtitle: "A message just for you",
          blurb: "New · Just for Kristina",
          tag: "Unlocked today",
          badge: "★ NEW",
          gradient: "poster-a",
          isSpecial: true,
          // The full letter — separate paragraphs with a blank line between them,
          // each one gently fades in as she reads. Replace this before sending it.
          letterText: "REPLACE_WITH_REAL_LETTER — write your actual anniversary message here.\n\nYou can write as many paragraphs as you want. Each one fades in on its own, so pace it however feels right.\n\nThis is the episode that unlocks last. Make it count.",
          // Optional: a video or photo playing softly behind the letter.
          media: { type: "", src: "" },
          // Optional: a soft background track, e.g. "media/soft-piano.mp3"
          music: ""
        }
      ]
    }
  ],

  /* ============================================================
     Timeline — chronological view. IDs that match an item id above
     (e.g. "first-hello", "the-first-date") share favorite/heart state
     with that card automatically — no extra wiring needed.

     Entries dated in the future are automatically shown locked, and
     unlock themselves the moment that date arrives. Use date: null +
     dateLabel: "TBD" for future plans without a fixed date yet.
     "milestone: true" gives an entry a bigger, brighter dot on the line.
     ============================================================ */
  timeline: [
    { id: "first-hello", title: "The First Hello", date: "2026-06-28", blurb: "Where it all started.", synopsis: "In which one of us finally says something, and the other one actually replies. A slow start with a great payoff.", gradient: "poster-b", media: { type: "", src: "" } },
    { id: "nervous-texting", title: "Nervous Texting 101", date: "2026-07-05", blurb: "A masterclass in overthinking.", synopsis: "Featuring seventeen drafts of a single text message and one very unnecessary amount of screenshotting friends for advice.", gradient: "poster-c", media: { type: "", src: "" } },
    { id: "the-first-date", title: "The First Date", date: "2026-07-14", blurb: "Nobody knew where to sit.", synopsis: "Two people, one table, and a conversation that somehow never ran out. A quiet classic.", gradient: "poster-d", media: { type: "", src: "" } },
    { id: "day-one", title: "Day One — Officially Us", date: "2026-07-22", blurb: "The day it became real.", synopsis: "REPLACE_WITH_REAL_MEMORY: write what actually happened the day you made it official.", gradient: "poster-a", milestone: true, media: { type: "", src: "" } },
    { id: "falling-slowly", title: "Falling, Slowly", date: "2026-07-28", blurb: "Then all at once.", synopsis: "The moment it stopped being 'talking' and started being something worth showing up for, every day.", gradient: "poster-f", media: { type: "", src: "" } },
    { id: "dinner-bad-jokes", title: "Dinner & Bad Jokes", date: "2026-08-05", blurb: "5-star food, 2-star puns.", synopsis: "A romantic dinner, mostly derailed by terrible jokes that somehow landed anyway.", gradient: "poster-c", media: { type: "", src: "" } },
    { id: "late-night-drives", title: "Late Night Drives", date: "2026-08-15", blurb: "No destination, all vibes.", synopsis: "Just the two of us, questionable music choices, and conversations that got a little too honest.", gradient: "poster-d", media: { type: "", src: "" } },
    { id: "one-month-today", title: "One Month, Today", date: "2026-08-21", blurb: "Still no notes.", synopsis: "Thirty-something days in, and somehow it just keeps getting better. Here's to the next one.", gradient: "poster-a", milestone: true, media: { type: "", src: "" } },
    { id: "two-months", title: "Two Months and Counting", date: "2026-09-22", blurb: "Next season drops soon.", synopsis: "If month one was this good, we're not worried about what's next.", gradient: "poster-e", media: { type: "", src: "" } },
    { id: "the-trip", title: "The Trip We Haven't Taken Yet", date: null, dateLabel: "TBD", blurb: "Currently in pre-production.", synopsis: "Somewhere new, just the two of us. Release date: TBD, but it's happening.", gradient: "poster-b", media: { type: "", src: "" } }
  ]
};
