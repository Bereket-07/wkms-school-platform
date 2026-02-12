"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Play, Heart, Camera, ArrowRight, CheckCircle2, ChevronDown, Calendar, Users, Globe, BookOpen, PieChart, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCampaigns, Campaign, getMedia, MediaItem, getSiteContent, SiteContent } from "@/lib/api";

import ContactSection from "@/components/ContactSection";

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [videoItems, setVideoItems] = useState<MediaItem[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Helper to safely get content or fallback
  const _t = (key: string, fallback: string = "") => content[key] || fallback;

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videoItems.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videoItems.length) % videoItems.length);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [campaignsData, imagesData, videosData, contentData] = await Promise.all([
          getCampaigns(),
          getMedia(0, 100, 'IMAGE'),
          getMedia(0, 100, 'VIDEO'),
          getSiteContent()
        ]);

        setCampaigns(campaignsData);
        setMediaItems(imagesData);
        setVideoItems(videosData);

        // Transform content array to key-value map for O(1) access
        const contentMap: Record<string, string> = {};
        contentData.forEach(item => {
          contentMap[item.key] = item.content;
        });
        setContent(contentMap);

      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen font-sans text-slate-800 bg-white selection:bg-emerald-100 selection:text-emerald-900">

      {/* --- HERO SECTION --- */}
      <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src="/hero-video.mp4"
          />
          <div className="absolute inset-0 bg-emerald-950/60" />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 text-center text-white flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-md rounded-full px-5 py-2 mb-8 text-sm font-bold tracking-widest font-sans uppercase text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.6)]"></span>
              {_t('hero_badge', "WKMS")}
            </div>
            <h1 className="font-lato font-bold text-white text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 drop-shadow-md">
              {_t('hero_title_1', "Connecting Education,")} <br />
              <span className="text-white">
                {_t('hero_title_accent', "Opportunity & Impact.")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto mb-10 font-medium leading-relaxed font-sans drop-shadow-sm">
              {_t('hero_subtitle', "Providing quality education to 500+ students in rural Ethiopia. We are the bridge between your generosity and their future.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center font-sans">
              <Link
                href="/donate"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-lg px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] flex items-center gap-3"
              >
                Start donating <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-slate-900 hover:bg-slate-50 border-none text-lg px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-xl flex items-center gap-3 hover:-translate-y-1"
              >
                Watch our story <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce cursor-pointer"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </header >

      {/* Intro Stats Section */}
      < section className="py-20 bg-white border-b border-slate-100" >
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <h3 className="text-6xl font-lato font-black text-slate-900 mb-2">{_t('impact_stat_1_val', '513')}</h3>
              <p className="text-slate-500 font-sans text-sm">{_t('impact_stat_1_label', 'Students educated')}</p>
            </div>
            <div className="p-6">
              <h3 className="text-6xl font-lato font-black text-slate-900 mb-2">{_t('impact_stat_2_val', '98%')}</h3>
              <p className="text-slate-500 font-sans text-sm">{_t('impact_stat_2_label', 'Passing (Grade 8-12)')}</p>
            </div>
            <div className="p-6">
              <h3 className="text-6xl font-lato font-black text-slate-900 mb-2">{_t('impact_stat_3_val', '15+')}</h3>
              <p className="text-slate-500 font-sans text-sm">{_t('impact_stat_3_label', 'Community Projects')}</p>
            </div>
          </div>
        </div>
      </section >

      {/* --- ABOUT SECTION --- */}
      < section id="about" className="py-24 px-6 md:px-12 bg-white relative overflow-hidden" >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
                {/* Main About Image */}
                {_t('about_image_main', '') ? (
                  <Image
                    src={_t('about_image_main')}
                    alt="Students Learning"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 animate-pulse" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10 text-white max-w-xs">
                  <div className="text-2xl font-serif font-bold mb-2">"Education is the most powerful weapon."</div>
                  <div className="text-white/80 text-sm">- Nelson Mandela</div>
                </div>
              </div>
              {/* Floating Accent Image */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white hidden lg:block">
                {_t('about_image_accent', '') && (
                  <Image
                    src={_t('about_image_accent')}
                    alt="Classroom"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4 block">{_t('about_badge', 'Who We Are')}</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                {_t('about_title_1', 'More Than Just')} <br />
                <span className="text-emerald-500">{_t('about_title_accent', 'A School.')}</span>
              </h2>
              <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-light">
                <p>{_t('about_text_1', "Wakero Keleboro Memorial Pre-School (WKMS)...")}</p>
                <p>{_t('about_text_2', "We provide high-quality early childhood education...")}</p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Excellence</h4>
                      <p className="text-base text-slate-500">World-class curriculum standards.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Community</h4>
                      <p className="text-base text-slate-500">Built by and for the people.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* --- COMMUNITY SECTION --- */}
      < section id="community" className="py-32 bg-slate-50 px-6 md:px-12" >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-2 block">{_t('community_badge', 'Our Community')}</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">{_t('community_title', 'Understanding the Need')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 font-sans">
            <div className="bg-amber-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-amber-500 rounded-full"></span> {_t('community_col1_title', 'The Challenge')}
              </h3>
              <ul className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-600 font-bold text-sm shrink-0">{i}</span>
                    <span className="text-slate-800 text-lg font-medium">{_t(`community_challenge_${i}`, 'Challenge details...')}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span> {_t('community_col2_title', 'The WKMS Solution')}
              </h3>
              <ul className="space-y-6 relative z-10">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">✓</span>
                    <span className="text-slate-300 text-lg font-medium">
                      <strong>{_t(`community_solution_${i}_label`, 'Solution:')}</strong> {_t(`community_solution_${i}_text`, 'Details...')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section >

      {/* --- IMPACT SECTION --- */}
      < section id="impact" className="py-32 px-6 md:px-12 bg-white text-center" >
        <div className="container mx-auto max-w-5xl">
          <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4 block">{_t('impact_badge', 'Radical Transparency')}</span>
          <h2 className="text-5xl md:text-7xl font-lato font-black mb-8 text-slate-900">
            {_t('impact_title', 'Every Cent Counted.')}
          </h2>
          <p className="text-2xl md:text-3xl text-slate-500 font-light mb-16 max-w-3xl mx-auto">
            {_t('impact_subtitle', 'We believe you deserve to know exactly where your money goes. We are committed to absolute financial transparency.')}
          </p>

          {/* Stats Cards (Reused Logic) */}
          {/* Stats Cards (Reused Logic) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-sans">
            <div className="aspect-square bg-slate-50 rounded-full flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 p-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-5xl font-lato font-black text-slate-900 mb-2">60%</div>
              <h3 className="text-xl font-bold text-slate-600">Direct Education</h3>
            </div>
            <div className="aspect-square bg-slate-50 rounded-full flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 p-8">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="text-5xl font-lato font-black text-slate-900 mb-2">30%</div>
              <h3 className="text-xl font-bold text-slate-600">Student Welfare</h3>
            </div>
            <div className="aspect-square bg-slate-50 rounded-full flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 p-8">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 mb-4">
                <PieChart className="w-6 h-6" />
              </div>
              <div className="text-5xl font-lato font-black text-slate-900 mb-2">10%</div>
              <h3 className="text-xl font-bold text-slate-600">Ops & Admin</h3>
            </div>
          </div>
        </div>
      </section >

      {/* --- MEDIA SECTION (IMAGES) --- */}
      < section id="media" className="py-32 bg-slate-900 text-white relative overflow-hidden" >
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 block">Our Gallery</span>
          <h2 className="text-4xl md:text-6xl font-lato font-black text-white leading-tight mb-16">Stories in Pictures.</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-800 rounded-3xl aspect-[4/3]"></div>
              ))}
            </div>
          ) : (
            <div className="relative w-full overflow-hidden -mx-4 md:-mx-12 py-10">
              {/* Gradient Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

              <motion.div
                className="flex gap-8 w-max"
                animate={{ x: "-50%" }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 40,
                }}
                whileHover={{ animationPlayState: 'paused' }}
              >
                {[...mediaItems, ...mediaItems].map((item, index) => (
                  <div
                    key={`img-${item.id}-${index}`}
                    className="relative w-[300px] md:w-[400px] aspect-[4/3] rounded-[2rem] overflow-hidden shrink-0 group cursor-pointer border-4 border-slate-800 hover:border-emerald-500 transition-colors duration-300"
                  >
                    <img
                      src={item.url}
                      alt={item.title || "Gallery"}
                      className="w-full h-full object-cover transform transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 text-left">
                      <p className="text-white font-bold text-xl line-clamp-1">{item.title || "Stories of Hope"}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </section >

      {/* --- VIDEO GALLERY SECTION --- */}
      < section id="videos" className="py-32 bg-[#050505] text-white relative overflow-hidden" >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        {/* Cinematic Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">Experience WKMS</span>
            <h2 className="text-4xl md:text-6xl font-lato font-black text-white tracking-tight">
              Highlights in Motion
            </h2>
          </div>

          {loading ? (
            <div className="max-w-5xl mx-auto aspect-video bg-slate-800/50 rounded-3xl animate-pulse border border-white/5"></div>
          ) : videoItems.length > 0 ? (
            <div className="max-w-6xl mx-auto relative group">

              {/* Main Stage */}
              <div className="relative aspect-video bg-black rounded-[2rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] border border-white/10 ring-1 ring-white/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentVideoIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full h-full relative"
                  >
                    <VideoPlayer
                      src={videoItems[currentVideoIndex].url}
                      poster={videoItems[currentVideoIndex].url ? `${videoItems[currentVideoIndex].url}#t=0.1` : undefined}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows (Only if > 1 video) */}
              {videoItems.length > 1 && (
                <>
                  <button
                    onClick={prevVideo}
                    className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-14 h-14 bg-white/5 hover:bg-amber-500 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg z-20 group/nav"
                  >
                    <ArrowRight className="w-6 h-6 rotate-180 group-hover/nav:text-black transition-colors" />
                  </button>
                  <button
                    onClick={nextVideo}
                    className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-14 h-14 bg-white/5 hover:bg-amber-500 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg z-20 group/nav"
                  >
                    <ArrowRight className="w-6 h-6 group-hover/nav:text-black transition-colors" />
                  </button>
                </>
              )}

              {/* Active Video Details */}
              <div className="mt-8 text-center max-w-2xl mx-auto">
                <motion.div
                  key={`desc-${currentVideoIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-lato">
                    {videoItems[currentVideoIndex].title || "Untitled Video"}
                  </h3>
                  {videoItems[currentVideoIndex].description && (
                    <p className="text-slate-400 text-lg leading-relaxed">
                      {videoItems[currentVideoIndex].description}
                    </p>
                  )}
                </motion.div>

                {/* Pagination Dots */}
                {videoItems.length > 1 && (
                  <div className="flex justify-center gap-3 mt-8">
                    {videoItems.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentVideoIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentVideoIndex ? 'w-8 bg-amber-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-white/5 max-w-4xl mx-auto backdrop-blur-sm">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-300 mb-2">No videos yet</h3>
              <p className="text-slate-500">We are busy capturing moments. Check back soon!</p>
            </div>
          )}
        </div>
      </section >

      {/* Featured Campaign Section (CTA) */}
      < section className="py-24 px-6 md:px-12 bg-emerald-50 relative overflow-hidden" >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-emerald-100 text-center">
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-4 block">Take Action</span>
            <h2 className="text-4xl md:text-6xl font-lato font-black text-slate-900 leading-tight mb-8">
              Ready to Change a Life?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Your contribution, big or small, goes directly to where it's needed most. Join us in building a brighter future.
            </p>

            <Link href="/donate" className="inline-flex items-center gap-3 bg-slate-900 text-white text-xl px-12 py-5 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Make a Donation <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
            </Link>
          </div>
        </div>
      </section >


      {/* Contact Section */}
      < ContactSection />

      {/* Footer */}
      < footer className="bg-white pt-24 pb-12 border-t border-slate-100" >
        <div className="container mx-auto px-6 md:px-12 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <span className="font-lato font-black text-2xl text-slate-900 block mb-4">WKMS</span>
              <p className="text-slate-500 text-sm leading-relaxed">
                {_t('footer_desc', "Wakero Keleboro Memorial Pre-School. Empowering rural communities through education.")}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Explore</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition">About Us</button></li>
                <li><button onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition">Our Impact</button></li>
                <li><button onClick={() => document.getElementById('media')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition">Gallery</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-emerald-600 transition">Facebook</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Instagram</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-emerald-600 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} WKMS. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span>Designed with ❤️ for Education</span>
            </div>
          </div>
        </div>
      </footer >
    </main >
  );
}

function VideoPlayer({ src, poster }: { src: string, poster?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPlaying(true);
          videoRef.current?.play().catch(() => { });
        } else {
          setIsPlaying(false);
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/20 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        className={`w-full h-full object-contain transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        controls
        playsInline
        muted
        loop
        poster={poster}
        preload="metadata"
        onLoadedData={() => setIsLoaded(true)}
        onWaiting={() => setIsLoaded(false)}
        onPlaying={() => setIsLoaded(true)}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

