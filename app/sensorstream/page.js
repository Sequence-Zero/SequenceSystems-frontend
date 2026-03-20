import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadMarkdown } from "@/lib/loadMarkdown";
import SensorstreamClient from "./SensorstreamClient";

export default async function SensorstreamPage() {
  const docsContent = await loadMarkdown("docs/sensorstream.md");

  return (
    <main className="min-h-screen">
      <SensorstreamClient />

      <div className="mx-auto mt-10 max-w-6xl px-4 pb-12">
        <section className="surface">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-900">Repository</h2>
          </div>
          <div className="flex flex-col gap-3 p-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Source code for the SensorStream demo UI and supporting
              documentation.
            </p>
            <a
              className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
              href="https://github.com/Sequence-Zero/SensorStreamAPI"
              target="_blank"
              rel="noreferrer"
            >
              View GitHub Repository
            </a>
          </div>
        </section>

        <section className="mt-6 surface">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-900">Documentation</h2>
          </div>
          <div className="p-4 text-sm text-zinc-700">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children, ...props }) => (
                  <h1
                    className="mb-4 text-2xl font-bold text-zinc-900 font-mono"
                    {...props}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2
                    className="mt-6 mb-3 text-base font-bold text-zinc-900 font-mono"
                    {...props}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3
                    className="mt-5 mb-2 text-sm font-bold text-zinc-900 font-mono"
                    {...props}
                  >
                    {children}
                  </h3>
                ),
                p: ({ children, ...props }) => (
                  <p
                    className="leading-relaxed text-zinc-700"
                    {...props}
                  >
                    {children}
                  </p>
                ),
                ul: ({ children, ...props }) => (
                  <ul
                    className="mb-4 list-disc space-y-2 pl-5 text-zinc-700"
                    {...props}
                  >
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol
                    className="mb-4 list-decimal space-y-2 pl-5 text-zinc-700"
                    {...props}
                  >
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li {...props}>{children}</li>
                ),
                blockquote: ({ children, ...props }) => (
                  <div
                    className="my-4 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
                    {...props}
                  >
                    {children}
                  </div>
                ),
                code: ({ inline, children, ...props }) =>
                  inline ? (
                    <code
                      className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      className="block font-mono text-xs text-zinc-900"
                      {...props}
                    >
                      {children}
                    </code>
                  ),
                pre: ({ children, ...props }) => (
                  <pre
                    className="my-3 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 p-3"
                    {...props}
                  >
                    {children}
                  </pre>
                ),
              }}
              className="prose prose-zinc max-w-none space-y-4"
            >
              {docsContent}
            </ReactMarkdown>
          </div>
        </section>
      </div>
    </main>
  );
}
