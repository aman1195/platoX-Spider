'use client'


import React from 'react'
import Link from 'next/link'
import type { AnalysisResult } from '@/lib/types'
import {
 Star,
 TrendingUp,
 Users,
 Target,
 DollarSign,
 Share2,
 CheckCircle2,
 XCircle,
 ArrowLeft,
 FileChartPie
} from 'lucide-react'


interface ReputationSource {
  sentiment: string;
  score: number;
  rating: number;
}


interface AnalysisDisplayProps {
 analysis: AnalysisResult
}


function clampScore(score: number): number {
  return Math.min(Math.max(score, 0), 10);
}


export function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
 if (!analysis) return null


 // Ensure all required arrays exist with defaults
 const strengths = analysis.strengthsWeaknesses?.strengths || []
 const weaknesses = analysis.strengthsWeaknesses?.weaknesses || []
 const competitors = analysis.competitors || []
 const fundingHistory = analysis.fundingHistory || []
 const expertOpinions = analysis.expertOpinions || []
 const keyQuestions = analysis.keyQuestions || []
 const suggestedImprovements = analysis.suggestedImprovements || []
 const keyInsights = analysis.keyInsights || []
 const otherTerms = analysis.dealStructure?.otherTerms || []


 // Ensure all required objects exist with defaults
 const profile = analysis.profile || {}
 const marketComparison = analysis.marketComparison || { metrics: {} }
 const exitPotential = analysis.exitPotential || { likelihood: 0, potentialValue: 'N/A' }
 const reputationAnalysis = analysis.reputationAnalysis || {
   sources: {
     newsMedia: { sentiment: 'N/A', score: 0, rating: 0 },
     socialMedia: { sentiment: 'N/A', score: 0, rating: 0 },
     investorReviews: { sentiment: 'N/A', score: 0, rating: 0 },
     customerFeedback: { sentiment: 'N/A', score: 0, rating: 0 }
   },
   overall: { sentiment: 'N/A', score: 0, rating: 0 }
 }
 const expertConclusion = analysis.expertConclusion || {
   productViability: 0,
   marketPotential: 0,
   sustainability: 0,
   innovation: 0,
   exitPotential: 0,
   riskFactors: 0,
   competitiveAdvantage: 0
 }
 const dealStructure = analysis.dealStructure || {
   investmentAmount: 'N/A',
   equityStake: 'N/A',
   valuationCap: 'N/A',
   liquidationPreference: 'N/A',
   antiDilution: false,
   boardSeat: false,
   vestingSchedule: 'N/A',
   otherTerms: []
 }
 const finalVerdict = analysis.finalVerdict || {
   summary: 'No verdict available',
   timeline: 'N/A',
   potentialOutcome: 'N/A'
 }


 // Clamp all scores to be between 0 and 10
 const clampedExpertConclusion = {
   ...expertConclusion,
   productViability: clampScore(expertConclusion.productViability),
   marketPotential: clampScore(expertConclusion.marketPotential),
   sustainability: clampScore(expertConclusion.sustainability),
   innovation: clampScore(expertConclusion.innovation),
   exitPotential: clampScore(expertConclusion.exitPotential),
   riskFactors: clampScore(expertConclusion.riskFactors),
   competitiveAdvantage: clampScore(expertConclusion.competitiveAdvantage)
 }

 const clampedExitPotential = {
   ...exitPotential,
   likelihood: clampScore(exitPotential.likelihood)
 }

 // Update the reputationAnalysis scores
 const clampedReputationAnalysis = {
   ...reputationAnalysis,
   sources: {
     newsMedia: { ...reputationAnalysis.sources.newsMedia, score: clampScore(reputationAnalysis.sources.newsMedia.score) },
     socialMedia: { ...reputationAnalysis.sources.socialMedia, score: clampScore(reputationAnalysis.sources.socialMedia.score) },
     investorReviews: { ...reputationAnalysis.sources.investorReviews, score: clampScore(reputationAnalysis.sources.investorReviews.score) },
     customerFeedback: { ...reputationAnalysis.sources.customerFeedback, score: clampScore(reputationAnalysis.sources.customerFeedback.score) }
   },
   overall: { ...reputationAnalysis.overall, score: clampScore(reputationAnalysis.overall.score) }
 }


 return (
   <div id="webcrumbs">
     <div className="w-full max-w-[1200px] mx-auto bg-white font-sans">
       <header className="bg-gradient-to-r from-teal-600 to-emerald-700 py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10 rounded-t-lg shadow-xl">
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
           <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left">AI-Powered Pitch Deck & Investment Analysis</h1>
           <div className="flex space-x-3">
             <Link href="/dashboard" className="bg-white text-teal-700 px-4 py-2 rounded-md transition-all transform hover:scale-105 flex items-center hover:shadow-lg">
               <ArrowLeft className="mr-2 h-5 w-5" />
               <span>Back to Dashboard</span>
             </Link>
           </div>
         </div>
       </header>


       <div className="p-4 sm:p-6 md:p-8 bg-slate-50">
         {/* Company Overview */}
         <div className="flex flex-col sm:flex-row justify-between mb-6 md:mb-8 gap-4">
           <div>
             <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Analysis for: <span className="text-teal-600">{profile.companyName}</span></h2>
             <p className="text-gray-600">{profile.industry} | Last updated: {new Date().toLocaleDateString()}</p>
           </div>
           <div className="flex space-x-3">
             <button className="flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition-colors">
               <Share2 className="mr-2 h-5 w-5" />
               <span>Share Report</span>
             </button>
           </div>
         </div>


         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
           <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
             <div className="flex items-center mb-4">
             <FileChartPie className="text-3xl text-teal-500 mr-3" />
               <h3 className="text-xl font-bold text-teal-800">Pitch Analysis</h3>
             </div>
             <div className="flex justify-between">
               <div>
                 <p className="text-gray-600 mb-1">Clarity Score:</p>
                 <p className="text-2xl font-bold text-teal-600">{clampedExpertConclusion.productViability}/10</p>
               </div>
               <div>
                 <p className="text-gray-600 mb-1">Sentiment:</p>
                 <div className="flex items-center">
                   <span className="text-green-500 font-bold">{clampedReputationAnalysis.overall.sentiment}</span>
                   <TrendingUp className="text-green-500 ml-1 h-4 w-4" />
                 </div>
               </div>
             </div>
             <div className="mt-4 pt-4 border-t border-gray-100">
               <p className="text-gray-700">AI detected <span className="font-semibold">{strengths.length} strengths</span> and <span className="font-semibold">{weaknesses.length} potential issues</span></p>
             </div>
           </div>


           <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
             <div className="flex items-center mb-4">
               <DollarSign className="text-3xl text-teal-500 mr-3" />
               <h3 className="text-xl font-bold">Investment Potential</h3>
             </div>
             <div className="flex justify-between">
               <div>
                 <p className="text-gray-600 mb-1">Score:</p>
                 <p className="text-2xl font-bold text-teal-600">{clampedExpertConclusion.exitPotential}/10</p>
               </div>
               <div>
                 <p className="text-gray-600 mb-1">Exit Potential:</p>
                 <p className="text-lg font-semibold">{clampedExitPotential.potentialValue}</p>
               </div>
             </div>
             <div className="mt-4 pt-4 border-t border-gray-100">
               <p className="text-gray-700">High growth rate with <span className="font-semibold">moderate risk factors</span></p>
             </div>
           </div>


           <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
             <div className="flex items-center mb-4">
               <Target className="text-3xl text-teal-500 mr-3" />
               <h3 className="text-xl font-bold">Market Position</h3>
             </div>
             <div className="flex justify-between">
               <div>
                 <p className="text-gray-600 mb-1">Classification:</p>
                 <p className="text-lg font-bold">{profile.marketPosition}</p>
               </div>
               <div>
                 <p className="text-gray-600 mb-1">Industry:</p>
                 <p className="text-lg">{profile.industry}</p>
               </div>
             </div>
             <div className="mt-4 pt-4 border-t border-gray-100">
               <p className="text-gray-700">Competing with <span className="font-semibold">{competitors.length} established players</span></p>
             </div>
           </div>
         </div>


         {/* Company Overview Table */}
         <div className="mb-6 md:mb-8">
           <div className="bg-white rounded-xl shadow-md overflow-hidden">
             <div className="p-4 sm:p-6 border-b border-gray-100">
               <h3 className="text-lg sm:text-xl font-bold">Company Overview</h3>
             </div>
             <div className="p-4 sm:p-6 overflow-x-auto">
               <table className="w-full">
                 <tbody>
                   <tr className="border-b border-gray-100">
                     <td className="py-3 font-semibold text-gray-700 w-1/5">Company Name</td>
                     <td className="py-3">{profile.companyName}</td>
                     <td className="py-3 font-semibold text-gray-700 w-1/5">Industry</td>
                     <td className="py-3">{profile.industry}</td>
                   </tr>
                   <tr className="border-b border-gray-100">
                     <td className="py-3 font-semibold text-gray-700">Business Model</td>
                     <td className="py-3">{profile.businessModel}</td>
                     <td className="py-3 font-semibold text-gray-700">Key Offerings</td>
                     <td className="py-3">{Array.isArray(profile.keyOfferings) ? profile.keyOfferings.join(', ') : 'N/A'}</td>
                   </tr>
                   <tr>
                     <td className="py-3 font-semibold text-gray-700">Market Position</td>
                     <td className="py-3">{profile.marketPosition}</td>
                     <td className="py-3 font-semibold text-gray-700">Founded</td>
                     <td className="py-3">N/A</td>
                   </tr>
                 </tbody>
               </table>
             </div>
           </div>
         </div>


         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
           <div className="bg-white rounded-xl shadow-md overflow-hidden">
             <div className="p-4 sm:p-6 border-b border-gray-100">
               <h3 className="text-lg sm:text-xl font-bold">Strengths & Weaknesses</h3>
             </div>
             <div className="p-4 sm:p-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                 <div>
                   <h4 className="text-base sm:text-lg font-semibold text-teal-600 flex items-center">
                     <CheckCircle2 className="w-5 h-5 mr-2" />
                     Strengths (Pros)
                   </h4>
                   <ul className="space-y-2 mt-4">
                     {strengths.map((strength, index) => (
                       <li key={index} className="flex items-start">
                         <span className="text-teal-500 mr-2 mt-0.5">•</span>
                         <span>{strength}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div>
                   <h4 className="text-base sm:text-lg font-semibold text-red-600 flex items-center">
                     <XCircle className="w-5 h-5 mr-2" />
                     Weaknesses (Cons)
                   </h4>
                   <ul className="space-y-2 mt-4">
                     {weaknesses.map((weakness, index) => (
                       <li key={index} className="flex items-start">
                         <span className="text-red-500 mr-2 mt-0.5">•</span>
                         <span>{weakness}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
             </div>
           </div>


           <div className="bg-white rounded-xl shadow-md overflow-hidden">
             <div className="p-4 sm:p-6 border-b border-gray-100">
               <h3 className="text-lg sm:text-xl font-bold">Funding History</h3>
             </div>
             <div className="p-4 sm:p-6 overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="border-b border-gray-100">
                     <th className="text-left py-2 font-semibold text-gray-700">Round</th>
                     <th className="text-left py-2 font-semibold text-gray-700">Amount</th>
                     <th className="text-left py-2 font-semibold text-gray-700">Key Investors</th>
                     <th className="text-left py-2 font-semibold text-gray-700">Date</th>
                   </tr>
                 </thead>
                 <tbody>
                   {fundingHistory.map((round, index) => (
                     <tr key={index} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                       <td className="py-3">{round.round}</td>
                       <td className="py-3">{round.amount}</td>
                       <td className="py-3">{Array.isArray(round.investors) ? round.investors.join(', ') : 'N/A'}</td>
                       <td className="py-3">{round.status}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         </div>


         <div className="mb-6 md:mb-8">
           <div className="bg-white rounded-xl shadow-md overflow-hidden">
             <div className="p-4 sm:p-6 border-b border-gray-100">
               <h3 className="text-lg sm:text-xl font-bold">Competitor Comparison</h3>
             </div>
             <div className="p-4 sm:p-6 overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="border-b border-gray-100">
                     <th className="text-left py-2 font-semibold text-gray-700">Competitor</th>
                     <th className="text-left py-2 font-semibold text-gray-700">Key Investors</th>
                     <th className="text-left py-2 font-semibold text-gray-700">Amount Raised</th>
                     <th className="text-left py-2 font-semibold text-gray-700">Market Position</th>
                     <th className="text-left py-2 font-semibold text-gray-700">Strengths</th>
                   </tr>
                 </thead>
                 <tbody>
                   {competitors.map((competitor, index) => (
                     <tr key={index} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                       <td className="py-3 font-semibold">{competitor.name}</td>
                       <td className="py-3">{Array.isArray(competitor.keyInvestors) ? competitor.keyInvestors.join(', ') : 'N/A'}</td>
                       <td className="py-3">{competitor.amountRaised}</td>
                       <td className="py-3">{competitor.marketPosition}</td>
                       <td className="py-3">Enterprise market dominance</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         </div>


         <div className="space-y-6 md:space-y-8">
           {/* Market Comparison */}
           <section className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
             <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Market Comparison</h2>
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                     <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
                     <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitor 1</th>
                     <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitor 2</th>
                     <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitor 3</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {Object.entries(marketComparison.metrics).map(([metric, values], index) => (
                     <tr key={index}>
                       <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatMetricName(metric)}</td>
                       <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">{values.startup}</td>
                       <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">{values.competitor1}</td>
                       <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">{values.competitor2}</td>
                       <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">{values.competitor3}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </section>


           {/* Exit Potential */}
           <section className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
             <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Exit Potential</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               <div className="p-4 bg-gray-50 rounded-lg">
                 <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Exit Likelihood</h3>
                 <div className="flex items-center gap-2">
                   <div className="flex-1 h-2 bg-gray-200 rounded-full">
                     <div
                       className="h-2 rounded-full bg-blue-500"
                       style={{ width: `${clampedExitPotential.likelihood * 10}%` }}
                     />
                   </div>
                   <span className="text-sm font-medium">{clampedExitPotential.likelihood}/10</span>
                 </div>
               </div>
               <div className="p-4 bg-gray-50 rounded-lg">
                 <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Potential Exit Value</h3>
                 <p className="text-xl sm:text-2xl font-bold text-teal-600">{clampedExitPotential.potentialValue}</p>
               </div>
             </div>
           </section>


           {/* Expert Opinions and Reputation Analysis */}
           <section className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
             <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Expert Insights</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 sm:p-6 border-b border-gray-100">
                   <h3 className="text-base sm:text-lg font-bold">Expert Opinions</h3>
                 </div>
                 <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                   {expertOpinions.map((opinion, index) => (
                     <div key={index} className={index !== expertOpinions.length - 1 ? "border-b border-gray-100 pb-4 sm:pb-5" : ""}>
                       <div className="flex items-start">
                         <div className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-teal-100 items-center justify-center flex-shrink-0">
                           <Users className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                         </div>
                         <div className="sm:ml-4">
                           <h4 className="font-semibold">{opinion.name}</h4>
                           <p className="text-sm text-gray-600 mb-2">{opinion.affiliation}</p>
                           <p className="text-sm sm:text-base text-gray-700">{opinion.summary}</p>
                           <div className="mt-2 text-xs sm:text-sm text-gray-500">
                             <span>{opinion.reference}</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>


               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 sm:p-6 border-b border-gray-100">
                   <h3 className="text-base sm:text-lg font-bold">Reputation Analysis</h3>
                 </div>
                 <div className="p-4 sm:p-6 overflow-x-auto">
                   <table className="w-full">
                     <tbody>
                       <tr className="border-b border-gray-100">
                         <td className="py-3 font-semibold text-gray-700">News/Media</td>
                         <td className="py-3 text-teal-600">{clampedReputationAnalysis.sources.newsMedia.sentiment}</td>
                         <td className="py-3">{clampedReputationAnalysis.sources.newsMedia.score}/10</td>
                         <td className="py-3 flex">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <Star
                               key={i}
                               className={`w-4 h-4 ${i < clampedReputationAnalysis.sources.newsMedia.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                             />
                           ))}
                         </td>
                       </tr>
                       <tr className="border-b border-gray-100">
                         <td className="py-3 font-semibold text-gray-700">Social Media</td>
                         <td className="py-3 text-teal-600">{clampedReputationAnalysis.sources.socialMedia.sentiment}</td>
                         <td className="py-3">{clampedReputationAnalysis.sources.socialMedia.score}/10</td>
                         <td className="py-3 flex">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <Star
                               key={i}
                               className={`w-4 h-4 ${i < clampedReputationAnalysis.sources.socialMedia.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                             />
                           ))}
                         </td>
                       </tr>
                       <tr className="border-b border-gray-100">
                         <td className="py-3 font-semibold text-gray-700">Investor Reviews</td>
                         <td className="py-3 text-teal-600">{clampedReputationAnalysis.sources.investorReviews.sentiment}</td>
                         <td className="py-3">{clampedReputationAnalysis.sources.investorReviews.score}/10</td>
                         <td className="py-3 flex">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <Star
                               key={i}
                               className={`w-4 h-4 ${i < clampedReputationAnalysis.sources.investorReviews.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                             />
                           ))}
                         </td>
                       </tr>
                       <tr className="border-b border-gray-100">
                         <td className="py-3 font-semibold text-gray-700">Customer Feedback</td>
                         <td className="py-3 text-amber-600">{clampedReputationAnalysis.sources.customerFeedback.sentiment}</td>
                         <td className="py-3">{clampedReputationAnalysis.sources.customerFeedback.score}/10</td>
                         <td className="py-3 flex">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <Star
                               key={i}
                               className={`w-4 h-4 ${i < clampedReputationAnalysis.sources.customerFeedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                             />
                           ))}
                         </td>
                       </tr>
                       <tr>
                         <td className="py-3 font-bold text-gray-700">Overall</td>
                         <td className="py-3 text-teal-600 font-semibold">{clampedReputationAnalysis.overall.sentiment}</td>
                         <td className="py-3 font-semibold">{clampedReputationAnalysis.overall.score}/10</td>
                         <td className="py-3 flex">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <Star
                               key={i}
                               className={`w-4 h-4 ${i < clampedReputationAnalysis.overall.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                             />
                           ))}
                         </td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>


             {/* Expert Conclusion */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
               {Object.entries(clampedExpertConclusion).map(([parameter, rating], index) => (
                 <div key={index} className="p-4 bg-gray-50 rounded-lg">
                   <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">{formatParameterName(parameter)}</h3>
                   <div className="flex items-center gap-2">
                     <div className="flex-1 h-2 bg-gray-200 rounded-full">
                       <div
                         className="h-2 rounded-full bg-teal-500"
                         style={{ width: `${rating * 10}%` }}
                       />
                     </div>
                     <span className="text-sm font-medium">{rating}/10</span>
                   </div>
                 </div>
               ))}
             </div>
           </section>


           {/* Deal Structure */}
           <section className="bg-white rounded-lg shadow-lg p-6">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">Proposed Deal Structure</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DealTermCard title="Investment Amount" value={dealStructure.investmentAmount} />
               <DealTermCard title="Equity Stake" value={dealStructure.equityStake} />
               <DealTermCard title="Valuation Cap" value={dealStructure.valuationCap} />
               <DealTermCard title="Liquidation Preference" value={dealStructure.liquidationPreference} />
               <DealTermCard title="Anti-Dilution Protection" value={dealStructure.antiDilution ? 'Yes' : 'No'} />
               <DealTermCard title="Board Seat" value={dealStructure.boardSeat ? 'Yes' : 'No'} />
               <DealTermCard title="Vesting Schedule" value={dealStructure.vestingSchedule} />
             </div>
             {otherTerms.length > 0 && (
               <div className="mt-6">
                 <h3 className="text-lg font-semibold text-gray-700 mb-2">Other Terms</h3>
                 <ul className="list-disc list-inside space-y-2">
                   {otherTerms.map((term, index) => (
                     <li key={index} className="text-gray-700">{term}</li>
                   ))}
                 </ul>
               </div>
             )}
           </section>


           {/* Key Questions */}
           <section className="bg-white rounded-lg shadow-lg p-6">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Questions for the Startup</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {keyQuestions.map((item, index) => (
                 <div key={index} className="border rounded-lg p-4">
                   <h3 className="font-medium text-gray-900 mb-2">{item.category}</h3>
                   <p className="text-gray-700">{item.question}</p>
                 </div>
               ))}
             </div>
           </section>


           {/* Final Verdict */}
           <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
             <div className="p-4 sm:p-6 border-b border-gray-100">
               <h3 className="text-xl font-bold">Final Verdict</h3>
             </div>
             <div className="p-4 sm:p-6">
               <div className="bg-teal-50 rounded-lg p-4 sm:p-5 border-l-4 border-teal-500">
                 <h4 className="text-lg font-bold mb-2">{profile.companyName}</h4>
                 <p className="text-gray-800 mb-4 text-sm sm:text-base">{finalVerdict.summary}</p>
                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mt-4 sm:mt-6">
                   <div className="text-center">
                     <p className="text-xs sm:text-sm text-gray-700 mb-1">Product Viability</p>
                     <p className="font-bold text-teal-600 text-lg sm:text-xl">{clampedExpertConclusion.productViability}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-xs sm:text-sm text-gray-700 mb-1">Market Potential</p>
                     <p className="font-bold text-teal-600 text-lg sm:text-xl">{clampedExpertConclusion.marketPotential}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-xs sm:text-sm text-gray-700 mb-1">Sustainability</p>
                     <p className="font-bold text-teal-600 text-lg sm:text-xl">{clampedExpertConclusion.sustainability}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-xs sm:text-sm text-gray-700 mb-1">Innovation</p>
                     <p className="font-bold text-teal-600 text-lg sm:text-xl">{clampedExpertConclusion.innovation}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-xs sm:text-sm text-gray-700 mb-1">Exit Potential</p>
                     <p className="font-bold text-teal-600 text-lg sm:text-xl">{clampedExpertConclusion.exitPotential}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-xs sm:text-sm text-gray-700 mb-1">Risk Factors</p>
                     <p className="font-bold text-amber-600 text-lg sm:text-xl">{clampedExpertConclusion.riskFactors}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-xs sm:text-sm text-gray-700 mb-1">Competitive Edge</p>
                     <p className="font-bold text-teal-600 text-lg sm:text-xl">{clampedExpertConclusion.competitiveAdvantage}</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 )
}


// function CompanyInfoCard({ title, content, icon }: { title: string; content?: string; icon: React.ReactNode }) {
//  return (
//    <div className="border border-gray-100 rounded-lg p-4">
//      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
//        {icon}
//        {title}
//      </h3>
//      <p className="text-gray-700">{content || 'N/A'}</p>
//    </div>
//  )
// }


// function ReputationCard({ source, data, highlight = false }: { source: string; data: ReputationSource; highlight?: boolean }) {
//  return (
//    <div className={`p-4 rounded-lg ${highlight ? 'bg-teal-50 border border-teal-100' : 'bg-gray-50'}`}>
//      <h3 className="text-lg font-semibold text-gray-700 mb-2">{formatSourceName(source)}</h3>
//      <div className="space-y-2">
//        <div>
//          <span className="text-sm text-gray-500">Sentiment:</span>
//          <span className="ml-2 font-medium text-gray-900">{data.sentiment}</span>
//        </div>
//        <div>
//          <span className="text-sm text-gray-500">Score:</span>
//          <span className="ml-2 font-medium text-gray-900">{data.score}/10</span>
//        </div>
//        <div className="flex items-center gap-1">
//          {Array.from({ length: 5 }).map((_, i) => (
//            <Star
//              key={i}
//              className={`w-4 h-4 ${i < data.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
//            />
//          ))}
//        </div>
//      </div>
//    </div>
//  )
// }


function DealTermCard({ title, value }: { title: string; value: string }) {
 return (
   <div className="p-4 bg-gray-50 rounded-lg">
     <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
     <p className="text-lg font-semibold text-gray-900">{value}</p>
   </div>
 )
}


function formatSourceName(source: string): string {
 return source
   .split(/(?=[A-Z])/)
   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
   .join(' ')
}


function formatParameterName(parameter: string): string {
 return parameter
   .split(/(?=[A-Z])/)
   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
   .join(' ')
}


function formatMetricName(metric: string): string {
 return metric
   .split(/(?=[A-Z])/)
   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
   .join(' ')
}

