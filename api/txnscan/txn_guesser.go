package txnscan

import (
	"context"
	"encoding/json"
	"fmt"

	"google.golang.org/genai"
)

type TxnGuesser interface {
	GuessTxn(ctx context.Context, text string, categories []string, wallets []string) (GuessOutput, error)
}

type ErrCannotGuessTxn struct {
	Err error
}

func (e ErrCannotGuessTxn) Error() string {
	return fmt.Sprintf("Cannot guess transaction: %v", e.Err)
}

type GuessOutput struct {
	Amount int `json:"amount"`
	Time string `json:"time"`
	Type string `json:"type"`
	Category string `json:"category"`
	Wallet string `json:"wallet"`
}

type GoogleGemini struct {
	gemini *genai.Client
}

func NewGoogleGemini(ctx context.Context) (*GoogleGemini, error) {
	client, err := genai.NewClient(ctx, nil)
	
	if err != nil {
		return nil, err
	}

	return &GoogleGemini{gemini: client}, nil
}

func (g *GoogleGemini) GuessTxn(ctx context.Context, text string, categories []string, wallets []string) (GuessOutput, error) {
	prompt := fmt.Sprintf(googleGeminiTxnGuessPromptTemplate, text, categories, wallets)
	answer, err := g.gemini.Models.GenerateContent(
		ctx,
		"gemini-2.0-flash-lite",
		genai.Text(prompt),
		googleGeminiTxnGuessConfig,
	)

	if err != nil {
		return GuessOutput{}, err
	}

	var guessOutput GuessOutput
	err = json.Unmarshal([]byte(answer.Text()), &guessOutput)

	if err != nil {
		return GuessOutput{}, ErrCannotGuessTxn{Err: err}
  }

	return guessOutput, nil
}

var googleGeminiTxnGuessPromptTemplate = `For personal financial tracking purpose, I want to extract a transaction information from the following text:

START
%s
END

Here are my categories:
%s

And here are my wallets
%s

I need to extract the following information:
- The amount of the transaction, formatted as a positive number
- The time of the transaction, in ISO format, but don't include the time zone.
- The type of transaction, must be exactly either "expense" or "income", default to "expense" if you cannot determine it.
- The category. Note that this field must be exactly one of the categories I listed above, or leave it empty if you are not confident.
- The wallet. Note that this field be exactly one of the wallets I listed above, or leave it empty if you are not confident.
- I only need to extract the first transaction in the text.

Thank you for your help.`

var googleGeminiTxnGuessConfig = &genai.GenerateContentConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"amount": { Type: genai.TypeInteger },
				"type": { Type: genai.TypeString },
				"category": { Type: genai.TypeString },
				"wallet": { Type: genai.TypeString },
				"time": { Type: genai.TypeString },
			},
		},
	}
