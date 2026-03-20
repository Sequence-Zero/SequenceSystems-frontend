import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200 sm:h-24 sm:w-24">
                <img
                  className="h-full w-full rounded-full object-cover"
                  src="/profile.png"
                  alt="Chris Keenan"
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600/80">
                  Portfolio
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                  Chris Keenan
                </h1>
                <p className="text-lg font-medium text-zinc-700">
                  Full-Stack Developer (Seeking Internships)
                </p>
              </div>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-700">
              I build end-to-end systems that connect APIs, data pipelines, and
              real-time dashboards. I enjoy shipping practical tools that turn
              raw telemetry into clean, decision-ready interfaces.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="shadow-sm focus-visible:ring-2 focus-visible:ring-zinc-400">
                <Link href="/sensorstream">SensorStream Demo</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-white shadow-sm hover:bg-zinc-50"
              >
                <Link href="/locomotion">Locomotion Demo</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-white shadow-sm hover:bg-zinc-50"
              >
                <a
                  href="https://github.com/Sequence-Zero"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-white shadow-sm hover:bg-zinc-50"
              >
                <a href="/Chris_Resume.pdf" target="_blank" rel="noopener noreferrer">
                  Resume PDF
                </a>
              </Button>
            </div>
          </div>
          <Card className="surface">
            <CardContent className="space-y-4 p-6">
              <div className="h-1 w-12 rounded-full bg-indigo-500/70" />
              <h2 className="text-sm font-semibold text-zinc-900">
                Focus Areas
              </h2>
              <ul className="space-y-3 text-sm text-zinc-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                  Real-time telemetry dashboards and data visualization.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                  API design, monitoring, and automation tooling.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                  Hardware + software integration for robotics systems.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900">
              Featured Projects
            </h2>
            <span className="text-sm text-zinc-500">
              Selected demos and case studies
            </span>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="surface surface-hover">
              <CardContent className="space-y-4 p-6">
                <div className="h-1 w-12 rounded-full bg-indigo-500/70" />
                <h3 className="text-lg font-semibold text-zinc-900">
                  SensorStream API
                </h3>
                <p className="text-sm text-zinc-600">
                  Real-time telemetry demo that streams device readings into a
                  live dashboard with charts, latest values, and history.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "React", "Tailwind", "Node", "REST", "Flask"].map(
                    (chip) => (
                      <Badge
                        key={chip}
                        variant="outline"
                        className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700 transition hover:bg-zinc-100"
                      >
                        {chip}
                      </Badge>
                    )
                  )}
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild className="px-3.5 py-2 text-xs">
                    <Link href="/sensorstream">View</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="px-3.5 py-2 text-xs"
                  >
                    <a
                      href="https://github.com/Sequence-Zero/SensorStreamAPI"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Repo
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="surface surface-hover">
              <CardContent className="space-y-4 p-6">
                <div className="h-1 w-12 rounded-full bg-indigo-500/70" />
                <h3 className="text-lg font-semibold text-zinc-900">
                  Locomotion Robot
                </h3>
                <p className="text-sm text-zinc-600">
                  Hardware and software integration project focused on motion
                  control, sensor fusion, and diagnostics.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Embedded C", "Python", "ROS", "Control"].map((chip) => (
                    <Badge
                      key={chip}
                      variant="outline"
                      className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700 transition hover:bg-zinc-100"
                    >
                      {chip}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild className="px-3.5 py-2 text-xs">
                    <Link href="/locomotion">View</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="px-3.5 py-2 text-xs"
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Repo
                    </a>
                  </Button>
                  {/* TODO: add locomotion repo link */}
                  <span className="flex items-center text-[11px] text-zinc-400">
                    TODO: add locomotion repo link
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-14">
          <Card className="surface">
            <CardContent className="space-y-4 p-6">
              <div className="h-1 w-12 rounded-full bg-indigo-500/70" />
              <h2 className="text-xl font-semibold text-zinc-900">About</h2>
              <div className="space-y-3 text-sm text-zinc-600">
                <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
                  Currently: Seeking Software Engineering Internships (Spring/Summer 2026)
                </div>
                <p>
                  I am a CS student building end-to-end systems that pair Flask
                  APIs, durable persistence layers, and production-ready
                  dashboards. I enjoy translating messy telemetry into
                  interfaces that make status, anomalies, and trends obvious,
                  then hardening the pipeline so data stays accurate and
                  consistent as the system scales.
                </p>
                <p>
                  Over the next four months, my priority is landing a software
                  engineering internship where I can contribute immediately.
                  After graduation, I plan to transition into a full-time new
                  grad role focused on reliable, data-intensive products.
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    API design and integration with Flask backends and auth
                    layers
                  </li>
                  <li>
                    Data persistence, schema design, and telemetry ingestion
                    pipelines
                  </li>
                  <li>
                    Realtime UI state, charts, and operational dashboard
                    workflows
                  </li>
                  <li>
                    Debugging-first mindset with tests that prove edge-case
                    behavior
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Chris Keenan</span>
          <div className="flex flex-wrap gap-4">
            <a
              className="font-medium text-zinc-700 hover:text-zinc-900"
              href="https://github.com/Sequence-Zero"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="font-medium text-zinc-700 hover:text-zinc-900"
              href="https://www.linkedin.com/in/chriskeenan0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="font-medium text-zinc-700 hover:text-zinc-900"
              href="mailto:christopher.keenan1@snhu.edu"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
