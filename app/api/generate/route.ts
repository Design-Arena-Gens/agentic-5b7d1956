import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const MASTER_PROMPT = `You are an autonomous AI agent specialized in creating viral YouTube Shorts & TikTok videos.

PRIMARY GOAL:
Generate high-retention, scroll-stopping Shorts (5–15 seconds) optimized for:
* Instant hook (0–1 second)
* Looping rewatchability
* Simple visuals
* No context required
* High dopamine / curiosity / emotion

CONTENT RULES:
* Hook must appear immediately (text or visual)
* No slow intros
* No explanations
* Simple, absurd, emotional, or oddly satisfying ideas
* Works even without sound
* Must loop seamlessly (ending connects to beginning)

VIRAL TRIGGERS TO USE (at least 2 per video):
* Absurdity
* Unexpected movement
* Contrast (tiny vs big, calm vs chaos)
* Repetition
* Overreaction
* Sudden cut
* Cute aggression
* Visual tension

AVOID:
* Long explanations
* Talking heads
* Logos or watermarks
* Subtitles longer than 5 words
* Complex storytelling

PLATFORM OPTIMIZATION:
* Vertical 9:16
* Designed for YouTube Shorts & TikTok
* Watchable with sound OFF
* First frame must stop scrolling

Generate exactly 5 viral YouTube Shorts ideas in valid JSON format:

[
  {
    "hookText": "6 words max hook",
    "visualDescription": "Detailed frame-by-frame visual description",
    "styleMood": "e.g. chaotic, cute, eerie, wholesome, satisfying",
    "onScreenText": "Big readable text (if any)",
    "loopMechanism": "How the video loops perfectly",
    "viralTriggers": ["trigger1", "trigger2"]
  }
]`;

const categoryPrompts: Record<string, string> = {
  general: 'Create diverse viral content across different themes.',
  animals: 'Focus on cute, funny, or unexpected animal behaviors. Include pets, wildlife, and animal reactions.',
  brainrot: 'Create absurd, chaotic, memetic content that feels like "brain rot". Random, fast-paced, nonsensical but addictive.',
  horror: 'Short horror/creepy content. Eerie, unsettling, jump scares, or mysteriously satisfying horror.',
  motivation: 'Quick motivational hits. Inspiring, powerful, "you got this" energy in 5-10 seconds.',
  satisfying: 'Oddly satisfying visuals. Perfect loops, ASMR-friendly, clean, organized, satisfying completions.',
  memes: 'Meme-based content. Relatable, funny, uses popular meme formats or creates new ones.',
  kids: 'Kid-friendly content. Colorful, educational, wholesome, safe for children.',
};

export async function POST(request: NextRequest) {
  try {
    const { category = 'general', customPrompt = '' } = await request.json();

    const categoryContext = categoryPrompts[category] || categoryPrompts.general;
    const customContext = customPrompt ? `\n\nUSER CUSTOM IDEA: ${customPrompt}\n\nIncorporate this idea into at least one of the shorts.` : '';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: MASTER_PROMPT,
        },
        {
          role: 'user',
          content: `${categoryContext}${customContext}\n\nGenerate 5 viral YouTube Shorts ideas now. Return ONLY valid JSON array, no markdown formatting.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '[]';

    // Clean up markdown code blocks if present
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }

    const ideas = JSON.parse(cleanedContent);

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Error generating shorts:', error);
    return NextResponse.json(
      { error: 'Failed to generate shorts' },
      { status: 500 }
    );
  }
}
