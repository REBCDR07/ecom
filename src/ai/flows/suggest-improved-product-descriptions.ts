'use server';

/**
 * @fileOverview An AI agent that suggests improvements and expansions to product descriptions.
 *
 * - suggestImprovedProductDescription - A function that handles the product description improvement process.
 * - SuggestImprovedProductDescriptionInput - The input type for the suggestImprovedProductDescription function.
 * - SuggestImprovedProductDescriptionOutput - The return type for the suggestImprovedProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImprovedProductDescriptionInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The current product description that needs improvement.'),
});
export type SuggestImprovedProductDescriptionInput = z.infer<
  typeof SuggestImprovedProductDescriptionInputSchema
>;

const SuggestImprovedProductDescriptionOutputSchema = z.object({
  improvedDescription: z
    .string()
    .describe('The improved and expanded product description.'),
});
export type SuggestImprovedProductDescriptionOutput = z.infer<
  typeof SuggestImprovedProductDescriptionOutputSchema
>;

export async function suggestImprovedProductDescription(
  input: SuggestImprovedProductDescriptionInput
): Promise<SuggestImprovedProductDescriptionOutput> {
  return suggestImprovedProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImprovedProductDescriptionPrompt',
  input: {schema: SuggestImprovedProductDescriptionInputSchema},
  output: {schema: SuggestImprovedProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in e-commerce product descriptions.

  Your goal is to improve the provided product description to make it more engaging and persuasive, ultimately leading to increased sales.
  Expand upon the existing description, highlighting key features and benefits in a way that resonates with potential customers.
  Use persuasive language and address potential customer needs and desires.

  Original Description: {{{productDescription}}}

  Improved Description:`, // Keep it simple, model will complete from here
});

const suggestImprovedProductDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestImprovedProductDescriptionFlow',
    inputSchema: SuggestImprovedProductDescriptionInputSchema,
    outputSchema: SuggestImprovedProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
