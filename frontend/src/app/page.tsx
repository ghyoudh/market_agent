"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Download, Globe, CheckCircle2, Loader2, Target, Users, CreditCard, AlertCircle, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Competitor {
  name: string;
  market_share: string;
  description: string;
}

interface MarketReport {
  competitor_landscape: Competitor[];
  value_proposition: { hook: string };
  pricing_strategy: { type: string; details: string };
  customer_pain_points: string[];
  the_gap: string;
}

export default function MarketDashboard() {
  const { t, language, setLanguage } = useLanguage();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "searching" | "scraping" | "synthesizing" | "done">("idle");
  const [report, setReport] = useState<MarketReport | null>(null);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const simulateMarketAnalysis = async () => {
    if (!query) return;
    setLoading(true);
    setReport(null);
    
    // Simulate iterative research steps
    setStep("searching");
    await new Promise(r => setTimeout(r, 2000));
    
    setStep("scraping");
    await new Promise(r => setTimeout(r, 2500));
    
    setStep("synthesizing");
    await new Promise(r => setTimeout(r, 2000));
    
    // In a real app, this would be an API call to our backend
    const mockReport = {
      competitor_landscape: [
        { name: "Market Leader X", market_share: "45%", description: "Established player with high pricing." },
        { name: "Innovator Y", market_share: "20%", description: "Fast-growing challenger using AI-first approach." },
        { name: "Budget Option Z", market_share: "15%", description: "Low-cost alternative with basic features." }
      ],
      value_proposition: { hook: "Efficiency through automation" },
      pricing_strategy: { type: "Subscription", details: "Average $49/mo per user" },
      customer_pain_points: [
          "Complex onboard process",
          "Lack of mobile support",
          "Expensive enterprise tiers"
      ],
      the_gap: "There is no mobile-first solution for mid-market teams."
    };
    
    setReport(mockReport);
    setStep("done");
    setLoading(false);
  };

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `market_report_${query.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
            M
          </div>
          <h1 className="text-xl font-bold tracking-tight">{t.title}</h1>
        </div>
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all font-medium text-sm shadow-sm"
        >
          <Globe className="w-4 h-4" />
          {t.language}
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400"
          >
            {t.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 text-lg"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="relative flex items-center p-2 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-800">
            <Search className="w-6 h-6 ml-4 text-slate-400" />
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-lg"
              onKeyDown={(e) => e.key === "Enter" && simulateMarketAnalysis()}
            />
            <button 
              onClick={simulateMarketAnalysis}
              disabled={loading || !query}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.analyze}
            </button>
          </div>
          
          {/* Progress Indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 space-y-4"
              >
                <div className="flex justify-between items-center p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                  <div className="flex items-center gap-3">
                    {step === "searching" ? <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    <span className={step === "searching" ? "font-bold text-indigo-600" : "text-slate-400 line-through"}>{t.searching}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {step === "scraping" ? <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" /> : step === "searching" ? <div className="w-5 h-5 rounded-full border-2 border-slate-200" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    <span className={step === "scraping" ? "font-bold text-indigo-600" : (step === "searching" ? "text-slate-400" : "text-slate-400 line-through")}>{t.scraping}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {step === "synthesizing" ? <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" /> : (step === "searching" || step === "scraping") ? <div className="w-5 h-5 rounded-full border-2 border-slate-200" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    <span className={step === "synthesizing" ? "font-bold text-indigo-600" : (step === "done" ? "text-slate-400 line-through" : "text-slate-400")}>{t.synthesizing}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Report Dashboard */}
        <AnimatePresence>
          {report && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-3xl font-bold mb-2">{t.reportTitle}</h3>
                  <p className="text-slate-500">Analysis for: &quot;{query}&quot;</p>
                </div>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 transition-all font-bold shadow-sm"
                >
                  <Download className="w-5 h-5" />
                  {t.download}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Competitors */}
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex flex-col h-full hover:border-indigo-500/50 transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                      <Target className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold">{t.competitors}</h4>
                  </div>
                  <div className="space-y-4 flex-1">
                    {report.competitor_landscape.map((comp: Competitor, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-lg">{comp.name}</span>
                          <span className="text-xs font-black uppercase tracking-wider px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 rounded">{comp.market_share}</span>
                        </div>
                        <p className="text-sm text-slate-500">{comp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategy Cards */}
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="w-6 h-6" />
                      <h4 className="text-lg font-bold">{t.valueProp}</h4>
                    </div>
                    <p className="text-indigo-100">{report.value_proposition.hook}</p>
                  </div>
                  
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100/50">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-6 h-6 text-emerald-500" />
                      <h4 className="text-lg font-bold">{t.pricing}</h4>
                    </div>
                    <p className="font-medium">{report.pricing_strategy.type}</p>
                    <p className="text-slate-500 text-sm">{report.pricing_strategy.details}</p>
                  </div>
                </div>

                {/* Pain Points */}
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <h4 className="text-xl font-bold">{t.painPoints}</h4>
                  </div>
                  <ul className="space-y-3">
                    {report.customer_pain_points.map((pt: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The Gap */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Target className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="w-6 h-6 text-indigo-400" />
                      <h4 className="text-xl font-bold text-indigo-200">{t.gap}</h4>
                    </div>
                    <p className="text-lg font-medium leading-relaxed">
                      {report.the_gap}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-24 p-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm">
        &copy; 2026 Market Intelligence Agent. Fact-First, Structured, Professional.
      </footer>
    </div>
  );
}
