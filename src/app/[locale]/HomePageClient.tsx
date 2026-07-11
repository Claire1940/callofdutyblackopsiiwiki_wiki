"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Crosshair,
  Lightbulb,
  ShoppingCart,
  Skull,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  // Kept for page.tsx compatibility; internal article links were removed from the homepage.
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

// Tools Grid navigation cards map 1:1 to the module sections below.
const TOOL_SECTION_IDS = [
  "platforms-and-buying-guide",
  "beginner-guide",
  "zombies-maps-and-easter-eggs",
  "weapons-tier-list",
];

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.callofdutyblackopsiiwiki.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Call of Duty Black Ops II Wiki",
        description:
          "Complete Call of Duty Black Ops II Wiki covering the PS5 and PS4 port, campaign endings, Zombies maps, Easter eggs, weapons, multiplayer, maps, DLC, and guides.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 620,
          caption: "Call of Duty Black Ops II - Branching Near-Future FPS",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Call of Duty Black Ops II Wiki",
        alternateName: "Call of Duty Black Ops II",
        url: siteUrl,
        description:
          "Complete Call of Duty Black Ops II Wiki resource hub for the campaign, Zombies, multiplayer, weapons, maps, DLC, and Easter eggs",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 620,
          caption: "Call of Duty Black Ops II Wiki",
        },
        sameAs: [
          "https://www.reddit.com/r/blackops2/",
          "https://www.youtube.com/@CallofDuty",
          "https://store.steampowered.com/app/202970/Call_of_Duty_Black_Ops_II/",
          "https://www.callofduty.com/",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Call of Duty: Black Ops II",
        gamePlatform: ["PlayStation 4", "PlayStation 5", "PC", "Steam", "Xbox 360"],
        applicationCategory: "Game",
        genre: ["FPS", "Shooter", "Action", "Military"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 18,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/202970/Call_of_Duty_Black_Ops_II/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Official Reveal Trailer | Call of Duty: Black Ops 2",
        description:
          "Official Call of Duty: Black Ops II reveal trailer from the Call of Duty YouTube channel.",
        uploadDate: "2012-05-01",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/x3tedlWs1XY",
        url: "https://www.youtube.com/watch?v=x3tedlWs1XY",
      },
    ],
  };

  // Zombies map accordion state
  const [zombiesExpanded, setZombiesExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const platforms = t.modules.platformsAndBuyingGuide;
  const beginner = t.modules.beginnerGuide;
  const zombies = t.modules.zombiesMapsAndEasterEggs;
  const weapons = t.modules.weaponsTierList;

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("platforms-and-buying-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.playstation.com/en-us/games/call-of-duty-black-ops-ii/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域，官方 Reveal Trailer（IntersectionObserver 自动播放） */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="x3tedlWs1XY"
              title="Official Reveal Trailer | Call of Duty: Black Ops 2"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 4 Navigation Cards（位于视频区之后、模块内容之前） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Platforms and Buying Guide（comparison-table） */}
      <section id="platforms-and-buying-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <ShoppingCart className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {platforms.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {platforms.title}
            </h2>
            <p className="text-base md:text-lg font-medium mb-2">{platforms.subtitle}</p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {platforms.intro}
            </p>
          </div>

          {/* Desktop: comparison table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                  <th className="p-4 font-semibold">Platform</th>
                  <th className="p-4 font-semibold">How to Buy</th>
                  <th className="p-4 font-semibold">Online Requirements</th>
                  <th className="p-4 font-semibold">Included Content</th>
                  <th className="p-4 font-semibold">Important Notes</th>
                </tr>
              </thead>
              <tbody>
                {platforms.items.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-border align-top hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-[hsl(var(--nav-theme-light))]">
                        {item.platform}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.version}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{item.howToBuy}</td>
                    <td className="p-4 text-muted-foreground">{item.onlineRequirements}</td>
                    <td className="p-4 text-muted-foreground">{item.includedContent}</td>
                    <td className="p-4 text-muted-foreground">{item.importantNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked platform cards */}
          <div className="scroll-reveal md:hidden space-y-4">
            {platforms.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                    {item.platform}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {item.version}
                  </span>
                </div>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-semibold mb-0.5">How to Buy</dt>
                    <dd className="text-muted-foreground">{item.howToBuy}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold mb-0.5">Online Requirements</dt>
                    <dd className="text-muted-foreground">{item.onlineRequirements}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold mb-0.5">Included Content</dt>
                    <dd className="text-muted-foreground">{item.includedContent}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold mb-0.5">Important Notes</dt>
                    <dd className="text-muted-foreground">{item.importantNotes}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 2: Beginner Guide（step-by-step） */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {beginner.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {beginner.title}
            </h2>
            <p className="text-base md:text-lg font-medium mb-2">{beginner.subtitle}</p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {beginner.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {beginner.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 md:flex-col md:items-center md:w-14 md:flex-shrink-0">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3">
                    {step.summary}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {step.details.map((detail: string, di: number) => (
                      <li key={di} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <span className="text-sm md:text-base text-muted-foreground">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]">
                    <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{step.quickTip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 模块阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 3: Zombies Maps and Easter Eggs（accordion） */}
      <section
        id="zombies-maps-and-easter-eggs"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Skull className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {zombies.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {zombies.title}
            </h2>
            <p className="text-base md:text-lg font-medium mb-2">{zombies.subtitle}</p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {zombies.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {zombies.maps.map((mapItem: any, index: number) => {
              const isOpen = zombiesExpanded === index;
              return (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/[0.02]"
                >
                  <button
                    onClick={() => setZombiesExpanded(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Skull className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <span className="font-bold text-base md:text-lg">{mapItem.name}</span>
                      <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {mapItem.contentAccess}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 md:px-5 pb-5 pt-1 space-y-4 text-sm md:text-base">
                      <p className="sm:hidden text-xs text-muted-foreground">
                        {mapItem.contentAccess}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Setting: </span>
                        {mapItem.setting}
                      </p>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                          Main Objectives
                        </h4>
                        <ul className="space-y-1.5 ml-6">
                          {mapItem.mainObjectives.map((obj: string, oi: number) => (
                            <li key={oi} className="list-disc text-muted-foreground">
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Pack-a-Punch: </span>
                        {mapItem.packAPunch}
                      </p>
                      {mapItem.wonderWeapons.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-1.5">Wonder Weapons</h4>
                          <div className="flex flex-wrap gap-2">
                            {mapItem.wonderWeapons.map((w: string, wi: number) => (
                              <span
                                key={wi}
                                className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {mapItem.buildables.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-1.5">Buildables</h4>
                          <div className="flex flex-wrap gap-2">
                            {mapItem.buildables.map((b: string, bi: number) => (
                              <span
                                key={bi}
                                className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-border"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Main Quest: </span>
                        {mapItem.mainQuest}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Recommended For: </span>
                        {mapItem.recommendedFor}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Weapons Tier List（tier-grid） */}
      <section
        id="weapons-tier-list"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Crosshair className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {weapons.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {weapons.title}
            </h2>
            <p className="text-base md:text-lg font-medium mb-2">{weapons.subtitle}</p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {weapons.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-8">
            {weapons.tiers.map((tier: any, ti: number) => {
              // Differentiate tiers purely via theme-color opacity (no hardcoded colors).
              const tierStyles = [
                "bg-[hsl(var(--nav-theme)/0.2)] border-[hsl(var(--nav-theme)/0.6)]",
                "bg-[hsl(var(--nav-theme)/0.12)] border-[hsl(var(--nav-theme)/0.45)]",
                "bg-[hsl(var(--nav-theme)/0.08)] border-[hsl(var(--nav-theme)/0.3)]",
              ];
              return (
                <div key={ti}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 ${tierStyles[ti] || tierStyles[2]}`}
                    >
                      <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {tier.tier}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold">{tier.label}</h3>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tier.weapons.map((weapon: any, wi: number) => (
                      <div
                        key={wi}
                        className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h4 className="font-bold">{weapon.name}</h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                            {weapon.class}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-semibold text-foreground">Strengths: </span>
                          {weapon.strengths}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-semibold text-foreground">Weaknesses: </span>
                          {weapon.weaknesses}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border">
                            Range: {weapon.idealRange}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border">
                            {weapon.playstyle}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section（保留模板模块，不删改） */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.reddit.com/r/blackops2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@CallofDuty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/202970/Call_of_Duty_Black_Ops_II/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.playstation.com/en-us/games/call-of-duty-black-ops-ii/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.playstation}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
