import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export const Testimonials: React.FC = () => {
  const reviews: Testimonial[] = [
    {
      name: 'Dr. Evelyn Foster',
      role: 'Principal Cloud Architect',
      company: 'OmniCorp Systech',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      content: 'JB Blogging is my leading bookmark source for high-quality technical posts. The depth of authors tutorial writes combined with clean typography makes reading an absolute pleasure.',
      rating: 5
    },
    {
      name: 'Kai Takahashi',
      role: 'Staff Product designer',
      company: 'Zenith Labs',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      content: 'I am highly impressed by the editorial discipline on this platform. The layouts are responsive, and code snippets look crisp in both dark and light modes. Simply stellar experience!',
      rating: 5
    },
    {
      name: 'Austin Vance',
      role: 'Venture Partner & Tech Author',
      company: 'Catalyst Ventures',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      content: 'The content analytics suite provided to creators on JB Blogging surpassed my expectations. It maps audience reads, likes, and comment histories with supreme precision.',
      rating: 5
    }
  ];

  return (
    <div className="py-12 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-800/60 p-6 sm:p-8">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="px-2.5 py-1 text-[9px] font-extrabold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/10 rounded-full tracking-wider uppercase">
          COMMUNITY FEEDBACK
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-3">
          What experts say about JB Blogging
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          Trusted by tens of thousands of authors, product creators, cloud engineers, and bootstrap founders worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, index) => (
          <div 
            key={index}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between relative"
          >
            <Quote className="absolute right-6 top-6 h-10 w-10 text-blue-500/5 select-none" />
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                "{rev.content}"
              </p>
            </div>

            <div className="flex items-center gap-3">
              <img 
                src={rev.avatar} 
                alt={rev.name} 
                className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/10"
              />
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">{rev.name}</h4>
                <p className="text-[10px] text-slate-400">{rev.role}, <span className="font-semibold">{rev.company}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
