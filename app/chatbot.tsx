"use client"

import { useState } from "react"
import { useZact } from "zact/client"

import { validatedAction } from "./action"

type Props = {}

export default function ChatBot({}: Props) {
  const { mutate, data, isLoading } = useZact(validatedAction)

  const [input, setInput] = useState("")

  return (
    <div className="h-96 w-96">
      <div className="h-48 rounded-t border-x border-t border-zinc-600 p-4 dark:bg-rose-950">
        <h2>Input</h2>
        <input
          className="w-full rounded border bg-zinc-800 px-4 py-2"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="w-full" onClick={() => mutate({ prompt: input })}>
          Send
        </button>
      </div>
      <div className="h-48 rounded-b border border-zinc-600 bg-zinc-800 p-4">
        <h2>Output</h2>
        {isLoading && <div>Loading...</div>}
        {data?.message}
      </div>
    </div>
  )
}
