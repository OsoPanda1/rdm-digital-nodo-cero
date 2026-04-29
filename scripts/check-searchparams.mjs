#!/usr/bin/env node
import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const roots = ["app", "src"].filter((dir) => fs.existsSync(dir))
if (roots.length === 0) {
  console.log("No app/ or src/ directory found.")
  process.exit(0)
}

const results = []
for (const root of roots) {
  const out = execSync(`rg --no-heading --line-number \"useSearchParams\" ${root}`, { encoding: "utf8" }).trim()
  if (!out) continue
  for (const line of out.split("\n")) {
    const [file, lineNumber] = line.split(":")
    const content = fs.readFileSync(file, "utf8")
    const firstLines = content.split("\n").slice(0, 5).join("\n")
    const isClient = /['\"]use client['\"]/.test(firstLines)
    const isPage = /\/(page|layout)\.(t|j)sx?$/.test(file)

    let recommendation = "Ensure this component is rendered under a <Suspense> boundary."
    if (isPage && !isClient) {
      recommendation = "Server page/layout uses useSearchParams: migrate to searchParams prop or extract to a client child wrapped in <Suspense>."
    } else if (isPage && isClient) {
      recommendation = "Client page uses useSearchParams: prefer extracting hook usage to a client child and keep page as server component."
    }

    results.push({ file, lineNumber, isClient, isPage, recommendation })
  }
}

if (results.length === 0) {
  console.log("✅ No useSearchParams usages found.")
  process.exit(0)
}

console.log("useSearchParams audit report:\n")
for (const item of results) {
  console.log(`- ${item.file}:${item.lineNumber}`)
  console.log(`  client-component: ${item.isClient ? "yes" : "no"}`)
  console.log(`  app-router page/layout: ${item.isPage ? "yes" : "no"}`)
  console.log(`  recommendation: ${item.recommendation}\n`)
}
