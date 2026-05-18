import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', content: '' });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-reveal',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/messages', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', content: '' });
    } catch (err) {
      console.error('Failed to send message', err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="w-full bg-[#1A365D] py-32 md:py-48">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">

        {/* Manifesto quote — like Brandin's big statement */}
        <div className="mb-32 contact-reveal">
          <h2 className="cs-lg text-[#F0EBE0] leading-[1.1] max-w-5xl">
            In a world filled with noise,{' '}
            <span className="text-[#8FA9C4]">we build walls of sound</span>{' '}
            and turn static into something{' '}
            <span className="text-[#8FA9C4]">beautiful</span>.
          </h2>
        </div>

        {/* Section header */}
        <div className="flex items-center gap-6 mb-16 contact-reveal">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">// 06</span>
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">Get in Touch</span>
          <div className="flex-1 h-px bg-[#3A609E]" />
          <span className="hidden md:block font-mono text-sm text-[#3A609E] select-none">コンタクト</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left */}
          <div className="contact-reveal">
            <h2 className="cs-lg text-[#F0EBE0] leading-[1] mb-8">
              Drop us a<br />
              <span className="text-[#8FA9C4]">line</span>.
            </h2>
            <p className="font-mono text-sm md:text-base text-[#8FA9C4] leading-relaxed mb-12">
              For bookings, press, collaborations, or just to say hello.
              We read everything, even if we reply slowly.
            </p>

            <div className="space-y-6">
              {[
                { label: 'Booking',  value: 'booking@lyralize.com' },
                { label: 'Press',    value: 'press@lyralize.com' },
                { label: 'Location', value: 'Bandung, West Java, Indonesia' },
              ].map(({ label, value }) => (
                <div key={label} className="border-t border-[#0A0F2E] pt-5">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#1400FF]">// {label}</span>
                  <p className="font-mono text-base mt-2 text-[#E8EEFF]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="contact-reveal">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="blue-card w-28 h-28 flex items-center justify-center mb-8">
                  <span className="cs-md text-white leading-none">✓</span>
                </div>
                <h3 className="cs-md text-[#F0EBE0] mb-4">Message sent.</h3>
                <p className="font-mono text-sm text-[#8FA9C4]">
                  We'll get back to you soon. Thanks for reaching out.
                </p>
                <button onClick={() => setStatus(null)}
                  className="mt-8 font-mono text-[11px] tracking-[0.25em] uppercase text-[#8FA9C4] border-b border-[#8FA9C4] pb-0.5 hover:text-[#F0EBE0] hover:border-[#F0EBE0] transition-colors cursor-pointer">
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { name: 'name',  type: 'text',  label: 'Name',  placeholder: 'Your name' },
                    { name: 'email', type: 'email', label: 'Email', placeholder: 'your@email.com' },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col gap-3">
                      <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#5A6080]">
                        // {field.label}
                      </label>
                      <input type={field.type} name={field.name} required
                        value={form[field.name]} onChange={handleChange}
                        placeholder={field.placeholder}
                        className="bg-transparent border-b border-[#3A609E] focus:border-[#8FA9C4] outline-none py-3 font-mono text-base text-[#F0EBE0] placeholder-[#8FA9C4]/50 transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#5A6080]">// Subject</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange}
                    placeholder="What's this about?"
                    className="bg-transparent border-b border-[#0A0F2E] focus:border-[#1400FF] outline-none py-3 font-mono text-base text-[#E8EEFF] placeholder-[#5A6080]/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#5A6080]">// Message</label>
                  <textarea name="content" required rows={5} value={form.content} onChange={handleChange}
                    placeholder="Write your message here..."
                    className="bg-transparent border-b border-[#0A0F2E] focus:border-[#1400FF] outline-none py-3 font-mono text-base text-[#E8EEFF] placeholder-[#5A6080]/50 transition-colors resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="font-mono text-sm text-[#8FA9C4]">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <button type="submit" disabled={status === 'sending'}
                  className="group flex items-center gap-4 bg-[#8FA9C4] text-[#04060A] px-10 py-5 font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-[#A0C4E2] transition-colors disabled:opacity-50 rounded-full cursor-pointer">
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
