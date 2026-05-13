import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Video, CheckCircle, LayoutGrid } from 'lucide-react'

const features = [
  { icon: Brain, title: 'AI-generated courses', desc: 'Custom courses built from your topic in seconds, not hours.' },
  { icon: Video, title: 'Curated videos', desc: 'Relevant YouTube videos matched to every chapter automatically.' },
  { icon: CheckCircle, title: 'Track progress', desc: 'Mark chapters complete and pick up right where you left off.' },
  { icon: LayoutGrid, title: 'Any subject', desc: 'Coding, design, science, business — anything you want to learn.' },
]

function Hero() {
  return (
    <div>
      {/* Hero */}
      <div className='mt-18 flex justify-center mb-12'>
        <div className='max-w-3xl w-full text-center space-y-6'>
          <div className="inline-flex items-center gap-2 bg-purple-50 text-primary text-sm px-3 py-1 rounded-full">
            <Sparkles className="h-3 w-3" /> AI-powered learning
          </div>
          <h1 className='text-4xl md:text-5xl font-bold'>Learn anything with your <span className='text-primary'>personal AI tutor</span></h1>
          <p className='text-lg text-gray-500'>Tell us what you want to learn. We'll generate a full course — chapters, topics, videos, and content — tailored just for you, in seconds.</p>
          <Link href="/workspace">
            <Button className="px-8 py-5 text-base">Start learning free</Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <section className="py-10 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <f.icon className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-semibold text-base mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Hero