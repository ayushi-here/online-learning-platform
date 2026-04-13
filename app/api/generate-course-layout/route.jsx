import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `Generate Learning Course depends on following details. In which Make sure to add Course Name, Description, Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, Topic under each chapters, Duration for each chapters etc, in JSON format only
Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ]
      }
    ]
  }
}, User Input:`

export async function POST(req) {
  const {courseId , ...formData} = await req.json();
  const user = await currentUser();

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      response_format: { type: 'json_object' },
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        {
          role: "user",
          content: JSON.stringify(formData),
        }
      ],
    });

    const message = completion.choices[0].message;
    const RawResp = message.content;
    const JSONResp = JSON.parse(RawResp ?? '');

    const ImagePromt = JSONResp?.course?.bannerImagePrompt;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(ImagePromt)}?width=1280&height=720`;

    //generate Image

    // Save to Database

    const result = await db.insert(coursesTable).values({
      ...formData,
      courseJson: RawResp,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      cid: courseId,
      bannerImageUrl: imageUrl
    })

    return NextResponse.json({courseId: courseId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}