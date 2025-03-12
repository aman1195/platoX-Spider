export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          updated_at?: string
        }
      }
      pitch_decks: {
        Row: {
          id: string
          user_id: string
          title: string
          file_url: string
          status: 'pending' | 'processing' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_url: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          updated_at?: string
        }
      }
      analysis_reports: {
        Row: {
          id: string
          pitch_deck_id: string
          content: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pitch_deck_id: string
          content: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: any
          updated_at?: string
        }
      }
    }
  }
}

export interface CompanyProfile {
  companyName: string;
  industry: string;
  problemStatement: string;
  solution: string;
  marketSize: string;
  businessModel: string;
  competitiveAdvantage: string;
  teamHighlights: string;
  keyOfferings: string[];
  marketPosition: string;
  financials: {
    revenue: string;
    funding: string;
    projections: string;
  };
}

export interface StrengthsWeaknesses {
  strengths: string[];
  weaknesses: string[];
}

export interface Competitor {
  name: string;
  keyInvestors: string[];
  amountRaised: string;
  marketPosition: string;
  strengths: string[];
  weaknesses: string[];
}

export interface FundingRound {
  round: string;
  amount: string;
  investors: string[];
  status: string;
}

export interface MarketMetric {
  startup: string;
  competitor1: string;
  competitor2: string;
  competitor3: string;
}

export interface MarketComparison {
  metrics: {
    marketShare: MarketMetric;
    revenueModel: MarketMetric;
    growthRate: MarketMetric;
    differentiator: MarketMetric;
  };
}

export interface ExitPotential {
  likelihood: number;
  potentialValue: string;
}

export interface ExpertOpinion {
  name: string;
  affiliation: string;
  summary: string;
  reference: string;
  date: string;
}

export interface ReputationSource {
  sentiment: string;
  score: number;
  rating: number;
}

export interface ReputationAnalysis {
  sources: {
    newsMedia: ReputationSource;
    socialMedia: ReputationSource;
    investorReviews: ReputationSource;
    customerFeedback: ReputationSource;
  };
  overall: ReputationSource;
}

export interface ExpertConclusion {
  productViability: number;
  marketPotential: number;
  sustainability: number;
  innovation: number;
  exitPotential: number;
  riskFactors: number;
  competitiveAdvantage: number;
}

export interface DealStructure {
  investmentAmount: string;
  equityStake: string;
  valuationCap: string;
  liquidationPreference: string;
  antiDilution: boolean;
  boardSeat: boolean;
  vestingSchedule: string;
  otherTerms: string[];
}

export interface KeyQuestion {
  category: string;
  question: string;
}

export interface FinalVerdict {
  summary: string;
  timeline: string;
  potentialOutcome: string;
}

export interface KeyInsight {
  area: string;
  observation: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  profile: CompanyProfile;
  strengthsWeaknesses: StrengthsWeaknesses;
  competitors: Competitor[];
  fundingHistory: FundingRound[];
  marketComparison: MarketComparison;
  exitPotential: ExitPotential;
  expertOpinions: ExpertOpinion[];
  reputationAnalysis: ReputationAnalysis;
  expertConclusion: ExpertConclusion;
  dealStructure: DealStructure;
  keyQuestions: KeyQuestion[];
  finalVerdict: FinalVerdict;
  confidence: number;
  suggestedImprovements: string[];
  keyInsights: KeyInsight[];
} 