import React from 'react';
import { Star, Quote, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: "Major Harpreet Singh (Retd.)",
      location: "Bought 10 Marla Plot • Tibri Road",
      review: "Cleanest property transaction of my life. Being an army background person, clear revenue registry and mutation were my highest priorities. Gurdaspur Property Consultants verified all tehsil documents in advance. No hidden broker surprises.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Dr. R.K. Sharma",
      location: "Purchased 12 Marla Kothi • Jail Road",
      review: "Found a dream 4 BHK house near the Civil Hospital. They helped me negotiate directly with the owner and facilitated an SBI home loan sanction within 10 days. Outstanding professional work in Gurdaspur.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Balwinder Singh Dhillon",
      location: "NRI Investor • Surrey, BC (Canada)",
      review: "Sitting in Vancouver, I was worried about illegal encroachment on our 8 Kanal land on Trimmu Road. This team visited the site, gave me drone video proof, and got the boundary wall done. 100% trustworthy for overseas Punjabis.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>500+ Verified Property Deals Closed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            Trusted by Gurdaspur Families & NRIs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Real feedback from genuine buyers, sellers, and overseas land owners who completed their registry through our advisory.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-10 h-10 text-emerald-500/15 absolute top-6 right-6" />

              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 text-amber-400 mb-5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed italic mb-6">
                  "{item.review}"
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 font-['Outfit']">
                    {item.name}
                  </h4>
                  <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {item.location}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
