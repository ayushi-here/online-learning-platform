import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

const PROMPT=`Generate Learning Course depends on following details. In which Make sure to add Course Name, Description, Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, Topic under each chapters, Duration for each chapters etc, in JSON format only

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
}

, User Input:

`

export const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  const {courseId, ...formData} = await req.json();

  const user =await currentUser();
  
  const config = {
    responseMIMEType: 'text/plain',
  };
  const model = 'gemini-2.5-flash-lite';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: PROMPT+JSON.stringify(formData),
        },
      ],
    },
  ];
  const response = await ai.models.generateContent({
    model,
    contents,
    config,
  });
  
  console.log("AI Response:", response.candidates[0].content.parts[0].text);
  const RawResp = response?.candidates[0]?.content?.parts[0]?.text;
  const RawJson = RawResp.replace('```json', '').replace('```', '');
  const JSONResp = JSON.parse(RawJson);
  const imagePrompt = JSONResp.course?.bannerImagePrompt;

  const bannerImageUrl = await GenerateImage(imagePrompt);

  //saving to DB
  const result = await db.insert(coursesTable).values({
      ...formData,
      courseJson: JSONResp,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      cid: courseId,
      bannerImageUrl: bannerImageUrl
    })

  return NextResponse.json({
    courseId: courseId
  });
}

const GenerateImage =async(imagePrompt)=>{
  const BASE_URL = 'https://aigurulab.tech';
  const result = await axios.post(BASE_URL+'/api/generate-image',{
    width: 1024,
    height: 1024,
    input: imagePrompt,
    model: 'flux',
    aspectRatio:"16:9"
  },
  {
    headers:{
      'x-api-key': process.env.IMAGE_GEN_API_KEY,
      'Content-Type':'application/json'
    }
  }
)
console.log("Image Gen Response:", result.data.image);
return result.data.image;
}