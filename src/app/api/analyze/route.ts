import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract"
import * as pdfjsLib from 'pdfjs-dist'
import OpenAI from 'openai'
import type { Database } from '@/lib/types'
import type { AnalysisResult } from '@/lib/types'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Initialize AWS Textract
const textract = new TextractClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

// Configure PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.js')

const SUPPORTED_FILE_TYPES = ['pdf']

// Function to extract text from PDF using PDF.js
async function extractTextFromPDF(pdfData: ArrayBuffer): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({
    data: pdfData,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true
  })
  
  const pdf = await loadingTask.promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
    fullText += pageText + '\n\n'
  }

  return fullText
}

// Function to extract text using AWS Textract
async function extractTextFromTextract(fileBuffer: ArrayBuffer): Promise<string> {
  const command = new AnalyzeDocumentCommand({
    Document: {
      Bytes: new Uint8Array(fileBuffer)
    },
    FeatureTypes: ['FORMS', 'TABLES', 'LAYOUT']
  })

  const response = await textract.send(command)
  return response.Blocks?.map(block => 
    block.BlockType === 'LINE' ? block.Text : ''
  ).filter(Boolean).join('\n') || ''
}

// Function to analyze text using OpenAI
async function analyzeWithOpenAI(text: string): Promise<AnalysisResult> {
  const systemPrompt = `You are an expert AI system for analyzing pitch decks and providing investment analysis. 
  Analyze the following pitch deck content and provide a detailed, structured analysis.
  Be specific, detailed, and realistic in your analysis.
  If certain information is not available in the pitch deck, make reasonable assumptions based on industry standards and market conditions.
  Format all numerical ratings on a scale of 1-10.
  Ensure all dates are in YYYY-MM-DD format.
  For market positions, use terms like "Leader", "Challenger", "Niche Player", or "Emerging".
  For sentiment analysis, use "Positive", "Negative", or "Neutral".`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text }
    ],
    functions: [
      {
        name: "analyze_pitch_deck",
        parameters: {
          type: "object",
          properties: {
            profile: {
              type: "object",
              properties: {
                companyName: { type: "string" },
                industry: { type: "string" },
                problemStatement: { type: "string" },
                solution: { type: "string" },
                marketSize: { type: "string" },
                businessModel: { type: "string" },
                competitiveAdvantage: { type: "string" },
                teamHighlights: { type: "string" },
                keyOfferings: { type: "array", items: { type: "string" } },
                marketPosition: { type: "string" },
                financials: {
                  type: "object",
                  properties: {
                    revenue: { type: "string" },
                    funding: { type: "string" },
                    projections: { type: "string" }
                  }
                }
              },
              required: ["companyName", "industry", "businessModel", "marketPosition"]
            },
            strengthsWeaknesses: {
              type: "object",
              properties: {
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } }
              },
              required: ["strengths", "weaknesses"]
            },
            competitors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  keyInvestors: { type: "array", items: { type: "string" } },
                  amountRaised: { type: "string" },
                  marketPosition: { type: "string" }
                }
              }
            },
            fundingHistory: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  round: { type: "string" },
                  amount: { type: "string" },
                  investors: { type: "array", items: { type: "string" } },
                  status: { type: "string" }
                }
              }
            },
            marketComparison: {
              type: "object",
              properties: {
                metrics: {
                  type: "object",
                  properties: {
                    marketShare: {
                      type: "object",
                      properties: {
                        startup: { type: "string" },
                        competitor1: { type: "string" },
                        competitor2: { type: "string" },
                        competitor3: { type: "string" }
                      }
                    },
                    revenueModel: {
                      type: "object",
                      properties: {
                        startup: { type: "string" },
                        competitor1: { type: "string" },
                        competitor2: { type: "string" },
                        competitor3: { type: "string" }
                      }
                    },
                    growthRate: {
                      type: "object",
                      properties: {
                        startup: { type: "string" },
                        competitor1: { type: "string" },
                        competitor2: { type: "string" },
                        competitor3: { type: "string" }
                      }
                    },
                    differentiator: {
                      type: "object",
                      properties: {
                        startup: { type: "string" },
                        competitor1: { type: "string" },
                        competitor2: { type: "string" },
                        competitor3: { type: "string" }
                      }
                    }
                  }
                }
              }
            },
            exitPotential: {
              type: "object",
              properties: {
                likelihood: { type: "number" },
                potentialValue: { type: "string" }
              }
            },
            expertOpinions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  affiliation: { type: "string" },
                  summary: { type: "string" },
                  reference: { type: "string" },
                  date: { type: "string" }
                }
              }
            },
            reputationAnalysis: {
              type: "object",
              properties: {
                sources: {
                  type: "object",
                  properties: {
                    newsMedia: {
                      type: "object",
                      properties: {
                        sentiment: { type: "string" },
                        score: { type: "number" },
                        rating: { type: "number" }
                      }
                    },
                    socialMedia: {
                      type: "object",
                      properties: {
                        sentiment: { type: "string" },
                        score: { type: "number" },
                        rating: { type: "number" }
                      }
                    },
                    investorReviews: {
                      type: "object",
                      properties: {
                        sentiment: { type: "string" },
                        score: { type: "number" },
                        rating: { type: "number" }
                      }
                    },
                    customerFeedback: {
                      type: "object",
                      properties: {
                        sentiment: { type: "string" },
                        score: { type: "number" },
                        rating: { type: "number" }
                      }
                    }
                  }
                },
                overall: {
                  type: "object",
                  properties: {
                    sentiment: { type: "string" },
                    score: { type: "number" },
                    rating: { type: "number" }
                  }
                }
              }
            },
            expertConclusion: {
              type: "object",
              properties: {
                productViability: { type: "number" },
                marketPotential: { type: "number" },
                sustainability: { type: "number" },
                innovation: { type: "number" },
                exitPotential: { type: "number" },
                riskFactors: { type: "number" },
                competitiveAdvantage: { type: "number" }
              }
            },
            dealStructure: {
              type: "object",
              properties: {
                investmentAmount: { type: "string" },
                equityStake: { type: "string" },
                valuationCap: { type: "string" },
                liquidationPreference: { type: "string" },
                antiDilution: { type: "boolean" },
                boardSeat: { type: "boolean" },
                vestingSchedule: { type: "string" },
                otherTerms: { type: "array", items: { type: "string" } }
              }
            },
            keyQuestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  question: { type: "string" }
                }
              }
            },
            finalVerdict: {
              type: "object",
              properties: {
                summary: { type: "string" },
                timeline: { type: "string" },
                potentialOutcome: { type: "string" }
              }
            },
            confidence: { type: "number" },
            suggestedImprovements: { type: "array", items: { type: "string" } },
            keyInsights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  area: { type: "string" },
                  observation: { type: "string" },
                  recommendation: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] }
                }
              }
            }
          },
          required: [
            "profile",
            "strengthsWeaknesses",
            "competitors",
            "marketComparison",
            "exitPotential",
            "expertConclusion",
            "dealStructure",
            "keyQuestions",
            "finalVerdict"
          ]
        }
      }
    ],
    function_call: { name: "analyze_pitch_deck" }
  })

  const result = JSON.parse(completion.choices[0].message.function_call?.arguments || '{}')
  
  // Ensure all arrays have default values
  const validatedResult = {
    ...result,
    profile: {
      ...result.profile,
      keyOfferings: result.profile?.keyOfferings || []
    },
    strengthsWeaknesses: {
      ...result.strengthsWeaknesses,
      strengths: result.strengthsWeaknesses?.strengths || [],
      weaknesses: result.strengthsWeaknesses?.weaknesses || []
    },
    competitors: result.competitors || [],
    fundingHistory: result.fundingHistory || [],
    expertOpinions: result.expertOpinions || [],
    suggestedImprovements: result.suggestedImprovements || [],
    keyInsights: result.keyInsights || [],
    keyQuestions: result.keyQuestions || [],
    dealStructure: {
      ...result.dealStructure,
      otherTerms: result.dealStructure?.otherTerms || []
    }
  }

  return validatedResult as AnalysisResult
}

export const maxDuration = 60 // Set max duration to 60 seconds
export const dynamic = 'force-dynamic' // Disable static optimization

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
  let deckId: string | undefined

  try {
    // Add timeout to the entire operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timed out')), 58000) // 58s timeout to ensure we're within Vercel's limit
    })

    const analysisPromise = (async () => {
      // Check Content-Type and parse request accordingly
      const contentType = request.headers.get('content-type')
      let requestData: { deckId?: string; useTextract?: boolean }

      try {
        if (contentType?.includes('multipart/form-data')) {
          const formData = await request.formData()
          requestData = {
            deckId: formData.get('deckId')?.toString(),
            useTextract: formData.get('useTextract') === 'true'
          }
        } else if (contentType?.includes('application/json')) {
          requestData = await request.json()
        } else {
          return NextResponse.json(
            { error: 'Content-Type must be either multipart/form-data or application/json' },
            { status: 400 }
          )
        }

        deckId = requestData.deckId

        if (!deckId) {
          return NextResponse.json(
            { error: 'Deck ID is required' },
            { status: 400 }
          )
        }

        // Get the user's session
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        if (authError || !session) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }

        // Update status to processing immediately
        await supabase
          .from('pitch_decks')
          .update({ status: 'processing' })
          .eq('id', deckId)

        // Get the pitch deck
        const { data: deck, error: deckError } = await supabase
          .from('pitch_decks')
          .select('*')
          .eq('id', deckId)
          .eq('user_id', session.user.id)
          .single()

        if (deckError || !deck) {
          throw new Error('Pitch deck not found')
        }

        // Download and process the file
        const { data: fileData, error: fileError } = await supabase.storage
          .from('pitch-decks')
          .download(deck.file_url)

        if (fileError || !fileData) {
          throw new Error('Failed to download file')
        }

        const fileBuffer = await fileData.arrayBuffer()
        const extractedText = requestData.useTextract 
          ? await extractTextFromTextract(fileBuffer)
          : await extractTextFromPDF(fileBuffer)

        if (!extractedText.trim()) {
          throw new Error('No text could be extracted from the document')
        }

        // Analyze the extracted text
        const analysisReport = await analyzeWithOpenAI(extractedText)

        // Create analysis report
        const { error: reportError } = await supabase
          .from('analysis_reports')
          .insert({
            pitch_deck_id: deckId,
            content: analysisReport,
          })

        if (reportError) {
          throw new Error('Failed to create analysis report')
        }

        // Update status to completed
        await supabase
          .from('pitch_decks')
          .update({ status: 'completed' })
          .eq('id', deckId)

        return NextResponse.json({ success: true })
      } catch (error) {
        // Ensure any error is properly formatted
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
        
        // Update status to failed
        if (deckId) {
          await supabase
            .from('pitch_decks')
            .update({ status: 'failed' })
            .eq('id', deckId)
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 })
      }
    })()

    // Race between timeout and analysis
    return await Promise.race([analysisPromise, timeoutPromise])
  } catch (error) {
    // Handle timeout and other unexpected errors
    if (deckId) {
      await supabase
        .from('pitch_decks')
        .update({ status: 'failed' })
        .eq('id', deckId)
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis timed out or failed unexpectedly' },
      { status: 504 }
    )
  }
} 