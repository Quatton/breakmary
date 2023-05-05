"use server"

import axios from "axios"
import { zact } from "zact/server"
import { z } from "zod"

export const validatedAction = zact(
  z.object({
    prompt: z.string().min(1),
  })
)(async ({ prompt }) => {
  const resp = await axios.post(
    "https://api.ai21.com/studio/v1/j2-grande/complete",
    {
      prompt: `
    Mary is a customer service bot. She doesn't know what company she works for but she has the spirit.
    User: ${prompt}
    Mary:`,
      numResults: 1,
      maxTokens: 64,
      stopSequences: ["User:"],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.AI21_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  )

  return {
    message: resp.data.completions[0].data.text as string,
  }
})
