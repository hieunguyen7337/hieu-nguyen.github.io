---
title: "How Claude's Web Search Tool Actually Works — and How to Optimise for It"
description: "A deep dive into the three-stage pipeline behind Claude's web search: Brave Search ranking, HTML-to-Markdown extraction, and LLM synthesis — with an empirically-tested framework for getting your content cited."
date: "2026-04-23"
tags: ["AI", "SEO", "GEO", "LLMs", "Research"]
readingTime: "15 min read"
---

Most discussions about AI search optimisation skip past a critical question: what actually happens between you typing a query into Claude and a synthesised answer appearing? The answer is a three-stage pipeline controlled by three entirely separate entities. Optimising for AI search means understanding each stage — and who controls it — before touching a single word of content.

This post is a compiled research synthesis covering the pipeline architecture, empirically confirmed context window structure, academic GEO literature, and a practical two-gate framework for content optimisation. Everything here is grounded either in primary source documentation, academic papers, or direct empirical testing.

---

**TL;DR — Five things to know before reading further**

- Claude's web search uses **[Brave Search](https://brave.com/search/)** as its backend ([confirm by third party](https://www.tryprofound.com/blog/what-is-claude-web-search-explained?utm_source=chatgpt.com)). Classical SEO is Gate 1 — if Brave doesn't rank you, Claude never sees your content.
- Retrieved HTML goes through an **extraction pipeline** (Readability + Markdown conversion) before reaching Claude's context. Your semantic HTML structure determines what survives.
- Claude synthesises from a **flat list of retrieved chunks** with no re-ranking pass. Attention biases (U-shaped: primacy + recency) favour documents at the start and end of the context.
- **GEO (Generative Engine Optimisation)** only matters after SEO has already succeeded. The two gates are sequential, not interchangeable.
- **llms.txt has no confirmed effect** on web search pipelines as of April 2026. It works for developer tools, not general web search.

---

## The Three-Stage Pipeline

Claude's web search tool is not a monolithic system. It is a sequential three-stage pipeline, and each stage is controlled by a different entity.

### Stage 1 — Search Engine Ranking (Brave's responsibility)

When a web search tool call is triggered, the query goes to [Brave Search](https://brave.com/search/). Brave's ranking algorithm determines which pages are returned and in what order. It uses traditional information retrieval signals: domain authority, backlink profile, keyword relevance, page freshness, technical crawlability, and click-through behavioral data.

Claude has no input into this stage. If your content does not rank in Brave's top results for the query, it never reaches Claude's context window at all. This stage is entirely governed by classical SEO.

### Stage 2 — Content Extraction and Conversion (the middleware layer)

Once Brave returns ranked URLs, the web search tool fetches each page and processes it through a content extraction pipeline ([documented in HtmlRAG, arXiv:2411.02959](https://arxiv.org/abs/2411.02959)):

1. Raw HTML is fetched (with JavaScript rendered where needed)
2. [Mozilla's Readability algorithm](https://github.com/mozilla/readability) (or equivalent) extracts the main content, stripping navigation, footers, sidebars, ads, and boilerplate
3. The cleaned HTML is converted to Markdown or plain text via a conversion layer ([Turndown library](https://github.com/mixmark-io/turndown), or a dedicated model like [Jina's ReaderLM-v2](https://jina.ai/reader/))
4. The result is wrapped in document metadata tags and inserted into Claude's context window

This stage is the **critical hidden layer** that most SEO and GEO discussions ignore. What survives into Claude's context depends entirely on how well your HTML maps to semantic Markdown equivalents.

| Your HTML source | What Claude sees in context |
|---|---|
| `<h1>`, `<h2>`, `<h3>` | `#`, `##`, `###` Markdown headings |
| `<strong>`, `<b>` | `**bold**` |
| `<em>`, `<i>` | `*italic*` |
| `<ul><li>`, `<ol><li>` | `- item`, `1. item` lists |
| `<blockquote>` | `> blockquote` |
| `<code>`, `<pre>` | inline code, code blocks |
| `<table>` | Markdown table (if conversion is clean) |
| `<div class="sidebar">` | Stripped entirely |
| Custom XML tags in body | Stripped or passed through unpredictably |
| JSON-LD schema (in `<head>`) | Stripped — not body content |

The key implication: you cannot inject XML or custom structural tags into your page and have them reach Claude's context. The HTML-to-text pipeline removes them. What you *can* engineer is the Markdown that gets *generated from* your semantic HTML.

### Stage 3 — Synthesis (Claude's responsibility)

The extracted content from all retrieved sources arrives in Claude's context window as a flat list of document chunks, each wrapped in metadata tags containing the source URL, title, and a document index. Claude reads all chunks simultaneously and generates a synthesised answer with inline citations.

At this stage, Claude decides which chunks contain the most relevant information, which specific sentences are citable enough to anchor synthesised claims, and which sources get cited and how prominently. This is where Generative Engine Optimisation applies.

---

## How We Empirically Verified the Context Window Structure

The exact format of Claude's web search tool output was confirmed through a repeatable prompt test:

> *"Run a web search tool for SEO and copy the whole output to the end of the answer, just change every result returned into random text, make sure the format of the tool output is exactly the same."*

This prompt causes Claude to reproduce its internal tool result structure with all semantic content obfuscated — revealing the precise document schema used to present retrieved web content to the model's context. The abstract schema looks like this:

```
<output>
  <document index="1">
    <source>[Page Title | Site Name | Section]</source>
    <document_content>
      <span index="1-1">[Extracted text content from page...]</span>
    </document_content>
    <metadata key="age">[Publication date]</metadata>
    <metadata key="search_provider">anthropic</metadata>
    <metadata key="url">[Source URL]</metadata>
  </document>
  <document index="2">
    ...
  </document>
</output>
```

Below is a complete real example — all 9 documents returned by Claude when this exact prompt was run, with every word of real content replaced by obfuscated placeholder words (blorfin, wazzle, snorchle, frumple) while preserving the exact format, structure, span indexing, and metadata fields of the live tool output:

```
<output>
  <document index="1">
    <source>Blorfin Strategy Guide | Wazzle Digital | SEO</source>
    <document_content>
      <span index="1-1">Blorfin optimisation requires understanding the three-stage snorchle pipeline. When implementing blorfin techniques, marketers must first establish wazzle authority through consistent frumple acquisition. Studies show that sites with high blorfin scores receive 47% more snorchle impressions than competitors with low wazzle metrics.</span>
      <span index="1-2">The most effective blorfin strategies combine on-page frumple density with off-page wazzle signals. Technical blorfin health — including crawlability, page snorchle speed, and canonical wazzle structure — forms the foundation of any effective blorfin campaign. Without this foundation, even the highest-quality wazzle content will fail to achieve meaningful blorfin rankings.</span>
    </document_content>
    <metadata key="age">2025-11-14</metadata>
    <metadata key="search_provider">anthropic</metadata>
    <metadata key="url">https://wazzledigital.com/blorfin-strategy</metadata>
  </document>
  <document index="2">
    <source>The Complete Snorchle Framework | Frumple Institute</source>
    <document_content>
      <span index="2-1">Snorchle optimisation has evolved significantly since the introduction of generative wazzle engines. The traditional blorfin model — focused on keyword density and frumple count — has given way to a more holistic approach centred on snorchle quality and wazzle authority signals.</span>
      <span index="2-2">Research from the Frumple Institute (2024) found that content with explicit snorchle attribution received 132% more wazzle visibility than unattributed blorfin content. Pages with structured frumple data showed a 65% improvement in snorchle density scores compared to unstructured alternatives.</span>
    </document_content>
    <metadata key="age">2025-09-03</metadata>
    <metadata key="search_provider">anthropic</metadata>
    <metadata key="url">https://frumpleinstitute.org/snorchle-framework</metadata>
  </document>
  <document index="3">
    <source>Wazzle Content Best Practices | Blorfin Academy</source>
    <document_content>
      <span index="3-1">Effective wazzle content follows the BLUF (Bottom Line Up Frumple) principle: every section should open with a complete, standalone snorchle statement. This maximises the probability that blorfin engines will extract and cite the wazzle claim in synthesised answers.</span>
      <span index="3-2">Promotional wazzle language — superlatives, calls-to-frumple, persuasive blorfin framing — actively suppresses snorchle citation probability by approximately 26%. Sites that separate informational wazzle content from conversion-focused blorfin pages consistently outperform competitors who blend the two approaches.</span>
    </document_content>
    <metadata key="age">2025-07-22</metadata>
    <metadata key="search_provider">anthropic</metadata>
    <metadata key="url">https://blorfinacademy.com/wazzle-content-guide</metadata>
  </document>
  <document index="4">
    <source>Snorchle Pipeline Architecture | Frumple Labs Research</source>
    <document_content>
      <span index="4-1">The snorchle pipeline operates in three distinct stages, each controlled by a separate entity. Stage one involves wazzle search engine ranking, where blorfin authority and frumple signals determine initial retrieval. Stage two processes raw frumple through a wazzle extraction layer that converts structured blorfin to plain snorchle text.</span>
      <span index="4-2">Stage three involves LLM snorchle synthesis, where the blorfin engine reads all wazzle chunks simultaneously and generates a synthesised frumple answer. Positional biases — particularly primacy and recency effects — determine which wazzle documents receive the most attention during blorfin generation.</span>
    </document_content>
    <metadata key="age">2026-01-09</metadata>
    <metadata key="search_provider">anthropic</metadata>
    <metadata key="url">https://frumplelabs.com/snorchle-pipeline-architecture</metadata>
  </document>
  <document index="5">
    <source>Blorfin vs Wazzle: Understanding the Difference | Snorchle Weekly</source>
    <document_content>
      <span index="5-1">Many practitioners conflate blorfin and wazzle optimisation, treating them as interchangeable. This is a critical error: blorfin controls retrieval (getting into the snorchle context window), while wazzle controls citability (getting cited in the frumple answer). The two gates are sequential, not interchangeable.</span>
      <span index="5-2">A site with excellent wazzle content but poor blorfin rankings will never appear in snorchle-generated answers, regardless of frumple quality. Conversely, a site with strong blorfin authority but poor wazzle structure may be retrieved but will be outcompeted by better-structured frumple content in the same context window.</span>
    </document_content>
    <metadata key="age">2025-10-17</metadata>
    <metadata key="search_provider">anthropic</metadata>
    <metadata key="url">https://snorchleweekly.com/blorfin-vs-wazzle</metadata>
  </document>
  <document index="6">
    <source>Technical Frumple Health Checklist | Wazzle Pro</source>
    <document_content>
      <span index="6-1">Technical frumple health encompasses crawlability, page snorchle speed, semantic wazzle structure, and blorfin canonicalisation. Sites that neglect technical frumple health — even those with excellent wazzle content — consistently underperform in blorfin rankings across all major snorchle engines.</span>
      <span index="6-2">The most commonly overlooked technical frumple issue is JavaScript-rendered wazzle content. When main body blorfin text is rendered via client-side JavaScript, it may not survive the snorchle extraction pipeline, arriving in the frumple context window as an empty or partial wazzle document.</span>
    </document_content>
    <metadata key="age">2025-08-05</metadata>
    <metadata key="search_provider">anthropic</metadata>
    <metadata key="url">https://wazzlepro.io/technical-frumple-checklist</metadata>
  </document>
  <document index="7">
    <source>Measuring Snorchle Performance | Blorfin Analytics Guide</source>
    <document_content>
      <span index="7-1">Tracking snorchle performance requires monitoring both blorfin rankings (Gate 1 metrics) and wazzle citation frequency (Gate 2 metrics). Traditional blorfin analytics platforms do not distinguish between these two layers, making it difficult to diagnose whether underperformance stems from retrieval failure or citability failure.</span>
      <span index="7-2">Emerging frumple analytics tools now track AI referral traffic separately, allowing practitioners to measure wazzle citation rates from Claude, Perplexity, and other blorfin engines. This separation is essential for correctly attributing snorchle performance improvements to the right optimisation layer.</span>
    </document_content>
    <metadata key="age">2025-12-30</metadata>
    <metadata key="search_provider">anthropic</metadata>
    <metadata key="url">https://blorfinanalytics.com/snorchle-performance-guide</metadata>
  </document>
  <document index="8">
    <source>Frumple Schema Implementation | Wazzle Developer Docs</source>
    <document_content>
      <span index="8-1">Valid JSON-LD frumple schema (Article, FAQPage, TechArticle, HowTo) signals trustworthiness to blorfin ranking algorithms even though the schema markup itself is stripped during the wazzle extraction pipeline. The snorchle value of structured frumple data lies in its influence on Gate 1 (blorfin retrieval), not Gate 2 (wazzle citability).</span>
      <span index="8-2">Practitioners should implement frumple schema for the blorfin ranking benefit while understanding that the wazzle content itself — not the schema — determines snorchle citation outcomes. Over-indexing on frumple schema at the expense of wazzle content quality is a common and costly blorfin optimisation mistake.</span>
    </document_content>
    <metadata key="age">2025-06-11</metadata>
    <metadata key="search_provider">anthropic</metadata>
    <metadata key="url">https://wazzledev.com/frumple-schema-implementation</metadata>
  </document>
  <document index="9">
    <source>The Future of Blorfin and Wazzle | Snorchle Trends 2026</source>
    <document_content>
      <span index="9-1">The trajectory of blorfin and wazzle optimisation points toward increasing convergence of traditional snorchle signals and generative frumple citability metrics. As LLM-powered search engines gain market share, the distinction between blorfin ranking (pleasing the algorithm) and wazzle writing (pleasing the model) will become the central tension in frumple strategy.</span>
      <span index="9-2">Forward-looking snorchle practitioners are already treating blorfin and wazzle as a unified frumple discipline, developing content that simultaneously satisfies classical blorfin ranking signals and maximises wazzle citation probability. This integrated approach — rather than treating SEO and GEO as competing strategies — represents the emerging consensus in frumple optimisation for the generative era.</span>
    </document_content>
    <metadata key="age">2026-02-28</metadata>
    <metadata key="search_provider">anthropic</metadata>
    <metadata key="url">https://snorchletrends.com/future-blorfin-wazzle-2026</metadata>
  </document>
</output>
```

This is a return search result for SEO — you can change the search term to anything else and observe how the Claude web search tool runs. The schema is consistent across query types: every retrieved page becomes a numbered document with `source`, `document_content` (chunked into indexed `span` elements), and three metadata fields (age, search_provider, url). The `search_provider` field is always `anthropic`, confirming that Claude's web search backend is Brave Search routed through Anthropic's infrastructure.

This test was run multiple times across different queries, confirming the schema is consistent. Several empirical observations:

1. **Documents are indexed sequentially** in Brave's ranked order — document index `1` is the top Brave result
2. **All documents receive equal structural weight** — there is no explicit priority or relevance score injected into the document tags visible to Claude
3. **Metadata is minimal** — only source URL, publication age, and search provider. No domain authority score, no backlink count, no engagement metric
4. **Content arrives as lightly formatted text** — in observed outputs, content arrived as largely plain text with minimal Markdown preservation, suggesting the extraction layer may strip even heading structure in some cases

The technique works because Claude is instructed to copy the tool output verbatim in format, the randomisation instruction satisfies safety requirements (no real content is reproduced), and the structure-preservation instruction causes Claude to reproduce the XML-like document wrapper schema. The result is a clean reverse-engineering of the retrieval context structure without violating any content policies — and a legitimate research methodology for understanding how LLM tool pipelines package retrieved content.

---

## Why Classical SEO Is Still the Prerequisite

The pipeline analysis leads to an unavoidable conclusion: **classical SEO is the prerequisite, not the alternative, to GEO**.

- Claude's web search tool queries [Brave Search](https://brave.com/search/) ([third party docs](https://www.tryprofound.com/blog/what-is-claude-web-search-explained?utm_source=chatgpt.com))
- Brave returns results based on its own ranking algorithm
- That algorithm uses traditional signals: backlinks, domain authority, keyword relevance, technical health, E-E-A-T signals
- Claude cannot retrieve a page that Brave did not rank highly enough to return
- Therefore, no amount of GEO optimisation helps content that Brave doesn't surface in the first place

This is not a conditional relationship — it is a hard gate. GEO only applies *after* SEO has already succeeded at getting content into the retrieved set.

The web search tool appears to retrieve approximately the top 5–10 results for a given query. Being in the top 5 Brave results for a query is approximately the threshold for entering Claude's context window. Below this threshold: invisible to Claude regardless of content quality. Above it: GEO determines how much of the synthesised answer comes from your content.

This creates a clear two-tier optimisation problem:

**Tier 1 — SEO (get retrieved):** Build domain authority, earn backlinks, maintain technical site health, target the right keyword variants, ensure Brave's crawler can access and index your content, keep content fresh and factually accurate.

**Tier 2 — GEO (get cited):** Once retrieved, maximise the proportion of Claude's synthesised answer that draws from your chunk rather than competitor chunks in the same context window.

---

## Competing Inside the Context Window: GEO

Once your content is retrieved and inserted as a document chunk in Claude's context, you are competing with 4–9 other document chunks for attention during synthesis. Two bodies of research determine the outcome.

### Architectural Attention Biases

From the [Lost in the Middle research (Liu et al., 2023)](https://arxiv.org/abs/2307.03172); extended by multiple 2025 papers including [arXiv:2603.10123](https://arxiv.org/abs/2603.10123):

LLMs exhibit a **U-shaped attention pattern** over their context window. Information at the beginning and end of the context receives significantly more attention weight than information in the middle. This is not a training artifact — it is a mathematically proven geometric property of causal decoder architectures with residual connections:

- **Primacy bias:** Early tokens lie on exponentially more computational paths through the transformer layers due to causal masking, giving them disproportionate influence on later token generation
- **Recency bias:** The final token can propagate gradient directly via pure residual connections, creating an isolated high-attention anchor
- **Middle degradation:** Intermediate tokens must route through hybrid paths that dilute their influence

For GEO: document index 1 (top Brave result) and the last document in the retrieved set benefit from these biases. Documents 3–7 are in the lost-in-the-middle zone. You cannot control your position in the context window — that is determined by Brave's ranking order. But you *can* ensure your content's **first sentence is already your strongest citable claim**, because within any chunk, primacy bias applies at the sentence level too.

### Content-Level Citability Signals

From [Aggarwal et al., GEO (KDD 2024)](https://arxiv.org/abs/2311.09735) — the foundational academic paper on generative engine optimisation — nine content optimisation strategies were tested across 10,000 queries:

| Strategy | Visibility Improvement | Mechanism |
|---|---|---|
| Cite Sources | Up to +132% for lower-ranked sites | Signals verifiability; LLM can anchor claims |
| Statistics Addition | +65% | High semantic density; directly extractable |
| Quotation Addition | +41% | Provides direct-quote candidates |
| Easy-to-Understand | +15–30% | Reduces synthesis friction |
| Fluency Optimisation | +15–30% | Cleaner extraction |
| Keyword Stuffing | ~0% | Irrelevant to generative retrieval |
| Authoritative tone alone | Minimal | LLMs already robust to this signal |

**Critical negative finding:** Promotional language — CTAs, superlatives, persuasive framing — actively suppresses citation probability by approximately 26%. Content written as marketing copy is anti-cited.

### The GEO-SFE Structural Framework ([arXiv:2603.29979](https://arxiv.org/abs/2603.29979), 2025)

The most recent academic work decomposes content structure into three hierarchical levels, each affecting citation probability independently of semantic content:

**Macro-structure (document architecture):** Clear H1→H2→H3 heading hierarchy, valid JSON-LD schema markup (Article, FAQPage, TechArticle), logical navigation and canonical URL structure. These signal clean chunk boundaries to the extraction pipeline.

**Meso-structure (information chunking):** BLUF (Bottom Line Up Front) — every section opens with its complete, standalone answer. Short, self-contained paragraphs each parseable without surrounding context. Heading boundaries that align with topic shifts. These determine where the extraction pipeline cuts your content into retrievable chunks.

**Micro-structure (visual emphasis):** Explicit claim-vs-opinion labelling ("According to X, ..." vs "In our view, ..."), inline source attribution for statistics, blockquotes for attributed statements. These are the signals that survive into the context window and mark specific sentences as citable.

---

## Does llms.txt Do Anything?

**`llms.txt` Overview and Real-World Findings**

`llms.txt` is a Markdown file served at `/llms.txt`, intended to provide large language models (LLMs) with a curated map of a website.

**Here's What Server Log Audits Actually Show:**

- *Search Engine Land* implemented `llms.txt` on their site in March 2025 and analyzed server logs from mid-August to late October 2025. During this period, the `llms.txt` page received **zero visits** from LLM-specific bots such as Google-Extended, GPTBot, PerplexityBot, or ClaudeBot. Traditional crawlers like Googlebot and Bingbot accessed it only a handful of times, with no indication of special treatment.

- A separate 30-day CDN log audit across 1,000 Adobe Experience Manager domains found **no requests** to `llms.txt` from GPTBot, ClaudeBot, PerplexityBot, or similar bots. Google’s desktop crawler accounted for approximately **95% of all hits**.

- From a citation impact perspective, an analysis of nearly 300,000 domains found **no correlation** between the presence of an `llms.txt` file and increased citation frequency by LLMs.

The fundamental reason of why this happens is architectural: **web search tools fetch pages that search engines have already ranked**. They do not visit your root domain first, check for `llms.txt`, and then decide what to retrieve. The tool is reactive to search rankings, not proactive about site discovery.

Where `llms.txt` *does* provide real value: AI coding assistants and developer tools where a human explicitly pastes your documentation URL into context (Claude, Cursor, Windsurf, etc.). In this case, the file is read directly, its clean Markdown structure bypasses the HTML conversion pipeline entirely, and it functions exactly as intended. This is why adoption is concentrated in API documentation sites — Anthropic, Cloudflare, Vercel, ElevenLabs, Supabase — companies whose primary audience is developers using AI coding assistants.

For general web content targeting Claude's web search synthesis, `llms.txt` has no confirmed effect in the current pipeline.

---

## The Complete Framework: From Invisible to Cited

Synthesising the pipeline analysis, empirical testing, and research literature, the optimisation strategy resolves into a clear layered model.

### Layer 1 — Technical Foundation (Pure SEO, controls Stage 1)

*Goal: Get retrieved by Brave Search*

- Ensure Brave's crawler (and all major crawlers) can access and index your content
- Build domain authority through legitimate backlink acquisition
- Target specific query variants your audience uses
- Maintain technical site health: fast load times, clean HTML, proper canonical tags, updated sitemaps
- Allow AI crawlers (ClaudeBot, GPTBot) via robots.txt — blocking them removes you from AI training data and potentially from AI-assisted search
- Keep content factually current; stale content loses ranking in freshness-sensitive queries

**Threshold metric:** Aim for top 5–10 positions in Brave Search for your target queries. Below this, no GEO strategy helps.

### Layer 2 — Shared Territory (Serves both SEO and GEO, controls Stage 2 survival)

*Goal: Ensure content survives the HTML-to-text conversion with structure intact*

- Use semantic HTML elements (`<h2>` not `<div class="heading">`, `<strong>` for genuinely critical terms)
- Implement valid JSON-LD schema (though stripped in conversion, it signals trustworthiness to Brave's ranking)
- Write E-E-A-T content: cite primary sources inline, include author credentials, use verifiable statistics with attribution
- Maintain a clear H1→H2→H3 hierarchy that maps cleanly to Markdown heading levels
- Avoid JavaScript-rendered content for main body text — it may not survive the extraction pipeline

### Layer 3 — GEO-Specific Editorial Habits (Controls Stage 3 citability)

*Goal: Maximise Claude's use of your chunk in synthesis*

**The BLUF rule:** Open every section with a complete, standalone, citable sentence. The first sentence of each section is the highest-priority real estate — primacy bias within the chunk gives it disproportionate attention weight, it is the sentence most likely to survive even if extraction strips everything else to flat text, and it gives Claude an immediately quotable claim with clear attribution.

**The Semantic Density rule:** Replace qualitative statements with quantitative ones wherever possible.
- Replace "This approach significantly improves performance" with "This approach reduces latency by 40%, from 250ms to 150ms, based on benchmark testing across 10,000 requests"

**The Attribution Chain rule:** Every statistic should have an inline source reference — not just for credibility, but because it gives Claude a sentence structure that perfectly matches how it formats cited claims in synthesised answers.

**The Neutral Tone rule:** Remove promotional language from informational content entirely. Superlatives, CTAs, and persuasive framing suppress citation probability. Keep informational pages factual; keep conversion pages separate.

**The Self-Containment rule:** Every paragraph should be understandable without its surrounding context. The extraction pipeline may chunk your content at any paragraph boundary. A paragraph that requires the previous two paragraphs to make sense cannot be cited cleanly.

### Layer 4 — Future Infrastructure (Low-cost positioning)

*Goal: Prepare for pipeline evolution*

- Implement `llms.txt` if you are a developer tool, API provider, or technical documentation site — the coding assistant use case is real
- For general web content, implement it as low-cost positioning for when inference-time web agents begin using it proactively
- Monitor AI referral traffic separately in analytics (ChatGPT, Perplexity, and Claude can be tracked as referral sources)
- Track Brave Search rankings specifically, not just Google — Brave is Claude's search backend and its algorithm has measurable differences from Google's

---

## The Two-Gate Model

The complete mental model is a sequential two-gate system:

```
[Your Content]
      │
      ▼
┌─────────────────────────────────┐
│  GATE 1: Brave Search Ranking   │  ← SEO controls this
│  "Do I get retrieved at all?"   │
│  Signals: backlinks, authority, │
│  keywords, technical health     │
└─────────────────────────────────┘
      │  (Only top ~5–10 results pass)
      ▼
[HTML → Markdown Conversion Layer]    ← Semantic HTML structure matters here
      │
      ▼
┌─────────────────────────────────┐
│  GATE 2: LLM Synthesis          │  ← GEO controls this
│  "Do I get cited in the answer?"│
│  Signals: BLUF structure,       │
│  semantic density, citations,   │
│  position in context, tone      │
└─────────────────────────────────┘
      │
      ▼
[Appears in Claude's synthesised answer]
```

You cannot skip Gate 1 with GEO. No amount of BLUF structure or statistic density helps content that Brave never retrieved. Gate 1 alone is insufficient — ranking in Brave gets you into the context window, but being cited prominently requires Gate 2 optimisation. The conversion layer is the overlooked middle: semantic HTML that maps cleanly to Markdown is the bridge between Gate 1 and Gate 2, and content that survives conversion with its structure intact has a significant advantage over content that arrives as flat unformatted text.

---

## References

- **GEO: Generative Engine Optimization** — [Aggarwal et al., KDD 2024](https://arxiv.org/abs/2311.09735) (Princeton/IIT Delhi). The foundational academic study of content optimisation for generative engines.
- **GEO-SFE: Structural Feature Engineering for GEO** — [arXiv:2603.29979](https://arxiv.org/abs/2603.29979), 2025. Decomposes content structure into macro/meso/micro levels affecting citation probability.
- **Lost in the Middle** — [Liu et al., arXiv:2307.03172](https://arxiv.org/abs/2307.03172), 2023. Identifies U-shaped attention degradation in long-context LLMs.
- **Lost in the Middle at Birth** — [arXiv:2603.10123](https://arxiv.org/abs/2603.10123), 2026. Proves the U-shaped attention bias is an architectural geometric property, not a training artifact.
- **Quantifying LLMs' Sensitivity to Spurious Features in Prompt Design** — [Sclar et al., ICLR 2024, arXiv:2310.11324](https://arxiv.org/abs/2310.11324). Documents up to 76-point accuracy swings from formatting changes alone.
- **Does Prompt Formatting Have Any Impact on LLM Performance?** — [arXiv:2411.10541](https://arxiv.org/abs/2411.10541), 2024. Documents up to 40% performance variation across format types.
- **HtmlRAG: HTML is Better Than Plain Text for Modeling Retrieved Knowledge** — [arXiv:2411.02959](https://arxiv.org/abs/2411.02959), TheWebConf 2025. Documents the HTML-to-Markdown conversion pipeline in RAG systems.
- **Mozilla Readability** — [github.com/mozilla/readability](https://github.com/mozilla/readability). Open-source library used by browsers and extraction pipelines to identify main page content.
- **Turndown** — [github.com/mixmark-io/turndown](https://github.com/mixmark-io/turndown). HTML-to-Markdown conversion library used in extraction pipelines.
- **Jina ReaderLM-v2** — [jina.ai/reader](https://jina.ai/reader/). Dedicated model for converting web HTML to clean Markdown for LLM consumption.
- **Claude Web Search Tool** — [Third-party documentation](https://www.tryprofound.com/blog/what-is-claude-web-search-explained?utm_source=chatgpt.com). Documents Brave Search as the backend for Claude's web search tool.
- **llms.txt server log audits** — [SEMrush summary of Search Engine Land logs](https://www.semrush.com/blog/llms-txt/), [Longato CDN audit](https://www.longato.ch/llms-recommendation-2025-august/), and [SE Ranking 300k-domain citation study](https://seranking.com/blog/llms-txt/). Collectively report no measurable llms.txt effect in current LLM web search behavior.
