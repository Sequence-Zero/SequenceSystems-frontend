import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Chris Keenan",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="page-shell py-12 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)] lg:items-center lg:gap-10">
          <div className="space-y-7 lg:space-y-8">
            <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200 sm:h-24 sm:w-24">
                <img
                  className="h-full w-full rounded-full object-cover"
                  src="/profile.png"
                  alt="Chris Keenan"
                />
              </div>
              <div className="space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600/80">
                  Portfolio
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.4rem]">
                  Chris Keenan
                </h1>
                <p className="text-base font-medium text-zinc-700 sm:text-lg">
                  Software Engineer
                </p>
              </div>
            </div>

            <p className="max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8">
              I build end-to-end systems that connect APIs, data pipelines, and real-time
              dashboards, with a growing focus on robotics and embedded systems. I enjoy bridging
              hardware and software, turning telemetry and sensor data into clean,
              decision-ready interfaces.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="px-4 py-2.5 shadow-sm focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <Link href="/sensorstream">SensorStream Demo</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-white px-4 py-2.5 shadow-sm hover:bg-zinc-50"
              >
                <Link href="/locomotion">Locomotion Demo</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-white px-4 py-2.5 shadow-sm hover:bg-zinc-50"
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
                className="bg-white px-4 py-2.5 shadow-sm hover:bg-zinc-50"
              >
                <a href="/Chris_Resume.pdf" target="_blank" rel="noopener noreferrer">
                  Resume PDF
                </a>
              </Button>
            </div>
          </div>

          <Card className="surface lg:ml-auto lg:w-full lg:max-w-md">
            <CardContent className="space-y-5 p-6 sm:p-7">
              <div className="h-1 w-12 rounded-full bg-indigo-500/70" />
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Focus Areas
                </h2>
                <p className="text-lg font-semibold leading-7 text-zinc-900">
                  Full-stack systems work across telemetry, dashboards, and hardware-adjacent
                  software.
                </p>
              </div>
              <ul className="space-y-3.5 text-sm leading-6 text-zinc-600 sm:text-[0.95rem]">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-indigo-400" />
                  Real-time telemetry dashboards and decision-ready data visualization.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-indigo-400" />
                  API design, monitoring, and automation tooling for operational systems.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-indigo-400" />
                  Hardware and software integration for robotics and embedded workflows.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mt-14 lg:mt-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
                Featured Projects
              </h2>
              <p className="text-sm text-zinc-500">Selected demos and case studies.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="surface">
              <CardContent className="flex h-full flex-col space-y-4 p-6 sm:p-7">
                <div className="h-1 w-12 rounded-full bg-indigo-500/70" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-zinc-900 sm:text-xl">
                    SensorStream API
                  </h3>
                  <p className="text-sm leading-6 text-zinc-600 sm:text-[0.95rem]">
                    Real-time telemetry demo that streams device readings into a live dashboard
                    with charts, latest values, and history.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "React", "Tailwind", "Node", "REST", "Flask"].map(
                    (chip) => (
                      <Badge
                        key={chip}
                        variant="outline"
                        className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700"
                      >
                        {chip}
                      </Badge>
                    )
                  )}
                </div>
                <div className="flex flex-wrap gap-3 pt-3">
                  <Button asChild className="px-4 py-2 text-xs">
                    <Link href="/sensorstream">View</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="px-4 py-2 text-xs"
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

            <Card className="surface">
              <CardContent className="flex h-full flex-col space-y-4 p-6 sm:p-7">
                <div className="h-1 w-12 rounded-full bg-indigo-500/70" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-zinc-900 sm:text-xl">
                    Locomotion Robot
                  </h3>
                  <p className="text-sm leading-6 text-zinc-600 sm:text-[0.95rem]">
                    Hardware and software integration project focused on motion control, sensor
                    fusion, and diagnostics.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Embedded C", "Python", "ROS", "Control"].map((chip) => (
                    <Badge
                      key={chip}
                      variant="outline"
                      className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700"
                    >
                      {chip}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 pt-3">
                  <Button asChild className="px-4 py-2 text-xs">
                    <Link href="/locomotion">View</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="px-4 py-2 text-xs"
                  >
                    <a
                      href="https://github.com/Sequence-Zero/LocomotionRobot"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Repo
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-14 lg:mt-16">
          <Card className="surface">
            <CardContent className="space-y-5 p-6 sm:p-7">
              <div className="h-1 w-12 rounded-full bg-indigo-500/70" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">About</h2>
                  <p className="max-w-3xl text-sm leading-6 text-zinc-600 sm:text-[0.95rem]">
                    I am a CS student building end-to-end systems that pair Flask APIs, durable
                    persistence layers, and production-ready dashboards. I&apos;m especially
                    interested in robotics, embedded systems, and real-world telemetry workflows.
                  </p>
                </div>
                <div className="inline-flex items-center rounded-full border border-zinc-200/80 bg-zinc-50/90 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-zinc-500">
                  Currently: Seeking Software Engineering Roles (Open to internships)
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ul className="space-y-3 text-sm leading-6 text-zinc-600 sm:text-[0.95rem]">
                  <li className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 px-4 py-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-indigo-400" />
                    API design and integration with Flask backends and auth layers
                  </li>
                  <li className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 px-4 py-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-indigo-400" />
                    Data persistence, schema design, and telemetry ingestion pipelines
                  </li>
                </ul>
                <ul className="space-y-3 text-sm leading-6 text-zinc-600 sm:text-[0.95rem]">
                  <li className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 px-4 py-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-indigo-400" />
                    Real-time UI state, charts, and operational dashboard workflows
                  </li>
                  <li className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/70 px-4 py-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-indigo-400" />
                    Debugging-first development with tests for edge cases and system reliability
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="page-shell flex flex-col gap-3 py-6 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Chris Keenan</span>
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
