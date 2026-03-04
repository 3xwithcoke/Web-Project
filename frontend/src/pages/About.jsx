import React from 'react'

const About = () => {
  return (
    <div className="bg-black text-white min-h-screen py-24 selection:bg-white selection:text-black">
      <div className="max-w-4xl mx-auto px-6 space-y-24">
        
        <div className="space-y-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-500">The Legacy</p>
          <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight italic">Chronos Luxe</h1>
          <div className="w-24 h-[1px] bg-gray-900 mx-auto"></div>
        </div>

        <div className="space-y-12">
           <section className="space-y-6">
              <h2 className="text-2xl font-serif font-light tracking-tight border-b border-gray-900 pb-4">Our Heritage</h2>
              <p className="text-gray-400 font-light text-lg leading-relaxed italic">
                Chronos Luxe was founded on the belief that a timepiece is more than a tool for measuring time; it is a testament to history, craftsmanship, and the enduring nature of style.
              </p>
           </section>

           <section className="space-y-6">
              <h2 className="text-2xl font-serif font-light tracking-tight border-b border-gray-900 pb-4">Philosophy</h2>
              <p className="text-gray-400 font-light text-lg leading-relaxed">
                We source only the world's most exceptional timepieces, from established houses of horology to avant-garde watchmakers. Every watch in our collection is a masterpiece of precision and aesthetic purity.
              </p>
           </section>

           <section className="grid grid-cols-1 md:grid-cols-2 gap-16 py-12">
              <div className="space-y-4">
                 <h3 className="text-xs uppercase tracking-widest text-white">Precision</h3>
                 <p className="text-gray-500 text-sm font-light leading-relaxed">Each movement is a mechanical marvel, tested for absolute accuracy and enduring performance across generations.</p>
              </div>
              <div className="space-y-4">
                 <h3 className="text-xs uppercase tracking-widest text-white">Provenance</h3>
                 <p className="text-gray-500 text-sm font-light leading-relaxed">We guarantee the absolute authenticity and verified history of every timepiece that enters our boutique.</p>
              </div>
           </section>
        </div>

        <div className="text-center py-24">
           <p className="text-[10px] uppercase tracking-[0.3em] text-gray-700 italic">Est. 2026 — Geneva & Beyond</p>
        </div>

      </div>
    </div>
  )
}

export default About
