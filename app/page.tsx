import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

import ChatBot from "./chatbot"

export default function IndexPage() {
  return (
    <section className="container grid place-items-center gap-6 pb-8 pt-6 md:py-10">
      <ChatBot />
    </section>
  )
}
