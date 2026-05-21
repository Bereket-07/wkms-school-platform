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
    <main className="min-h-screen font-sans text-slate-800 bg-white selection:bg-brand-light selection:text-brand-dark">

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
          <div className="absolute inset-0 bg-brand-dark/75" />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 text-center text-white flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center bg-[#004d49]/90 rounded-md px-6 py-2 mb-10 text-[15px] text-white/90 font-light tracking-wide shadow-sm backdrop-blur-sm">
              {_t('hero_badge', 'Educating for tomorrow')}
            </div>
            <h1 className="font-sans font-bold text-white text-5xl md:text-7xl lg:text-[80px] leading-[1.1] tracking-tight mb-8 drop-shadow-2xl">
              {_t('hero_title_1', 'Connecting Education,')} <br className="hidden md:block" />
              {_t('hero_title_accent', 'Opportunity & Impact.')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 font-normal leading-relaxed font-sans drop-shadow-md">
              {_t('hero_subtitle', 'Providing quality education to 500+ students in rural Ethiopia. We are the bridge between your generosity and their future.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center font-sans">
              <Link
                href="/pledge"
                className="bg-brand-red hover:bg-[#d4151a] text-white text-[17px] px-8 py-3.5 rounded-md font-medium transition-all duration-300 flex items-center gap-3 shadow-lg"
              >
                Start donating <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-brand-dark hover:bg-slate-50 border-none text-[17px] px-8 py-3.5 rounded-md font-medium transition-all duration-300 shadow-lg flex items-center gap-3"
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
      <section className="py-24 bg-brand-light">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 text-center divide-y md:divide-y-0 md:divide-x divide-brand-dark/20">
            <div className="py-8 md:py-0 px-6">
              <h3 className="text-6xl md:text-7xl font-sans font-black text-brand-dark tracking-tight mb-3">{_t('impact_stat_1_val', '513')}</h3>
              <p className="text-brand-dark/70 font-sans text-base">{_t('impact_stat_1_label', 'Students enrolled')}</p>
            </div>
            <div className="py-8 md:py-0 px-6">
              <h3 className="text-6xl md:text-7xl font-sans font-black text-brand-dark tracking-tight mb-3">{_t('impact_stat_2_val', '98%')}</h3>
              <p className="text-brand-dark/70 font-sans text-base">{_t('impact_stat_2_label', 'Pass rate')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-32 px-6 md:px-12 bg-white relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left Graphics */}
            <div className="order-2 lg:order-1 relative">
              <div className="relative h-[500px] md:h-[600px] rounded-[1rem] md:rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-[6px] border-white">
                {_t('about_image_main', '') ? (
                  <img
                    src={_t('about_image_main')}
                    alt="Students Learning"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 animate-pulse" />
                )}
              </div>

              {/* Floating Accent Image */}
              <div className="absolute -bottom-12 -right-6 md:-right-12 w-48 h-48 md:w-64 md:h-64 rounded-[1rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-[6px] border-white z-20 hidden md:block">
                {_t('about_image_accent', '') ? (
                  <img
                    src={_t('about_image_accent')}
                    alt="Classroom"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 animate-pulse" />
                )}
              </div>
            </div>

            {/* Right Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-block border-b-2 border-brand-dark pb-0.5 mb-10">
                <span className="text-brand-dark font-bold text-[17px]">{_t('about_badge', 'About Us')}</span>
              </div>

              <h2 className="text-6xl md:text-[85px] font-sans font-black text-brand-dark mb-10 leading-[1] tracking-tight">
                {_t('about_title_1', 'More than just')} <br className="hidden md:block" />
                <span className="text-brand-orange">{_t('about_title_accent', 'a school')}</span>
              </h2>

              <div className="space-y-6 text-lg md:text-[19px] text-slate-400 font-light leading-relaxed mb-16 max-w-xl">
                <p>{_t('about_text_1', 'Providing quality education to 500+ students in rural Ethiopia. We are the bridge between your generosity and their future.')}</p>
                <p>{_t('about_text_2', 'Providing quality education to 500+ students in rural Ethiopia. We are the bridge between your generosity and their future.')}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 sm:gap-14">
                {/* Feature 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-brand-orange/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal -rotate-45 ml-1"><path d="m3 3 3 9-3 9 19-9ZM6 12h16" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[19px] text-brand-orange leading-tight tracking-tight">Excellence</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 tracking-wider">World Class community standards.</p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-brand-orange/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal -rotate-45 ml-1"><path d="m3 3 3 9-3 9 19-9ZM6 12h16" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[19px] text-brand-orange leading-tight tracking-tight">Community</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 tracking-wider">Built by and for the people.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- COMMUNITY SECTION --- */}
      <section id="community" className="py-32 bg-[#e6f4f1] px-6 md:px-12">
        <div className="container mx-auto max-w-[1100px]">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="inline-block border-b-[2px] border-brand-dark pb-0.5 mb-6">
              <span className="text-brand-dark font-bold text-[16px]">{_t('community_badge', 'Community')}</span>
            </div>
            <h2 className="text-5xl md:text-[75px] font-sans font-black text-brand-dark leading-[1] tracking-[-0.02em]">{_t('community_title', 'Understanding the need')}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 font-sans max-w-5xl mx-auto">
            <div className="bg-white p-10 md:p-12 lg:p-14 rounded-[20px] shadow-sm">
              <h3 className="text-[22px] font-black text-black mb-10 flex items-center gap-4 tracking-tight">
                <span className="w-[4px] h-6 bg-brand-red"></span> {_t('community_col1_title', 'The Challenge')}
              </h3>
              <ul className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex gap-6 items-start">
                    <span className="w-7 h-7 rounded-full bg-brand-red flex items-center justify-center text-white font-medium text-xs shrink-0 mt-0.5">{i}</span>
                    <span className="text-slate-400 font-normal text-[16px] leading-relaxed max-w-sm">
                      {_t(`community_challenge_${i}`, 'Lack of nearby schools forces children to walk long distances daily.')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-brand-dark p-10 md:p-12 lg:p-14 rounded-[20px] shadow-2xl relative overflow-hidden">
              <h3 className="text-[22px] font-medium text-white mb-10 flex items-center gap-4 relative z-10 tracking-wide">
                <span className="w-[4px] h-6 bg-brand-orange"></span> {_t('community_col2_title', 'The WKMS Solution')}
              </h3>
              <ul className="space-y-8 relative z-10">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex gap-6 items-start">
                    <span className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md shadow-brand-orange/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </span>
                    <span className="text-white/80 font-normal text-[16px] leading-relaxed max-w-sm">
                      <strong className="font-semibold text-white">{_t(`community_solution_${i}_label`, 'Local Access: ')}</strong> {_t(`community_solution_${i}_text`, 'a safe, high quality school in the heart of the village.')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- IMPACT SECTION --- */}
      <section id="impact" className="py-32 px-6 md:px-12 bg-white text-center">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="inline-block border-b-[2px] border-brand-dark pb-0.5 mb-6">
              <span className="text-brand-dark font-bold text-[16px]">{_t('transparency_badge', 'Radical Transparency')}</span>
            </div>
            <h2 className="text-6xl md:text-[85px] font-sans font-black text-brand-dark leading-[1] tracking-tight mb-12">
              {_t('transparency_title', 'Every cent counted')}
            </h2>
            <p className="text-lg md:text-[19px] text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
              {_t('transparency_subtitle', 'Providing quality education to 500+ students in rural Ethiopia. We are the bridge between your generosity and their future.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 font-sans max-w-4xl mx-auto mt-24">
            
            {/* Stat 1: Direct Education */}
            <div className="relative group mx-auto w-64 h-64 flex items-center justify-center -mt-6 rounded-full bg-[#D7F2F1] transition-transform duration-300 hover:scale-105">
              {/* Outer Dashed Ring */}
              <div className="absolute inset-0 rounded-full border-[6px] border-dashed border-[#dcf0ec] pointer-events-none scale-110"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center mt-2">
                <div className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center text-brand-orange mb-3 shadow-sm border border-brand-orange/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                <div className="text-[44px] font-sans font-black text-brand-dark mb-1 leading-none tracking-tight">{_t('transparency_stat_1_val', '60%')}</div>
                <h3 className="text-[14px] font-light font-sans text-brand-dark tracking-wide">{_t('transparency_stat_1_label', 'Direct Education')}</h3>
              </div>
            </div>

            {/* Stat 2: Student Welfare */}
            <div className="relative group mx-auto w-64 h-64 flex items-center justify-center -mt-6 rounded-full bg-[#D7F2F1] transition-transform duration-300 hover:scale-105">
              {/* Outer Dashed Ring */}
              <div className="absolute inset-0 rounded-full border-[6px] border-dashed border-[#dcf0ec] pointer-events-none scale-110"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center mt-2">
                <div className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center text-brand-orange mb-3 shadow-sm border border-brand-orange/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                </div>
                <div className="text-[44px] font-sans font-black text-brand-dark mb-1 leading-none tracking-tight">{_t('transparency_stat_2_val', '30%')}</div>
                <h3 className="text-[14px] font-light font-sans text-brand-dark tracking-wide">{_t('transparency_stat_2_label', 'Student Welfare')}</h3>
              </div>
            </div>

            {/* Stat 3: Ops & Admin */}
            <div className="relative group mx-auto w-64 h-64 flex items-center justify-center -mt-6 rounded-full bg-[#D7F2F1] transition-transform duration-300 hover:scale-105">
              {/* Outer Dashed Ring */}
              <div className="absolute inset-0 rounded-full border-[6px] border-dashed border-[#dcf0ec] pointer-events-none scale-110"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center mt-2">
                <div className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center text-brand-orange mb-3 shadow-sm border border-brand-orange/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                </div>
                <div className="text-[44px] font-sans font-black text-brand-dark mb-1 leading-none tracking-tight">{_t('transparency_stat_3_val', '10%')}</div>
                <h3 className="text-[14px] font-light font-sans text-brand-dark tracking-wide">{_t('transparency_stat_3_label', 'Ops & Admin')}</h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- MEDIA SECTION (IMAGES) --- */}
      <section id="media" className="py-24 md:py-32 bg-brand-dark text-white relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="text-5xl md:text-[75px] font-sans font-black text-white leading-[1] tracking-[-0.02em] mb-16 md:mb-24">
            Stories in pictures
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-800 aspect-[16/10]"></div>
              ))}
            </div>
          ) : (
            <div className="relative w-full overflow-hidden -mx-4 md:-mx-12 py-4">
              {/* Gradient Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-24 md:w-56 bg-gradient-to-r from-brand-dark to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-24 md:w-56 bg-gradient-to-l from-brand-dark to-transparent z-10 pointer-events-none"></div>

              <motion.div
                className="flex gap-6 md:gap-8 w-max"
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
                    className="relative w-[280px] md:w-[480px] aspect-[16/10] overflow-hidden shrink-0 group cursor-pointer"
                  >
                    <img
                      src={item.url}
                      alt={item.title || "Gallery"}
                      className="w-full h-full object-cover transform transition duration-700 group-hover:scale-105"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Dots Navigation Placeholder */}
          <div className="flex justify-center items-center gap-3.5 mt-16 md:mt-20">
            <div className="w-[11px] h-[11px] rounded-full border-[2px] border-white"></div>
            <div className="w-[11px] h-[11px] rounded-full border-[2px] border-white"></div>
            <div className="w-[11px] h-[11px] rounded-full border-[2px] border-white"></div>
            <div className="w-[11px] h-[11px] rounded-full border-[2px] border-white"></div>
            <div className="w-[11px] h-[11px] rounded-full bg-white"></div>
            <div className="w-[11px] h-[11px] rounded-full border-[2px] border-white"></div>
          </div>
        </div>
      </section>

      {/* --- VIDEO GALLERY SECTION --- */}
      <section id="videos" className="py-32 bg-white text-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        {/* Removed heavy blur effect that was causing GPU lagging */}

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="text-brand-dark font-bold tracking-[0.2em] uppercase text-xs">Experience WKMS</span>
            <h2 className="text-4xl md:text-6xl font-lato font-black text-brand-dark tracking-tight">
              Highlights in Motion
            </h2>
          </div>

          {loading ? (
            <div className="max-w-5xl mx-auto aspect-video bg-slate-100 rounded-3xl animate-pulse border border-slate-200"></div>
          ) : videoItems.length > 0 ? (
            <div className="max-w-6xl mx-auto relative group">

              {/* Main Stage */}
              <div className="relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] border border-slate-200">
                <div className="w-full h-full relative">
                  <VideoPlayer
                    src={videoItems[currentVideoIndex].url}
                    poster={videoItems[currentVideoIndex].url ? `${videoItems[currentVideoIndex].url}#t=0.1` : undefined}
                  />
                </div>
              </div>

              {/* Navigation Arrows (Only if > 1 video) */}
              {videoItems.length > 1 && (
                <>
                  <button
                    onClick={prevVideo}
                    className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-14 h-14 bg-white/50 hover:bg-brand-red backdrop-blur-md rounded-full flex items-center justify-center text-brand-dark hover:text-white transition-all duration-300 hover:scale-110 shadow-lg z-20"
                  >
                    <ArrowRight className="w-6 h-6 rotate-180 transition-colors" />
                  </button>
                  <button
                    onClick={nextVideo}
                    className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-14 h-14 bg-white/50 hover:bg-brand-red backdrop-blur-md rounded-full flex items-center justify-center text-brand-dark hover:text-white transition-all duration-300 hover:scale-110 shadow-lg z-20"
                  >
                    <ArrowRight className="w-6 h-6 transition-colors" />
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
                  <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2 font-lato">
                    {videoItems[currentVideoIndex].title || "Untitled Video"}
                  </h3>
                  {videoItems[currentVideoIndex].description && (
                    <p className="text-slate-600 text-lg leading-relaxed">
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
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentVideoIndex ? 'w-8 bg-brand-red' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-24 bg-brand-light/20 rounded-[3rem] border border-brand-light max-w-4xl mx-auto backdrop-blur-sm">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Camera className="w-10 h-10 text-brand-dark" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-2">No videos yet</h3>
              <p className="text-slate-500">We are busy capturing moments. Check back soon!</p>
            </div>
          )}
        </div>
      </section >

      {/* Featured Campaign Section (CTA) */}
      <section className="py-24 px-6 md:px-12 bg-[#f8fafc] relative overflow-hidden flex justify-center items-center">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-brand-dark rounded-[1.5rem] p-12 md:p-20 shadow-2xl text-center relative overflow-hidden">
            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="inline-block border-b border-white pb-1 mb-6">
                <span className="text-white font-medium text-[15px] tracking-wide">Take action</span>
              </div>
              <h2 className="text-5xl md:text-[68px] font-sans font-black text-white leading-[1] tracking-tight mb-8">
                Ready to change a life?
              </h2>
              <p className="text-[17px] text-white/50 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                Providing quality education to 500+ students in rural Ethiopia. We are the bridge between your generosity and their future.
              </p>
              
              <Link href="/pledge" className="inline-flex items-center gap-2.5 bg-brand-red text-white text-[15px] px-8 py-3.5 rounded-md font-medium hover:bg-[#d4151a] shadow-lg transition-colors">
                Make a pledge <Heart className="w-4 h-4 fill-white text-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      < ContactSection />

      {/* Footer */}
      <footer className="bg-white pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row justify-between items-start gap-16">
          <div className="lg:max-w-xs">
            <div className="w-48 md:w-56 mb-6">
              <img
                src={_t('logo_main', '/wkmslogo.svg')}
                alt="WKMS Logo"
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="text-[#6b9c97] text-[13px] font-medium max-w-[250px] leading-relaxed">
              Wakero Keleboro Memorial Primary and middle school. Empowering rural communities in Ethiopia through quality education.
            </p>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-16 lg:gap-24">
            <div>
              <h4 className="font-bold text-brand-dark text-[15px] mb-6">Explore</h4>
              <ul className="space-y-4 text-[13px] font-medium text-[#6b9c97]">
                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-dark transition">About Us</button></li>
                <li><button onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-dark transition">Our Impact</button></li>
                <li><button onClick={() => document.getElementById('media')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-dark transition">Gallery</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-brand-dark text-[15px] mb-6">Connect</h4>
              <div className="flex flex-wrap gap-3">
                {/* Facebook */}
                {_t('social_facebook') && (
                  <a href={_t('social_facebook')} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                )}
                {/* Instagram */}
                {_t('social_instagram') && (
                  <a href={_t('social_instagram')} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                )}
                {/* Youtube */}
                {_t('social_youtube') && (
                  <a href={_t('social_youtube')} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                  </a>
                )}
                {/* TikTok */}
                {_t('social_tiktok') && (
                  <a href={_t('social_tiktok')} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  </a>
                )}
                {/* WhatsApp */}
                {_t('social_whatsapp') && (
                  <a href={_t('social_whatsapp')} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                  </a>
                )}
                {/* Linkedin */}
                {_t('social_linkedin') && (
                  <a href={_t('social_linkedin')} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                )}
                {/* X/Twitter */}
                {_t('social_twitter') && (
                  <a href={_t('social_twitter')} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-brand-dark text-[15px] mb-6">Legal</h4>
              <ul className="space-y-4 text-[13px] font-medium text-[#6b9c97]">
                <li><Link href="/privacy" className="hover:text-brand-dark transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-brand-dark transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main >
  );
}

function VideoPlayer({ src, poster }: { src: string, poster?: string }) {
  if (src && (src.includes('youtube.com') || src.includes('youtu.be'))) {
    const embedSrc = src.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/').split('&')[0];
    const videoId = embedSrc.split('/').pop();
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <iframe
          width="100%"
          height="100%"
          src={`${embedSrc}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover pointer-events-none scale-105"
        ></iframe>
      </div>
    );
  }

  // Use a completely standard video tag without heavy React state or IntersectionObservers
  // to prevent playback lagging on heavy files.
  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <video
        src={src}
        className="w-full h-full object-contain"
        controls
        playsInline
        muted
        loop
        poster={poster}
        preload="metadata"
      />
    </div>
  );
}

