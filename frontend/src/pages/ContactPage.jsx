import { useState } from "react";

const ContactPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I collaborate with Belleze?",
      answer:
        "For influencer or brand collaborations, please reach us at collab@belleze.com.",
    },
    {
      question: "How do I contact Belleze customer support?",
      answer:
        "You can contact our support team via support@belleze.com during business hours.",
    },
    {
      question: "Where can I find information about my orders?",
      answer:
        "Order details and delivery updates are available in your Belleze account.",
    },
    {
      question: "What is Belleze return policy?",
      answer:
        "Belleze offers returns within 7 days of delivery for eligible products.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen bg-white px-6 lg:px-20 py-16">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-6xl lg:text-8xl font-bold tracking-tight">
            CONTACT US
          </h1>

          <p className="mt-6 max-w-md text-gray-600">
            Questions about products, orders, or partnerships?  
            Reach out to Belleze — we’re here to help.
          </p>

          {/* CONTACT DETAILS */}
          <div className="mt-14 space-y-10 text-sm">
            <div>
              <h3 className="font-semibold uppercase">Customer Care</h3>
              <p className="mt-2 text-gray-600">
                support@belleze.com
              </p>
            </div>

            <div>
              <h3 className="font-semibold uppercase">
                Business & Collaborations
              </h3>
              <p className="mt-2 text-gray-600">
                business@belleze.com
              </p>
            </div>

            <div>
              <h3 className="font-semibold uppercase">Head Office</h3>
              <p className="mt-2 text-gray-600">
                Belleze Cosmetics<br />
                Kathmandu, Nepal
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL – BEAUTY UI PANEL (NO IMAGE, NO BACKEND) */}
        <div className="relative w-full h-[80vh] bg-neutral-100 flex items-center justify-center overflow-hidden">
          {/* subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>

          {/* center text */}
          <div className="relative text-center">
            <p className="uppercase tracking-[0.35em] text-gray-500 text-sm">
              Belleze Beauty
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight">
              Confidence in Every Shade
            </h3>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="mt-32">
        <h2 className="text-4xl font-bold tracking-tight">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="mt-10 divide-y">
          {faqs.map((faq, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full justify-between items-center text-left"
              >
                <span className="text-lg font-medium">
                  {faq.question}
                </span>
                <span className="text-2xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <p className="mt-4 max-w-2xl text-gray-600">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
