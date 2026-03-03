import { useState } from "react";

const About = () => {
  return (
    <section className="min-h-screen bg-white px-6 lg:px-20 py-16">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-6xl lg:text-8xl font-bold tracking-tight">
            ABOUT US
          </h1>

          <p className="mt-6 max-w-md text-gray-600">
            Belleze is a modern beauty brand built on confidence, inclusivity,
            and effortless elegance. We believe makeup is not about hiding —
            it’s about expressing who you are.
          </p>

          {/* INFO BLOCKS */}
          <div className="mt-14 space-y-10 text-sm">
            <div>
              <h3 className="font-semibold uppercase">Our Mission</h3>
              <p className="mt-2 text-gray-600 max-w-md">
                To empower individuals through high-quality, accessible beauty
                products that celebrate diversity and self-expression.
              </p>
            </div>

            <div>
              <h3 className="font-semibold uppercase">Our Vision</h3>
              <p className="mt-2 text-gray-600 max-w-md">
                To become a trusted beauty destination that blends innovation,
                simplicity, and timeless design.
              </p>
            </div>

            <div>
              <h3 className="font-semibold uppercase">Why Belleze</h3>
              <p className="mt-2 text-gray-600 max-w-md">
                Thoughtfully curated products, clean design, and a customer-first
                approach — beauty made effortless.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL – UI ONLY */}
        <div className="relative w-full h-[80vh] bg-neutral-100 flex items-center justify-center overflow-hidden">
          {/* subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>

          {/* center text */}
          <div className="relative text-center">
            <p className="uppercase tracking-[0.35em] text-gray-500 text-sm">
              Belleze Studio
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight">
              Beauty, Redefined
            </h3>
          </div>
        </div>
      </div>

      {/* VALUES SECTION */}
      <div className="mt-32">
        <h2 className="text-4xl font-bold tracking-tight">
          OUR CORE VALUES
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
          <div>
            <h4 className="font-semibold uppercase">Inclusivity</h4>
            <p className="mt-2 text-gray-600">
              Beauty for every skin tone, style, and identity.
            </p>
          </div>

          <div>
            <h4 className="font-semibold uppercase">Quality</h4>
            <p className="mt-2 text-gray-600">
              Carefully selected products that meet high standards.
            </p>
          </div>

          <div>
            <h4 className="font-semibold uppercase">Confidence</h4>
            <p className="mt-2 text-gray-600">
              Designed to help you feel bold, confident, and authentic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
