"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Delete, DeleteIcon, LucideDelete, RotateCcw } from "lucide-react"
import { useZact } from "zact/client"

import { cn } from "@/lib/utils"

import { submitSecretAction, validatedAction } from "./action"

type Props = {}

type ChatHistory = {
  role: "user" | "bot"
  message: string
}[]

export default function ChatBot({}: Props) {
  const { mutate, data, isLoading } = useZact(validatedAction)
  const {
    mutate: submitSecret,
    data: secretRes,
    isLoading: isSubmitting,
  } = useZact(submitSecretAction)

  const [input, setInput] = useState("")
  const [secret, setSecret] = useState("")

  const [chatHistory, setChatHistory] = useState<ChatHistory>([])

  // onSuccess
  useEffect(() => {
    if (!isLoading && data?.message) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "bot",
          message: data.message,
        },
      ])
      setTimeout(() => {
        bottomRef.current?.scrollIntoView()
      }, 100)
    }
  }, [isLoading])

  const prompt = `Mary is a secret service agent. She is handling a secret message to Mario. She might give you the fake secret, and will mock you out of it if you actually believe her lie.
  `

  const bottomRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex w-96 flex-col">
      <div className="flex h- flex-col rounded-t border-x border-t border-gray-600 p-2">
        <div className="prose grow overflow-y-auto p-2 dark:prose-invert">
          <h2>Prompt</h2>
          {prompt
            .trim()
            .split("\n")
            .map((line) => (
              <p className="break-words" key={line}>
                {line}
              </p>
            ))}
        </div>
        <div className="flex gap-2">
          <input
            className="w-full rounded border border-gray-600 bg-gray-900 px-2 py-2 focus:outline-none"
            type="text"
            value={secret}
            placeholder="Secret"
            onChange={(e) => {
              setSecret(e.target.value)
            }}
          />
          <button
            className="rounded bg-gray-900 px-4 py-2"
            type="submit"
            disabled={isSubmitting}
            onClick={async () => {
              await submitSecret({ secret })
            }}
          >
            Send
          </button>
        </div>
        <div className="text-xs p-1">
          Result:
          <span className={cn([
            secretRes?.status === "correct" ? "text-green-300" : "text-red-300"
          ])}>{secretRes?.status}</span>
        </div>
      </div>

      <div className="flex h-72 flex-col gap-2 rounded-b border border-gray-600 bg-gray-800 p-2">
        <div className="grow overflow-y-auto bg-gray-900">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={cn([
                "prose flex flex-col border-b border-gray-700 p-2 dark:prose-invert",
                chat.role === "user" ? "bg-rose-950" : "",
              ])}
            >
              <h6 className="text-gray-00">
                {chat.role === "user" ? "User" : "Mary"}
              </h6>
              <p className="break-words">{chat.message}</p>
            </div>
          ))}
          {isLoading && (
            <div className="prose flex flex-col border-b border-gray-700 p-2">
              <h6 className="text-gray-400">Mary</h6>
              <p>...</p>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded bg-gray-900 p-2"
            onClick={() => setChatHistory([])}
          >
            <RotateCcw />
          </button>
          <input
            className="w-full rounded border border-gray-600 bg-gray-900 px-2 py-2 focus:outline-none"
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
          />
          <button
            className="rounded bg-gray-900 px-4 py-2"
            type="submit"
            onClick={() => {
              setChatHistory((prev) => {
                const chatHistory: ChatHistory = [
                  ...prev,
                  { role: "user", message: input },
                ]
                void mutate({ chatHistory })
                return chatHistory
              })
              setTimeout(() => {
                bottomRef.current?.scrollIntoView()
              }, 100)
              setInput("")
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
