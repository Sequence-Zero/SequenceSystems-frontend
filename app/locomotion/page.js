import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadMarkdown } from "@/lib/loadMarkdown";

export default async function LocomotionPage() {
  const docsContent = await loadMarkdown("docs/locomotion.md");

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:py-12">
        <header className="flex flex-col gap-6 border-b border-zinc-200 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Locomotion Robot
            </h1>
            <p className="text-sm text-zinc-500">
              Hardware + software integration demo for motion control.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <a
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
              href="https://github.com/Sequence-Zero/LocomotionRobot"
              target="_blank"
              rel="noreferrer"
            >
              View Repository
            </a>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="surface lg:col-span-7">
            <div className="border-b border-zinc-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-900">Demo</h2>
            </div>
            <div className="p-4">
              <div className="w-full overflow-hidden rounded-lg border border-zinc-200">
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    className="absolute left-0 top-0 h-full w-full"
                    src="https://www.youtube.com/embed/boDyZw8KBnY"
                    title="Locomotion Robot Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <p className="mt-2 text-xs text-zinc-500">
                    ROS2 teleoperation using /cmd_vel with live topic streaming and robot response
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="surface lg:col-span-5">
            <div className="border-b border-zinc-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-900">
                Repository
              </h2>
            </div>
            <div className="flex flex-col gap-3 p-4 text-sm text-zinc-600">
              <p>
                Source code and hardware notes for the locomotion robot demo.
              </p>
              <a
                className="inline-flex w-fit items-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
                href="https://github.com/Sequence-Zero/LocomotionRobot"
                target="_blank"
                rel="noreferrer"
              >
                View GitHub Repository
              </a>
            </div>
          </section>
        </div>

        <section className="mt-6 surface">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-900">
              ROS2 Graph (rqt_graph)
            </h2>
          </div>
          <div className="space-y-4 p-4">
            <p className="text-sm text-zinc-700">
              This graph visualizes the active ROS2 nodes and topic
              connections during teleoperation. The teleop_twist_keyboard node
              publishes velocity commands to /cmd_vel, which are consumed by the
              robot_serial_bridge node and translated into motor commands for
              the Arduino. This demonstrates real ROS middleware communication
              and node-based architecture.
            </p>
            <a href="/rqt_graph.png" target="_blank" rel="noreferrer">
              <img
                src="/rqt_graph.png"
                alt="ROS2 rqt_graph showing node and topic connections"
                className="w-full rounded-lg border border-zinc-200"
              />
            </a>
          </div>
        </section>

        <section className="mt-6 surface">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-900">
              System Architecture
            </h2>
          </div>
          <div className="flex flex-col gap-6 p-4">
            <div className="space-y-2">
              <a
                href="/ros_architecture_refined.png"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/ros_architecture_refined.png"
                  alt="ROS2 architecture diagram"
                  className="w-full rounded-lg border border-zinc-200"
                />
              </a>
              <p className="text-xs text-zinc-500">
                High-level ROS2 control layer communicating with Arduino-based
                motor control via USB serial. The serial bridge node translates
                velocity commands into low-level motor instructions.
              </p>
            </div>

            <div className="space-y-2">
              <a href="/ros_dataflow_refined.png" target="_blank" rel="noreferrer">
                <img
                  src="/ros_dataflow_refined.png"
                  alt="ROS2 command data flow diagram"
                  className="w-full rounded-lg border border-zinc-200"
                />
              </a>
              <p className="text-xs text-zinc-500">
                Keyboard teleoperation generates /cmd_vel messages, which flow
                through the ROS2 system into the serial bridge and down to
                embedded motor control, demonstrating end-to-end command
                propagation.
              </p>
            </div>

            <div className="space-y-2">
              <a
                href="/ros_control_modes_refined.png"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/ros_control_modes_refined.png"
                  alt="Robot control modes diagram"
                  className="w-full rounded-lg border border-zinc-200"
                />
              </a>
              <p className="text-xs text-zinc-500">
                The robot supports multiple control paradigms: manual IR
                control, autonomous obstacle avoidance, and ROS2-based
                teleoperation, illustrating modular system evolution.
              </p>
            </div>
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
                code: ({ inline, className, children, ...props }) =>
                  inline ? (
                    <code
                      className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code className="font-mono text-xs text-zinc-100" {...props}>
                      {children}
                    </code>
                  ),
                pre: ({ children, ...props }) => (
                  <pre
                    className="mb-4 overflow-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-100"
                    {...props}
                  >
                    {children}
                  </pre>
                ),
              }}
              className="prose prose-zinc max-w-none prose-pre:bg-zinc-900 prose-pre:text-zinc-100"
            >
              {docsContent}
            </ReactMarkdown>
          </div>
        </section>
      </div>
    </main>
  );
}
