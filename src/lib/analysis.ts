import OpenAI from 'openai'
import { supabase } from './supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzePitchDeck(deckId: string) {
  try {
    // Update status to processing
    await supabase
      .from('pitch_decks')
      .update({ status: 'processing' })
      .eq('id', deckId)

    // Get pitch deck data
    const { data: deck, error: deckError } = await supabase
      .from('pitch_decks')
      .select('*')
      .eq('id', deckId)
      .single()

    if (deckError || !deck) throw deckError

    // Download the file
    const { data: fileData, error: fileError } = await supabase.storage
      .from('pitch-decks')
      .download(deck.file_url)

    if (fileError || !fileData) throw fileError

    // Convert file to base64
    const base64File = await fileData.text()

    // Analyze the pitch deck using OpenAI Vision
    const analysis = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this pitch deck and provide a comprehensive investment report including:\n1. Company Overview\n2. Market Analysis\n3. Product/Service Evaluation\n4. Team Assessment\n5. Financial Analysis\n6. Risk Assessment\n7. Investment Recommendation\n8. Competitive Analysis\n9. Growth Potential\n10. Expert Rating (1-10) with justification"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64File}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4096,
    })

    // Create analysis report
    const { error: reportError } = await supabase
      .from('analysis_reports')
      .insert({
        pitch_deck_id: deckId,
        content: analysis.choices[0].message.content,
      })

    if (reportError) throw reportError

    // Update pitch deck status to completed
    await supabase
      .from('pitch_decks')
      .update({ status: 'completed' })
      .eq('id', deckId)

  } catch (error) {
    console.error('Error analyzing pitch deck:', error)
    
    // Update status to failed
    await supabase
      .from('pitch_decks')
      .update({ status: 'failed' })
      .eq('id', deckId)
      
    throw error
  }
} 