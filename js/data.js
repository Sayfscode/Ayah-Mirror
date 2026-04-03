/* ═══════════════════════════════════════════════════════════════════
   Ayah Mirror — Static Data Constants
   All data arrays, objects, and lookup tables used across the app.
   Loaded first — no DOM access, no function calls.
   ═══════════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────────────
   1. AYAH DATABASE
   Each emotion has 3 entries ordered as a PROGRESSION:
     [0] = Comfort   — soothing, reassuring verse
     [1] = Patience  — encouraging steadfastness
     [2] = Action    — calling to take a step forward
   Fields: ayah, reference, translation, explanation, reason
   ──────────────────────────────────────────────────────────────── */

const AYAH_DATA = [
  {
    emotion: "Anxiety",
    emoji: "😰",
    entries: [
      {
        ayah: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
        reference: "Surah Ar-Ra'd (13:28)",
        translation: "Verily, in the remembrance of Allah do hearts find rest.",
        explanation: "This verse reminds us that lasting tranquillity comes not from controlling every outcome, but from turning our hearts to Allah.",
        reason: "When anxiety grips you, it often stems from trying to control what you cannot. This ayah gently redirects your focus — peace is found not in certainty about the future, but in remembrance of the One who holds it all.",
        phase: "comfort"
      },
      {
        ayah: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
        reference: "Surah At-Talaq (65:3)",
        translation: "And whoever relies upon Allah — then He is sufficient for him.",
        explanation: "Tawakkul (trust in Allah) does not mean inaction — it means doing your part and leaving the outcome to Him.",
        reason: "Anxiety often comes from feeling alone with your burdens. This verse assures you that when you place your trust in Allah, He is enough — you are never carrying the weight alone.",
        phase: "patience"
      },
      {
        ayah: "فَاصْبِرْ إِنَّ وَعْدَ اللَّهِ حَقٌّ وَلَا يَسْتَخِفَّنَّكَ الَّذِينَ لَا يُوقِنُونَ",
        reference: "Surah Ar-Rum (30:60)",
        translation: "So be patient. Indeed, the promise of Allah is truth. And let not those who have no certainty discourage you.",
        explanation: "Allah commands steadfastness and reminds us that His promises are guaranteed — even when the world around us creates doubt.",
        reason: "Anxiety feeds on uncertainty and the fear that things will go wrong. This verse anchors you: Allah's promise is true. Whatever you are anxious about, He already has a plan for it.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Sadness",
    emoji: "😢",
    entries: [
      {
        ayah: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
        reference: "Surah Ad-Duha (93:5)",
        translation: "And your Lord is going to give you, and you will be satisfied.",
        explanation: "Revealed when the Prophet ﷺ was going through a period of sadness. Allah promised that ease and contentment were coming.",
        reason: "When sadness feels heavy and unending, this ayah is Allah's direct promise — what is coming for you is better than what has passed. Your current pain is not your final chapter.",
        phase: "comfort"
      },
      {
        ayah: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
        reference: "Surah Ad-Duha (93:3)",
        translation: "Your Lord has not taken leave of you, nor has He detested [you].",
        explanation: "The Prophet ﷺ feared Allah had abandoned him when revelation paused. Allah reassured him personally — He had not left.",
        reason: "Sadness can whisper that you are forgotten, that Allah is distant. This verse is a direct rebuttal: He has not left you, He has not turned away. You are still on His mind.",
        phase: "patience"
      },
      {
        ayah: "وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
        reference: "Surah Al-Baqarah (2:155-156)",
        translation: "And give good tidings to the patient — who, when disaster strikes them, say: 'Indeed we belong to Allah, and indeed to Him we will return.'",
        explanation: "Inna lillahi wa inna ilayhi raji'un is not only for death — it is for every loss and trial that touches your life.",
        reason: "Your sadness is valid, and this verse does not ask you to suppress it. Instead, it offers you the most powerful words to say in the middle of it — words that connect your pain back to the One who can heal it.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Lack of Motivation",
    emoji: "😔",
    entries: [
      {
        ayah: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        reference: "Surah Al-Inshirah (94:5-6)",
        translation: "For indeed, with hardship will be ease. Indeed, with hardship will be ease.",
        explanation: "Allah repeats the promise twice for emphasis — the difficulty you face right now already contains the seed of its own relief.",
        reason: "When you feel stuck and unmotivated, remember that struggle is not a sign of failure. Allah is telling you that ease is literally woven into the hardship, not just waiting after it.",
        phase: "comfort"
      },
      {
        ayah: "فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَب",
        reference: "Surah Al-Inshirah (94:7-8)",
        translation: "So when you have finished [your duties], then stand up [for worship]. And to your Lord direct [your] longing.",
        explanation: "After promising ease, Allah gives practical guidance: when one task is done, rise for the next. Keep moving.",
        reason: "Motivation often stalls because we feel the whole mountain at once. This verse says: finish one thing, then start the next. Small, faithful steps — and always direct your heart back to Allah.",
        phase: "patience"
      },
      {
        ayah: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
        reference: "Surah Hud (11:115)",
        translation: "Indeed, Allah does not allow to be lost the reward of those who do good.",
        explanation: "Every effort you make, no matter how small it seems, is recorded and valued by Allah. Nothing is wasted.",
        reason: "A lack of motivation often comes from feeling like your effort does not matter. This verse guarantees the opposite — every good deed, every small push forward, Allah sees it and will never let it go to waste.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Gratitude",
    emoji: "🤲",
    entries: [
      {
        ayah: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
        reference: "Surah Ibrahim (14:7)",
        translation: "If you are grateful, I will surely increase you [in favour].",
        explanation: "Gratitude (shukr) is not just a feeling — it is a practice that opens the door to more blessings.",
        reason: "You are in a beautiful state right now. This ayah affirms that gratitude is not just good character — it is a spiritual law. The more you recognise Allah's gifts, the more He gives.",
        phase: "comfort"
      },
      {
        ayah: "وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا",
        reference: "Surah An-Nahl (16:18)",
        translation: "And if you should count the favours of Allah, you could not enumerate them.",
        explanation: "Allah's blessings are so numerous and constant that even trying to count them all is impossible.",
        reason: "Your gratitude right now touches only a fraction of what Allah has given you. This verse deepens that awareness — the blessings you haven't even noticed yet are countless.",
        phase: "patience"
      },
      {
        ayah: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ",
        reference: "Surah Ad-Duha (93:11)",
        translation: "But as for the favour of your Lord, proclaim it.",
        explanation: "Gratitude is not just internal — Allah asks us to speak about His blessings openly, to share and celebrate them.",
        reason: "Your grateful heart is beautiful. This verse encourages you to go further — speak your blessings out loud, share them, let them strengthen others. Gratitude spoken multiplies.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Anger",
    emoji: "😠",
    entries: [
      {
        ayah: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
        reference: "Surah Aal-Imran (3:134)",
        translation: "Who restrain their anger and pardon the people — and Allah loves the doers of good.",
        explanation: "Controlling anger is listed as a quality of the people of Jannah. It is strength, not weakness.",
        reason: "Anger is natural, but this verse shows that mastering it is one of the highest forms of ihsan (excellence). Restraining your anger when you have the power to act on it — that is the strength Allah loves.",
        phase: "comfort"
      },
      {
        ayah: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ",
        reference: "Surah Ash-Shura (42:43)",
        translation: "And whoever is patient and forgives — indeed, that is of the matters requiring determination.",
        explanation: "Forgiving when you are angry is not weakness — Allah calls it one of the greatest acts of resolve and willpower.",
        reason: "Your anger may feel justified — and it might be. But this verse honours those who choose patience and forgiveness anyway, calling it one of the hardest and noblest things a person can do.",
        phase: "patience"
      },
      {
        ayah: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ",
        reference: "Surah Al-A'raf (7:199)",
        translation: "Take what is given freely, enjoin what is good, and turn away from the ignorant.",
        explanation: "Allah gives the Prophet ﷺ a three-part formula for handling difficult people: accept, encourage good, and walk away from foolishness.",
        reason: "When anger rises because of someone's behaviour, this verse offers a practical exit: you do not have to engage with every provocation. Sometimes the strongest response is to simply walk away.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Feeling Lost",
    emoji: "🌫️",
    entries: [
      {
        ayah: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ",
        reference: "Surah Ad-Duha (93:7)",
        translation: "And He found you lost and guided [you].",
        explanation: "Allah addressed the Prophet ﷺ directly — even he was once searching for direction, and Allah guided him.",
        reason: "If you feel directionless, know that being 'lost' is not a permanent state — it is the starting point of every guidance story. Allah found His most beloved servant in that same state, and guided him. He will guide you too.",
        phase: "comfort"
      },
      {
        ayah: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا",
        reference: "Surah Al-Ankabut (29:69)",
        translation: "And those who strive for Us — We will surely guide them to Our ways.",
        explanation: "Guidance is not passive. Allah promises direction to those who actively seek it, even imperfectly.",
        reason: "Feeling lost does not mean you are failing — the fact that you are searching is itself the effort Allah rewards. He promises: keep striving toward Me, and I will show you the way.",
        phase: "patience"
      },
      {
        ayah: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        reference: "Surah Al-Fatiha (1:6)",
        translation: "Guide us to the straight path.",
        explanation: "We recite this in every rak'ah of every prayer — it is the most repeated du'a in Islam, a constant plea for guidance.",
        reason: "You already have the most powerful tool for finding your way: this du'a. Every Muslim who ever felt lost has said these exact words. You are not alone in this search — and Allah placed the answer in the prayer you make every day.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Fear",
    emoji: "😨",
    entries: [
      {
        ayah: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
        reference: "Surah Al-Baqarah (2:286)",
        translation: "Allah does not burden a soul beyond that it can bear.",
        explanation: "Whatever trial you face, Allah has already measured your capacity to handle it — and He deemed you strong enough.",
        reason: "Fear often whispers 'you can't handle this.' But Allah, who knows you better than you know yourself, says otherwise. If this challenge is in your life, you already have what it takes to face it.",
        phase: "comfort"
      },
      {
        ayah: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ",
        reference: "Surah An-Nahl (16:128)",
        translation: "Indeed, Allah is with those who fear Him and those who are doers of good.",
        explanation: "Ma'iyyah — Allah's special companionship — is granted to those who are mindful of Him. He is not a distant observer; He is with you.",
        reason: "When fear makes you feel small, remember who is on your side. Allah is not watching from afar — He is with you, actively, personally. What can truly harm you when the Creator of everything stands with you?",
        phase: "patience"
      },
      {
        ayah: "قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا هُوَ مَوْلَانَا",
        reference: "Surah At-Tawbah (9:51)",
        translation: "Say: 'Nothing will happen to us except what Allah has decreed for us. He is our protector.'",
        explanation: "Nothing reaches you without Allah's knowledge and permission. This is not fatalism — it is the ultimate source of courage.",
        reason: "Fear of the unknown shrinks when you realise: nothing 'just happens.' Every event in your life passes through Allah's will first. He is your Mawla — your protector, guardian, and ally.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Loneliness",
    emoji: "🥀",
    entries: [
      {
        ayah: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
        reference: "Surah Al-Baqarah (2:186)",
        translation: "And when My servants ask you about Me — indeed I am near. I respond to the call of the caller when he calls upon Me.",
        explanation: "Unlike every other 'ask the Prophet' verse, Allah answers this one directly — without an intermediary — to emphasise His closeness.",
        reason: "You may feel alone, but notice something remarkable: Allah did not say 'tell them I am near.' He said 'I am near' — directly, personally. In your loneliest moment, He is closer to you than anyone.",
        phase: "comfort"
      },
      {
        ayah: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
        reference: "Surah Qaf (50:16)",
        translation: "And We are closer to him than [his] jugular vein.",
        explanation: "Allah describes His closeness in the most intimate physical terms possible — closer than the vein in your own neck.",
        reason: "Loneliness says no one is close enough to understand. But Allah is closer to you than your own body. He knows your thoughts before you speak them. You are never truly alone — not even for a heartbeat.",
        phase: "patience"
      },
      {
        ayah: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
        reference: "Surah At-Tawbah (9:40)",
        translation: "Do not grieve; indeed Allah is with us.",
        explanation: "The Prophet ﷺ said this to Abu Bakr in the cave during the Hijrah, when they were hiding from enemies — just two men, seemingly alone and outnumbered.",
        reason: "Even in a cave, hunted and hidden, the Prophet ﷺ felt no loneliness because he knew Allah was there. Your isolation may feel real, but this verse reminds you: 'Allah is with us' is always true, in every room, in every silence.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Grief",
    emoji: "💔",
    entries: [
      {
        ayah: "إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ",
        reference: "Surah Yusuf (12:86)",
        translation: "I only complain of my suffering and my grief to Allah.",
        explanation: "Prophet Yaqub (AS) said this after decades of separation from his son Yusuf. His grief was immense, but he directed it only to Allah.",
        reason: "Grief is not a sign of weak faith — even prophets grieved deeply. This verse gives you permission to feel your pain fully, while showing you where to pour it: into du'a, into sajdah, into conversation with your Lord.",
        phase: "comfort"
      },
      {
        ayah: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ",
        reference: "Surah Al-Baqarah (2:155)",
        translation: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits.",
        explanation: "Allah openly tells us that loss is part of the plan. He does not hide it — He prepares us for it.",
        reason: "Grief can feel like a punishment, like something went wrong. This verse says: loss was always part of the journey. It is not a mistake in your story — it is a chapter Allah wrote with purpose.",
        phase: "patience"
      },
      {
        ayah: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَيَجْعَلَ اللَّهُ فِيهِ خَيْرًا كَثِيرًا",
        reference: "Surah An-Nisa (4:19)",
        translation: "And perhaps you dislike a thing and Allah makes therein much good.",
        explanation: "Even in what we grieve, there may be a hidden good that only Allah can see from His vantage point.",
        reason: "This does not erase your grief — but it opens a door of hope within it. The loss that hurts you now may carry a good that you cannot yet see. Trust that Allah's view is wider than yours.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Hopelessness",
    emoji: "🕳️",
    entries: [
      {
        ayah: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
        reference: "Surah Az-Zumar (39:53)",
        translation: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
        explanation: "No matter how far you feel you have fallen, Allah's mercy is greater. This is one of the most hope-giving verses in the entire Quran.",
        reason: "Hopelessness says 'it's too late for me.' But Allah says the opposite — His mercy has no limit, no expiry, no condition you have broken beyond repair. This verse exists precisely for the moment you feel most undeserving.",
        phase: "comfort"
      },
      {
        ayah: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
        reference: "Surah Yusuf (12:87)",
        translation: "And do not despair of relief from Allah. Indeed, no one despairs of relief from Allah except the disbelieving people.",
        explanation: "Prophet Yaqub said this to his sons after years of loss — he had every worldly reason to lose hope, yet his faith kept him anchored.",
        reason: "If Yaqub (AS), who lost his son for decades, still told his family not to lose hope in Allah — then no situation you face is beyond hope either. Despair contradicts faith. While you breathe, there is relief ahead.",
        phase: "patience"
      },
      {
        ayah: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        reference: "Surah Al-Inshirah (94:6)",
        translation: "Indeed, with hardship will be ease.",
        explanation: "The Arabic uses 'ma'a' (with), not 'ba'da' (after). The ease is not just coming later — it exists alongside the hardship right now.",
        reason: "Hopelessness sees only the darkness. But this verse reveals something hidden: even in your darkest moment, ease is already present within it. You may not see it yet, but Allah placed it there.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Impatience",
    emoji: "⏳",
    entries: [
      {
        ayah: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
        reference: "Surah Al-Baqarah (2:153)",
        translation: "Indeed, Allah is with the patient.",
        explanation: "Sabr is not passive waiting — it is active perseverance while maintaining trust in Allah's timing.",
        reason: "When you feel impatient for things to change, this short but powerful verse reminds you: patience is not just rewarded — it earns you Allah's companionship. He is WITH the patient, not just watching them.",
        phase: "comfort"
      },
      {
        ayah: "وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ",
        reference: "Surah An-Nahl (16:127)",
        translation: "And be patient, and your patience is not but through Allah.",
        explanation: "Even the ability to be patient is a gift from Allah — you are not expected to find it within yourself alone.",
        reason: "If patience feels impossible right now, this verse reveals why: sabr is not something you generate on your own. Ask Allah for it. The strength to wait comes from Him, not from your willpower.",
        phase: "patience"
      },
      {
        ayah: "وَلَنَجْزِيَنَّ الَّذِينَ صَبَرُوا أَجْرَهُم بِأَحْسَنِ مَا كَانُوا يَعْمَلُونَ",
        reference: "Surah An-Nahl (16:96)",
        translation: "And We will surely give those who were patient their reward according to the best of what they used to do.",
        explanation: "The reward for patience is not average — Allah promises it will match the best of your deeds.",
        reason: "Impatience whispers that waiting is wasted time. But Allah says your patience will be rewarded at the highest rate — not your average, but your best. Every moment you endure is being credited at premium value.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Self-Doubt",
    emoji: "🪞",
    entries: [
      {
        ayah: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
        reference: "Surah At-Tin (95:4)",
        translation: "We have certainly created man in the best of stature.",
        explanation: "Allah created you in the finest form — physically, spiritually, and in potential. You are not an accident or an afterthought.",
        reason: "When you doubt your worth or ability, remember that the Creator of the universe designed you with intention and called the result 'the best of stature.' Your self-doubt contradicts His assessment of you.",
        phase: "comfort"
      },
      {
        ayah: "وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ",
        reference: "Surah Al-Isra (17:70)",
        translation: "And We have certainly honoured the children of Adam.",
        explanation: "Allah did not say 'some' children of Adam. Every human being is honoured — including you, right now, as you are.",
        reason: "Self-doubt tells you that you are not enough. But Allah has already decided: He honoured you. Not because of your achievements, not because you earned it — but because He chose to. That honour is not yours to revoke.",
        phase: "patience"
      },
      {
        ayah: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
        reference: "Surah Aal-Imran (3:139)",
        translation: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
        explanation: "This was revealed after the defeat at Uhud, when the Muslims felt broken. Allah told them: your setback does not define you.",
        reason: "Self-doubt often comes after a failure or setback. This verse was spoken to people who had just lost a battle. Allah did not say 'you failed.' He said 'do not weaken.' Your stumble is not your identity.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Overwhelmed",
    emoji: "🌊",
    entries: [
      {
        ayah: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا مَا آتَاهَا ۚ سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا",
        reference: "Surah At-Talaq (65:7)",
        translation: "Allah does not charge a soul except according to what He has given it. Allah will bring about, after hardship, ease.",
        explanation: "You are never asked to give more than you have been given. And the hardship is temporary — ease is already on its way.",
        reason: "Feeling overwhelmed means you are carrying a lot — but Allah calibrated this moment to your specific capacity. He is not testing you beyond what He equipped you for. And He promises: this heaviness will lift.",
        phase: "comfort"
      },
      {
        ayah: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
        reference: "Surah At-Talaq (65:2)",
        translation: "And whoever fears Allah — He will make for him a way out.",
        explanation: "Taqwa (mindfulness of Allah) is presented as the key that unlocks exits from situations that feel inescapable.",
        reason: "When everything piles up and you see no way through, this verse promises a makhraj — an exit, an opening. It may not be the exit you expect, but Allah will create one specifically for you.",
        phase: "patience"
      },
      {
        ayah: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ",
        reference: "Surah Al-Baqarah (2:286)",
        translation: "Our Lord, and burden us not with that which we have no ability to bear.",
        explanation: "Allah Himself taught us this du'a — He gave us the words to ask for relief when the load feels too heavy.",
        reason: "When you feel crushed under the weight of everything, know that Allah gave you permission to say: 'This is too much for me — help me.' This is not weakness; it is a du'a He Himself wrote for you.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Jealousy",
    emoji: "👁️",
    entries: [
      {
        ayah: "وَلَا تَتَمَنَّوْا مَا فَضَّلَ اللَّهُ بِهِ بَعْضَكُمْ عَلَىٰ بَعْضٍ",
        reference: "Surah An-Nisa (4:32)",
        translation: "And do not wish for that by which Allah has made some of you exceed others.",
        explanation: "Comparing yourself to others ignores the unique blessings and path Allah has written specifically for you.",
        reason: "Jealousy compares your behind-the-scenes to someone else's highlight reel. This verse redirects you: what Allah gave someone else was never meant for you, and what He has planned for you was never meant for them.",
        phase: "comfort"
      },
      {
        ayah: "نَحْنُ قَسَمْنَا بَيْنَهُم مَّعِيشَتَهُمْ فِي الْحَيَاةِ الدُّنْيَا",
        reference: "Surah Az-Zukhruf (43:32)",
        translation: "We have distributed among them their livelihood in the life of this world.",
        explanation: "The distribution of worldly provision is Allah's decision, not random chance. Each person's portion is deliberate.",
        reason: "Jealousy assumes that someone else got what was 'supposed' to be yours. But this verse clarifies: Allah Himself divided the portions. What they have was always theirs, and what is yours is being prepared for you.",
        phase: "patience"
      },
      {
        ayah: "وَلَا تَمُدَّنَّ عَيْنَيْكَ إِلَىٰ مَا مَتَّعْنَا بِهِ أَزْوَاجًا مِّنْهُمْ",
        reference: "Surah Ta-Ha (20:131)",
        translation: "And do not extend your eyes toward that by which We have given enjoyment to [some] categories of them.",
        explanation: "Allah tells His Prophet ﷺ not to gaze longingly at what others have been given — even he was reminded.",
        reason: "If the Prophet ﷺ himself was told not to compare, it shows how natural this feeling is — and how important it is to redirect it. Lower your gaze from what others have, and raise it to what Allah has written for you.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Guilt",
    emoji: "😞",
    entries: [
      {
        ayah: "وَاسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ ۚ إِنَّ رَبِّي رَحِيمٌ وَدُودٌ",
        reference: "Surah Hud (11:90)",
        translation: "Ask forgiveness of your Lord and then repent to Him. Indeed, my Lord is Merciful and Loving.",
        explanation: "Allah is not just merciful — He is Al-Wadud, the Loving. He does not merely tolerate your return; He loves that you came back.",
        reason: "Guilt can paralyse you into thinking you are too far gone. But this verse pairs mercy with love — Allah does not just forgive reluctantly. He is Wadud: He loves you as you repent. Your guilt is actually a sign that your heart is alive.",
        phase: "comfort"
      },
      {
        ayah: "وَالَّذِينَ إِذَا فَعَلُوا فَاحِشَةً أَوْ ظَلَمُوا أَنفُسَهُمْ ذَكَرُوا اللَّهَ فَاسْتَغْفَرُوا لِذُنُوبِهِمْ",
        reference: "Surah Aal-Imran (3:135)",
        translation: "And those who, when they commit an immorality or wrong themselves, remember Allah and ask forgiveness for their sins.",
        explanation: "Allah describes the righteous not as people who never sin, but as people who return to Him when they do.",
        reason: "You may feel guilty because you did something wrong — and this verse says: that guilt is the first step of the righteous. The people of taqwa are not perfect. They fall. But then they remember Allah, and they come back. That is exactly what you are doing right now.",
        phase: "patience"
      },
      {
        ayah: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
        reference: "Surah Al-Baqarah (2:222)",
        translation: "Indeed, Allah loves those who are constantly repenting and loves those who purify themselves.",
        explanation: "Allah did not say He 'accepts' the repentant — He said He loves them. Repentance makes you beloved to Him.",
        reason: "Guilt makes you feel unlovable. This verse says the exact opposite: the act of turning back to Allah after a mistake does not just earn forgiveness — it earns His love. You are more beloved to Him now, in your repentance, than you realise.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Confusion",
    emoji: "🤔",
    entries: [
      {
        ayah: "إِن تَتَّقُوا اللَّهَ يَجْعَل لَّكُمْ فُرْقَانًا",
        reference: "Surah Al-Anfal (8:29)",
        translation: "If you are mindful of Allah, He will grant you a criterion [to judge between right and wrong].",
        explanation: "Taqwa (God-consciousness) is not just about worship — it sharpens your inner clarity and moral compass.",
        reason: "When you cannot see the right path, this verse offers a practical answer: draw closer to Allah, and He will give you the very ability to distinguish truth from falsehood. Clarity is a gift He grants to those who seek Him.",
        phase: "comfort"
      },
      {
        ayah: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
        reference: "Surah Ta-Ha (20:114)",
        translation: "And say: 'My Lord, increase me in knowledge.'",
        explanation: "This is the only thing Allah told the Prophet ﷺ to ask for more of — not wealth, not power, but knowledge.",
        reason: "Confusion is not ignorance — it is the space before understanding. This du'a transforms your confusion into a request: Ya Allah, I do not understand yet, but You can teach me. Turn your fog into a prayer.",
        phase: "patience"
      },
      {
        ayah: "فَإِنَّ ذِكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ",
        reference: "Surah Adh-Dhariyat (51:55)",
        translation: "And remind, for indeed, the reminder benefits the believers.",
        explanation: "Sometimes clarity comes not from new knowledge, but from being reminded of what you already know deep down.",
        reason: "When you feel confused, you may already have the answer inside you — buried under noise and overthinking. This verse suggests: go back to what you know. Read Quran, sit in dhikr, let the reminder clear the fog.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Heartbreak",
    emoji: "💫",
    entries: [
      {
        ayah: "عَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ",
        reference: "Surah Al-Baqarah (2:216)",
        translation: "Perhaps you dislike a thing and it is good for you.",
        explanation: "Our limited perspective cannot see what Allah sees. What feels like loss may be divine redirection.",
        reason: "Heartbreak makes the loss feel absolute. But this verse asks you to consider: what if this pain is protecting you from something worse, or steering you toward something far better than what you lost?",
        phase: "comfort"
      },
      {
        ayah: "وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ ۗ وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ",
        reference: "Surah Al-Baqarah (2:216)",
        translation: "And perhaps you love a thing and it is bad for you. And Allah knows, while you know not.",
        explanation: "The continuation of the previous verse — not only can hardship contain hidden good, but what we cling to may actually contain hidden harm.",
        reason: "Heartbreak hurts because you loved something deeply. This verse gently says: your love does not always see clearly. What you are mourning might have been something Allah is protecting you from. Trust His knowledge over your pain.",
        phase: "patience"
      },
      {
        ayah: "وَبَشِّرِ الصَّابِرِينَ",
        reference: "Surah Al-Baqarah (2:155)",
        translation: "And give good tidings to the patient.",
        explanation: "In the middle of describing trials and loss, Allah pauses to deliver good news specifically to those who endure.",
        reason: "Heartbreak demands patience — and this verse says those who endure it receive bushra (glad tidings) from Allah Himself. Your broken heart, if held with patience, earns you a promise directly from Him.",
        phase: "action"
      }
    ]
  },
  {
    emotion: "Thankfulness",
    emoji: "✨",
    entries: [
      {
        ayah: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
        reference: "Surah Al-Baqarah (2:152)",
        translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
        explanation: "A remarkable exchange: you remember Allah, and He — the Lord of all creation — remembers you in return.",
        reason: "In your moment of thankfulness, this verse elevates it further: your gratitude is not a one-way act. When you turn to Allah in thanks, He turns to you. You are in a conversation with your Creator right now.",
        phase: "comfort"
      },
      {
        ayah: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
        reference: "Surah Ibrahim (14:7)",
        translation: "If you are grateful, I will surely increase you.",
        explanation: "Gratitude is a door to increase — in blessings, in peace, in closeness to Allah.",
        reason: "Your thankfulness is already opening doors. This verse promises that the cycle of shukr and blessing is self-reinforcing: the more you thank, the more He gives, and the more you find to thank Him for.",
        phase: "patience"
      },
      {
        ayah: "وَإِذْ تَأَذَّنَ رَبُّكُمْ",
        reference: "Surah Ibrahim (14:7)",
        translation: "And [remember] when your Lord proclaimed...",
        explanation: "The word ta'adhdhana means Allah announced it publicly, like a royal decree. His promise of increase for the grateful is not a quiet suggestion — it is a cosmic declaration.",
        reason: "Your gratitude activates a promise that Allah proclaimed to all of creation. This is not a minor reward — it is a law of the universe. Thank Him, and watch what He opens for you.",
        phase: "action"
      }
    ]
  }
];


/* ────────────────────────────────────────────────────────────────
   1b. ACTION STEPS
   Each emotion has 3 real-life actions aligned with the
   progression phases: comfort, patience, action.
   Shown after each ayah to encourage immediate practice.
   ──────────────────────────────────────────────────────────────── */

const ACTION_STEPS = {
  "Anxiety": [
    "Close your eyes and say 'HasbiyAllahu wa ni'mal wakeel' 3 times",
    "Make wudu slowly and mindfully — let the water wash away your worries",
    "Pray 2 rakah salat al-hajah and ask Allah for peace of heart"
  ],
  "Sadness": [
    "Place your hand on your chest and make a quiet dua right now",
    "Read Surah Ad-Duha slowly, feeling each word as if spoken to you",
    "Say 'Inna lillahi wa inna ilayhi raji'un' and sit in silence for 1 minute"
  ],
  "Lack of Motivation": [
    "Say 'La hawla wa la quwwata illa billah' — all strength comes from Allah",
    "Pick one small task you have been avoiding and do it right now",
    "Make istighfar 10 times — it opens doors you didn't know existed"
  ],
  "Gratitude": [
    "Name 3 blessings out loud that you usually take for granted",
    "Send a message to someone who has helped you — thank them",
    "Pray 2 rakah shukr and prostrate in gratitude to Allah"
  ],
  "Anger": [
    "Say 'A'udhu billahi min ash-shaytan ir-rajeem' and take 3 deep breaths",
    "Make wudu — the Prophet ﷺ said water extinguishes anger",
    "Walk away from the situation for 5 minutes and do dhikr"
  ],
  "Feeling Lost": [
    "Recite Surah Al-Fatiha slowly and ask Allah for guidance after it",
    "Write down one thing you know for certain — build from there",
    "Pray salat al-istikhara before your next decision"
  ],
  "Fear": [
    "Say 'HasbunAllahu wa ni'mal wakeel' — Allah is sufficient for me",
    "Remind yourself of one past fear that Allah safely brought you through",
    "Make du'a naming your specific fear — give it to Allah directly"
  ],
  "Loneliness": [
    "Talk to Allah right now — out loud if you can, He is listening",
    "Reach out to one person today, even with a simple salam",
    "Pray 2 rakah and sit in sajdah longer than usual — feel His nearness"
  ],
  "Grief": [
    "Let yourself cry if you need to — even the Prophet ﷺ wept",
    "Say 'Inna lillahi wa inna ilayhi raji'un' for what you have lost",
    "Make dua for the one you grieve — your love can still reach them"
  ],
  "Hopelessness": [
    "Make istighfar 33 times — every single one opens a door",
    "Read Surah Yusuf — the story of hope after decades of patience",
    "Stand up and pray 2 rakah, even if your heart feels empty"
  ],
  "Impatience": [
    "Say 'SubhanAllah' 33 times slowly — let each one slow your heart",
    "Remind yourself of one thing you waited for that turned out better than expected",
    "Write down what you are waiting for and hand it to Allah in du'a"
  ],
  "Self-Doubt": [
    "Say 'Alhamdulillah' for who Allah made you — exactly as you are",
    "Write down one thing you did well recently, no matter how small",
    "Ask Allah for confidence: 'Rabbi shrahli sadri wa yassir li amri'"
  ],
  "Overwhelmed": [
    "Stop everything and take 5 slow breaths — you are safe right now",
    "Write down everything on your mind, then pick just ONE to focus on",
    "Make the du'a: 'Allahumma la sahla illa ma ja'altahu sahla' (O Allah, nothing is easy except what You make easy)"
  ],
  "Jealousy": [
    "Say 'Allahumma barik' for the person you envy — it protects you both",
    "List 3 blessings in YOUR life that someone else might wish for",
    "Make du'a asking Allah for what you want — directly, not through comparison"
  ],
  "Guilt": [
    "Make istighfar right now: 'Astaghfirullah wa atubu ilayh' — 3 times with your heart",
    "Promise yourself one small good deed today to begin turning the page",
    "Pray 2 rakah tawbah and talk to Allah about what weighs on you"
  ],
  "Confusion": [
    "Say 'Rabbi zidni ilma' (My Lord, increase me in knowledge) 3 times",
    "Step away from the decision for 10 minutes — clarity comes in stillness",
    "Pray salat al-istikhara and trust that Allah will guide your heart"
  ],
  "Heartbreak": [
    "Let yourself feel the pain — suppressing it only delays healing",
    "Make du'a: 'Allahumma ajirni fi musibati wakhluf li khayran minha'",
    "Do something kind for someone else today — healing begins in giving"
  ],
  "Thankfulness": [
    "Say 'Alhamdulillah' 33 times, thinking of a different blessing each time",
    "Share one blessing with someone who needs to hear good news",
    "Pray 2 rakah shukr — let your forehead touch the ground in gratitude"
  ]
};


/* ────────────────────────────────────────────────────────────────
   1b. GUIDANCE STACK
   Related hadith and scholar wisdom for each emotion.
   Displayed as layered cards below the ayah.
   Each emotion has 3 entries matching the progression phases.
   ──────────────────────────────────────────────────────────────── */

const GUIDANCE_STACK = {
  "Anxiety": [
    { hadith: "If you put your trust in Allah as you should, He would provide for you as He provides for the birds — they go out hungry in the morning and return full in the evening.", hadithSource: "Tirmidhi 2344", wisdom: "Anxiety does not empty tomorrow of its troubles — it only empties today of its peace.", scholar: "Ibn al-Qayyim" },
    { hadith: "How wonderful is the affair of the believer, for his affairs are all good. If something good happens to him, he is thankful, and that is good for him. If something bad happens, he bears it with patience, and that is good for him.", hadithSource: "Muslim 2999", wisdom: "The heart will not find rest except in drawing close to the One who created it.", scholar: "Ibn Taymiyyah" },
    { hadith: "Be in this world as though you were a stranger or a traveller.", hadithSource: "Bukhari 6416", wisdom: "When the world pushes you to your knees, you are in the perfect position to pray.", scholar: "Imam al-Ghazali" }
  ],
  "Sadness": [
    { hadith: "No fatigue, disease, sorrow, sadness, hurt, or distress befalls a Muslim — not even the prick of a thorn — except that Allah expiates some of his sins by it.", hadithSource: "Bukhari 5641", wisdom: "Do not grieve — what is destined will reach you even if it is under two mountains. And what is not destined for you will not reach you even if it is between your two lips.", scholar: "Ibn al-Qayyim" },
    { hadith: "The Prophet (peace be upon him) would say when distressed: 'O Living, O Sustainer, in Your mercy I seek relief.'", hadithSource: "Tirmidhi 3524", wisdom: "Tears are the silent language of grief, but they are also the prayers your soul cannot speak.", scholar: "Imam al-Ghazali" },
    { hadith: "Allah does not burden a soul beyond that it can bear.", hadithSource: "Muslim (from Quran 2:286)", wisdom: "Sadness is not a sign of weak faith — even the Prophet wept.", scholar: "Ibn al-Qayyim" }
  ],
  "Lack of Motivation": [
    { hadith: "Take advantage of five before five: your youth before old age, your health before sickness, your wealth before poverty, your free time before busyness, and your life before death.", hadithSource: "Hakim, Bayhaqi", wisdom: "A moment of patience in a moment of anger saves you a thousand moments of regret.", scholar: "Ali ibn Abi Talib" },
    { hadith: "The strong believer is better and more beloved to Allah than the weak believer, while there is good in both.", hadithSource: "Muslim 2664", wisdom: "Do not wait for motivation — begin, and motivation will follow.", scholar: "Imam al-Ghazali" },
    { hadith: "Tie your camel, then put your trust in Allah.", hadithSource: "Tirmidhi 2517", wisdom: "Your greatest enemy is the nafs that tells you to wait until tomorrow.", scholar: "Ibn al-Qayyim" }
  ],
  "Gratitude": [
    { hadith: "He who does not thank people, does not thank Allah.", hadithSource: "Abu Dawud 4811", wisdom: "Gratitude is not merely a feeling — it is a way of seeing.", scholar: "Ibn Taymiyyah" },
    { hadith: "Look at those below you and do not look at those above you, for it is the best way not to belittle Allah's favours on you.", hadithSource: "Muslim 2963", wisdom: "When you are grateful, your blessings increase. This is not metaphor — it is a divine promise.", scholar: "Ibn al-Qayyim" },
    { hadith: "The first thing the servant will be asked about on the Day of Judgment is: 'Did We not give you a healthy body and quench your thirst with cold water?'", hadithSource: "Tirmidhi 3358", wisdom: "True wealth is the richness of the soul, not what fills the hand.", scholar: "Hasan al-Basri" }
  ],
  "Anger": [
    { hadith: "The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.", hadithSource: "Bukhari 6114", wisdom: "Anger is a wind that blows out the lamp of the mind.", scholar: "Imam al-Ghazali" },
    { hadith: "If one of you becomes angry while standing, let him sit down. If it does not go away, let him lie down.", hadithSource: "Abu Dawud 4782", wisdom: "Silence in the face of provocation is one of the highest forms of strength.", scholar: "Ali ibn Abi Talib" },
    { hadith: "Do not be angry, and Paradise will be yours.", hadithSource: "Tabarani (Sahih)", wisdom: "The one who controls his anger has conquered the strongest enemy within.", scholar: "Ibn Taymiyyah" }
  ],
  "Feeling Lost": [
    { hadith: "Consult your heart. Righteousness is that about which the soul feels at ease and the heart feels tranquil.", hadithSource: "Ahmad 17545", wisdom: "If you feel far from Allah, know that it is you who moved — He never left.", scholar: "Ibn al-Qayyim" },
    { hadith: "O turner of hearts, keep my heart firm upon Your religion.", hadithSource: "Tirmidhi 2140", wisdom: "Sometimes Allah closes all the doors and forces you into a path that leads straight to Him.", scholar: "Imam al-Ghazali" },
    { hadith: "Whoever makes the Hereafter his goal, Allah gathers his affairs, places richness in his heart, and the world comes to him willingly.", hadithSource: "Ibn Majah 4105", wisdom: "Being lost is not the end of the road — it is the beginning of finding your way back to Allah.", scholar: "Ibn Taymiyyah" }
  ],
  "Fear": [
    { hadith: "If the whole nation were to gather together to benefit you, they would not benefit you except with what Allah has already written for you.", hadithSource: "Tirmidhi 2516", wisdom: "Fear only the One in whose hand is your soul — everything else is powerless without His permission.", scholar: "Ibn al-Qayyim" },
    { hadith: "Allah is with those who are patient.", hadithSource: "Bukhari (from Quran 2:153)", wisdom: "Courage is not the absence of fear but the judgement that something else — your trust in Allah — is more important.", scholar: "Imam al-Ghazali" },
    { hadith: "Nothing will happen to us except what Allah has decreed for us — He is our Protector.", hadithSource: "Muslim (from Quran 9:51)", wisdom: "The heart that fears Allah fears nothing else; the heart that does not fear Allah fears everything.", scholar: "Ibn Taymiyyah" }
  ],
  "Loneliness": [
    { hadith: "Allah says: I am as My servant thinks of Me, and I am with him when he remembers Me.", hadithSource: "Bukhari 7405", wisdom: "If you find yourself lonely, know that Allah brought you to this emptiness so you would fill it only with Him.", scholar: "Ibn al-Qayyim" },
    { hadith: "Islam began as something strange and will return to being strange — so blessed are the strangers.", hadithSource: "Muslim 145", wisdom: "Sometimes loneliness is Allah removing everyone from your life so you can hear only His voice.", scholar: "Imam al-Ghazali" },
    { hadith: "Whoever reads Surah Al-Ikhlas, it is as if he has read one-third of the Quran.", hadithSource: "Muslim 811", wisdom: "You are never alone when the Lord of all creation is closer to you than your own jugular vein.", scholar: "Hasan al-Basri" }
  ],
  "Grief": [
    { hadith: "The eyes shed tears, the heart grieves, and we say only what pleases our Lord. We are saddened by your departure, O Ibrahim.", hadithSource: "Bukhari 1303", wisdom: "Grief is the price we pay for love, and love never dies — it simply changes its dwelling to the heart.", scholar: "Ibn al-Qayyim" },
    { hadith: "Indeed, to Allah we belong and to Him we shall return. O Allah, reward me in my affliction and replace it with something better.", hadithSource: "Muslim 918", wisdom: "The believer does not grieve without hope — for every ending in this world is a beginning in the next.", scholar: "Imam al-Ghazali" },
    { hadith: "When Allah loves a servant, He tests him.", hadithSource: "Tirmidhi 2396", wisdom: "Your tears for the departed are not a sign of weak faith — they are a sign of a tender heart, and Allah loves the tender-hearted.", scholar: "Ibn Taymiyyah" }
  ],
  "Hopelessness": [
    { hadith: "Know that victory comes with patience, relief comes with affliction, and with hardship comes ease.", hadithSource: "Tirmidhi 2516", wisdom: "Do not despair of the mercy of Allah — despair itself is the only real defeat.", scholar: "Ibn al-Qayyim" },
    { hadith: "Whoever persists in asking, Allah will give him.", hadithSource: "Bukhari 6340", wisdom: "The darkest hour of the night is just before dawn — hold on.", scholar: "Imam al-Ghazali" },
    { hadith: "No one who has an atom's weight of faith in his heart will remain in the Fire forever.", hadithSource: "Muslim 93", wisdom: "Hope in Allah is never misplaced. He saved Yunus from the belly of a whale in the depths of the sea — He will save you too.", scholar: "Ibn Taymiyyah" }
  ],
  "Impatience": [
    { hadith: "Patience is a light.", hadithSource: "Muslim 223", wisdom: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.", scholar: "Ibn al-Qayyim" },
    { hadith: "No one is given a gift better and more encompassing than patience.", hadithSource: "Bukhari 1469", wisdom: "The fruit of patience is sweet — but only those who endure the bitter taste of waiting ever taste it.", scholar: "Imam al-Ghazali" },
    { hadith: "Whoever remains patient, Allah will make him patient. And no one is given a better or greater gift than patience.", hadithSource: "Bukhari 1469", wisdom: "In patience there is dignity. In haste there is regret.", scholar: "Ali ibn Abi Talib" }
  ],
  "Self-Doubt": [
    { hadith: "Allah does not look at your appearance or wealth, but He looks at your hearts and deeds.", hadithSource: "Muslim 2564", wisdom: "You are not what whispers tell you. You are what Allah created you to be — and He does not create without purpose.", scholar: "Ibn al-Qayyim" },
    { hadith: "Every son of Adam is a sinner, but the best sinners are those who repent.", hadithSource: "Tirmidhi 2499", wisdom: "Do not belittle yourself — you carry a soul that the angels themselves were not given.", scholar: "Imam al-Ghazali" },
    { hadith: "If you relied on Allah as He should be relied on, He would provide for you as He provides for the birds.", hadithSource: "Tirmidhi 2344", wisdom: "Your worth is not measured by what you produce — it was established the moment Allah breathed life into you.", scholar: "Ibn Taymiyyah" }
  ],
  "Overwhelmed": [
    { hadith: "Make things easy for people and do not make them difficult. Give glad tidings and do not drive people away.", hadithSource: "Bukhari 6125", wisdom: "You were not created to carry everything — you were created to surrender it to the One who carries all things.", scholar: "Ibn al-Qayyim" },
    { hadith: "Allah does not burden a soul beyond what it can bear.", hadithSource: "Bukhari (from Quran 2:286)", wisdom: "When you feel you cannot go on, remember: you are not carrying this alone. Let go and let Allah.", scholar: "Imam al-Ghazali" },
    { hadith: "Seek help from Allah and do not feel helpless.", hadithSource: "Muslim 2664", wisdom: "The mountain ahead of you is not meant to crush you — it is meant to be climbed, one step at a time.", scholar: "Ibn Taymiyyah" }
  ],
  "Jealousy": [
    { hadith: "Beware of jealousy, for it consumes good deeds just as fire consumes wood.", hadithSource: "Abu Dawud 4903", wisdom: "Jealousy is the thief of contentment. Guard your heart, and be grateful for your own garden.", scholar: "Ibn al-Qayyim" },
    { hadith: "None of you truly believes until he loves for his brother what he loves for himself.", hadithSource: "Bukhari 13", wisdom: "The cure for envy is to know that what is written for you will never miss you.", scholar: "Imam al-Ghazali" },
    { hadith: "Look at those below you and do not look at those above you, for it is the best way not to belittle Allah's favours.", hadithSource: "Muslim 2963", wisdom: "When you envy someone, you insult your own destiny. Trust the One who distributed all things.", scholar: "Ibn Taymiyyah" }
  ],
  "Guilt": [
    { hadith: "All the children of Adam make mistakes, and the best of those who make mistakes are those who repent.", hadithSource: "Tirmidhi 2499", wisdom: "Guilt is the soul's way of telling you it still knows right from wrong — that is not weakness, that is your fitrah.", scholar: "Ibn al-Qayyim" },
    { hadith: "Allah extends His hand at night to accept the repentance of the one who sinned during the day, and He extends His hand during the day to accept the repentance of the one who sinned at night.", hadithSource: "Muslim 2759", wisdom: "Do not let your sin make you forget the vastness of His mercy.", scholar: "Imam al-Ghazali" },
    { hadith: "If you did not sin, Allah would replace you with people who would sin and then seek His forgiveness, and He would forgive them.", hadithSource: "Muslim 2749", wisdom: "Tawbah is not a sign of failure — it is the most honourable return a soul can make.", scholar: "Ibn Taymiyyah" }
  ],
  "Confusion": [
    { hadith: "None of you should wish for death because of a calamity. If he must, let him say: O Allah, keep me alive so long as life is good for me, and cause me to die when death is better for me.", hadithSource: "Bukhari 5671", wisdom: "When you cannot see the way forward, stand still and ask the One who sees everything.", scholar: "Ibn al-Qayyim" },
    { hadith: "Consult your heart. Righteousness is that about which the soul feels at ease.", hadithSource: "Ahmad 17545", wisdom: "Clarity comes to the one who prays, not the one who overthinks.", scholar: "Imam al-Ghazali" },
    { hadith: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.", hadithSource: "Muslim 2721", wisdom: "If you are torn between two paths, choose the one that brings you closer to Allah — you will never be lost.", scholar: "Ibn Taymiyyah" }
  ],
  "Heartbreak": [
    { hadith: "When Allah takes something from you, He is not punishing you — He is emptying your hands for something better.", hadithSource: "Attributed (widely cited)", wisdom: "A broken heart that turns to Allah becomes the strongest heart of all.", scholar: "Ibn al-Qayyim" },
    { hadith: "If Allah wants good for someone, He tests him.", hadithSource: "Bukhari 5645", wisdom: "Love that is lost in this world is never wasted — it teaches the heart to seek the love that never ends.", scholar: "Imam al-Ghazali" },
    { hadith: "O Allah, reward me in my calamity and replace it with something better.", hadithSource: "Muslim 918", wisdom: "Sometimes the person who broke you was the bridge that led you back to your Lord.", scholar: "Ibn Taymiyyah" }
  ],
  "Thankfulness": [
    { hadith: "He who does not thank people, does not thank Allah.", hadithSource: "Abu Dawud 4811", wisdom: "The thankful heart sees blessings even in trials.", scholar: "Ibn al-Qayyim" },
    { hadith: "Remember Allah in times of ease and He will remember you in times of hardship.", hadithSource: "Tirmidhi 2516", wisdom: "Shukr is the highest station of the heart — higher even than sabr.", scholar: "Imam al-Ghazali" },
    { hadith: "If you are grateful, I will surely increase you in favour.", hadithSource: "Bukhari (from Quran 14:7)", wisdom: "Gratitude does not just change your perspective — it changes your reality.", scholar: "Ibn Taymiyyah" }
  ]
};


/* ── Video URLs (Pexels, royalty-free) ────────────────────────── */
const VIDEO_SOURCES = {
  rain:   'https://videos.pexels.com/video-files/8110359/8110359-hd_1920_1080_30fps.mp4',
  ocean:  'https://videos.pexels.com/video-files/856204/856204-hd_1280_720_25fps.mp4',
  forest: 'https://videos.pexels.com/video-files/14057075/14057075-hd_1280_720_30fps.mp4',
  night:  'https://videos.pexels.com/video-files/2646392/2646392-hd_1280_720_30fps.mp4'
};

/* ── Ambient audio URLs (GitHub/MIT, high-quality loops) ──────── */
const SOUND_SOURCES = {
  rain:    'https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/rain.mp3',
  ocean:   'https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/ocean.mp3',
  wind:    'https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/wind.mp3',
  night:   'https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/main/audio/night.mp3',
  silence: null
};

/* ── One-line wisdom takeaways — keyed by emotion ─────────────── */
const WISDOM_LINES = {
  "Anxiety":           "Peace is not the absence of storms — it is trusting the One who calms them.",
  "Sadness":           "Your tears are not weakness — they are prayers your heart could not speak.",
  "Lack of Motivation":"The smallest step taken with bismillah outweighs a thousand plans left unstarted.",
  "Gratitude":         "The richest person is not who has the most — but who notices the most.",
  "Anger":             "Strength is not in the strike — it is in the breath you take before you respond.",
  "Feeling Lost":      "You are not lost — you are being redirected by the Best of Planners.",
  "Fear":              "Courage is not fearlessness — it is trusting Allah while your hands still tremble.",
  "Loneliness":        "You are never truly alone — the One who created you never leaves your side.",
  "Grief":             "What you love does not disappear — it changes address to the care of Allah.",
  "Hopelessness":      "Dawn has never once failed to follow the darkest part of the night.",
  "Impatience":        "Allah's timing is perfect — what is delayed is not denied.",
  "Self-Doubt":        "Allah placed you here on purpose — you are not an accident, you are an ayah.",
  "Overwhelmed":       "You were never asked to carry everything — only to take the next step.",
  "Jealousy":          "Your rizq was written before you were born — no one can take what is yours.",
  "Guilt":             "The door of tawbah is open right now — walk through it and don't look back.",
  "Confusion":         "Clarity is a gift from Allah — ask for it in sajdah and then be patient.",
  "Heartbreak":        "A broken heart that turns to Allah becomes the strongest heart of all.",
  "Thankfulness":      "Gratitude does not change what you have — it changes how you see everything."
};

/*
 * Quran surah verse counts — used to convert "Surah X (chapter:verse)"
 * to absolute ayah numbers for the recitation API.
 * Array index = surah number (1-based), value = total verses in that surah.
 */
const SURAH_VERSES = [
  0,7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,
  135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,
  53,89,59,37,35,38,88,52,45,30,25,20,56,96,25,92,29,22,24,13,14,11,11,
  18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,
  19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6
];


const RECITERS = {
  'ar.alafasy':              { name: 'Mishary Alafasy',      bitrate: 128 },
  'ar.abdurrahmaansudais':   { name: 'Abdul Rahman Al-Sudais', bitrate: 192 },
  'ar.shaatree':             { name: 'Abu Bakr Ash-Shatri',  bitrate: 128 }
};

const TOTAL_AYAHS = 6236;

/* Surah names — index 0 unused, 1–114 are the surahs */
const SURAH_NAMES = [
  '',
  'Al-Fatihah','Al-Baqarah','Aal-Imran','An-Nisa','Al-Ma\'idah','Al-An\'am','Al-A\'raf','Al-Anfal',
  'At-Tawbah','Yunus','Hud','Yusuf','Ar-Ra\'d','Ibrahim','Al-Hijr','An-Nahl','Al-Isra','Al-Kahf',
  'Maryam','Ta-Ha','Al-Anbiya','Al-Hajj','Al-Mu\'minun','An-Nur','Al-Furqan','Ash-Shu\'ara','An-Naml',
  'Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajdah','Al-Ahzab','Saba','Fatir','Ya-Sin','As-Saffat',
  'Sad','Az-Zumar','Ghafir','Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiyah','Al-Ahqaf',
  'Muhammad','Al-Fath','Al-Hujurat','Qaf','Adh-Dhariyat','At-Tur','An-Najm','Al-Qamar','Ar-Rahman',
  'Al-Waqi\'ah','Al-Hadid','Al-Mujadilah','Al-Hashr','Al-Mumtahanah','As-Saff','Al-Jumu\'ah','Al-Munafiqun',
  'At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah','Al-Ma\'arij','Nuh','Al-Jinn',
  'Al-Muzzammil','Al-Muddathir','Al-Qiyamah','Al-Insan','Al-Mursalat','An-Naba','An-Nazi\'at','Abasa',
  'At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj','At-Tariq','Al-A\'la','Al-Ghashiyah',
  'Al-Fajr','Al-Balad','Ash-Shams','Al-Layl','Ad-Duha','Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr',
  'Al-Bayyinah','Az-Zalzalah','Al-Adiyat','Al-Qari\'ah','At-Takathur','Al-Asr','Al-Humazah','Al-Fil',
  'Quraysh','Al-Ma\'un','Al-Kawthar','Al-Kafirun','An-Nasr','Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas'
];


/* ── Surah ranges for each search scope ─────────────────────────── */
const DETECT_RANGES = {
  juz30:  { from: 78, to: 114, label: 'Juz 30' },
  juz29:  { from: 67, to: 77,  label: 'Juz 29' },
  short:  { from: 93, to: 114, label: 'Short Surahs' },
  all:    { from: 1,  to: 114, label: 'Full Qur\'an' }
};
