import React from 'react'

const ContactPage = () => {
  return (
    <div className="bg-black text-white min-h-screen py-24 selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto px-6 space-y-32">
        
        <div className="space-y-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-500">Concierge</p>
          <h1 className="text-5xl font-serif font-light tracking-tight">Personal Assistance</h1>
          <div className="w-24 h-[1px] bg-gray-900 mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Inquiry Form */}
          <div className="space-y-12">
            <div className="space-y-2">
               <h2 className="text-xl font-serif font-light">Submit an Inquiry</h2>
               <p className="text-xs text-gray-500 uppercase tracking-widest">Our specialists will respond within 24 hours</p>
            </div>
            <form className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                 <input type="text" placeholder="Full Name" className="bg-transparent border-b border-gray-900 focus:border-white py-4 text-sm font-light transition-all outline-none" />
                 <input type="email" placeholder="Email Address" className="bg-transparent border-b border-gray-900 focus:border-white py-4 text-sm font-light transition-all outline-none" />
              </div>
              <input type="text" placeholder="Subject / Reference Number" className="w-full bg-transparent border-b border-gray-900 focus:border-white py-4 text-sm font-light transition-all outline-none" />
              <textarea placeholder="Message" rows="6" className="w-full bg-transparent border-b border-gray-900 focus:border-white py-4 text-sm font-light transition-all outline-none resize-none"></textarea>
              <button className="bg-white text-black px-12 py-5 text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-gray-200 transition-all">Send Inquiry</button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="space-y-16">
             <div className="space-y-8">
                <h2 className="text-xs uppercase tracking-[0.4em] text-gray-600 border-b border-gray-900 pb-4 font-medium">Global Offices</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-white">Geneva</p>
                      <p className="text-sm font-light text-gray-500 leading-relaxed">Rue de la Corraterie 1<br />1204 Geneva, Switzerland</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-white">London</p>
                      <p className="text-sm font-light text-gray-500 leading-relaxed">16 New Bond Street<br />London W1S 3SU, UK</p>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <h2 className="text-xs uppercase tracking-[0.4em] text-gray-600 border-b border-gray-900 pb-4 font-medium">Direct Channels</h2>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm font-light">
                      <span className="text-gray-600">General Inquiries</span>
                      <span className="text-white hover:underline cursor-pointer">concierge@chronosluxe.com</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-light">
                      <span className="text-gray-600">Acquisitions</span>
                      <span className="text-white hover:underline cursor-pointer">sales@chronosluxe.com</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-light">
                      <span className="text-gray-600">Client Services</span>
                      <span className="text-white hover:underline cursor-pointer">+41 22 123 45 67</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ContactPage
