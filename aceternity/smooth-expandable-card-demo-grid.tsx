"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useOutsideClick } from "@/hooks/use-outside-click"

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(null)
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false)
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src || "/placeholder.svg"}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex justify-between items-start p-4 flex-shrink-0">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white flex-shrink-0"
                    rel="noreferrer"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="flex-1 min-h-0 px-4 pb-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-full overflow-y-auto dark:text-neutral-400 pr-2 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent"
                    style={{
                      maxHeight: "calc(90vh - 400px)", // Dynamic height based on viewport
                      minHeight: "200px",
                    }}
                  >
                    {typeof active.content === "function" ? active.content() : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col w-full">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src || "/placeholder.svg"}
                  alt={card.title}
                  className="h-60 w-full rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  )
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

  const blogs = [
    {
      title: "Netflix",
      description:
        "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
      link: "https://netflix.com",
      author: "Agam Dubey",
    },
    {
      title: "Google",
      description:
        "A multinational technology company that specializes in Internet-related services and products.",
      link: "https://google.com",
      author: "Agam Dubey",
    },
    {
      title: "Meta",
      description:
        "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
      link: "https://meta.com",
      author: "Agam Dubey",
    },
    {
      title: "Amazon",
      description:
        "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
      link: "https://amazon.com",
      author: "Agam Dubey",
    },
    {
      title: "Microsoft",
      description:
        "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
      link: "https://microsoft.com",
      author: "Agam Dubey",
    },
  ];
const cards = [
  {
      title: "Art of managing cloud disk space",
      description:
        "Effective VM disk management",
      src: "https://images.unsplash.com/photo-1730578726048-b8f118d227e4",
      ctaText: "Find out more",
      ctaLink: "/",
      content: () => {
        return (
          <p>
  When I think about managing disk space on cloud VMs, I often compare it to keeping a small apartment tidy. 
  You don’t have unlimited space, so if you let things pile up—old clothes, unused boxes, random papers—you’ll 
  suddenly find yourself with no room to move. Disks on VMs are no different. If we don’t manage what goes in 
  and out, one day the system just refuses to work because it’s run out of space.
  <br /><br />
  <strong>1. Rotate logs, don’t hoard them</strong><br />
  Applications love to generate logs, but storing them endlessly on the VM is like never throwing out your 
  daily newspapers. After a point, they take over the entire living room. Using log rotation means older logs 
  get neatly packed away (zipped up), and you only keep a manageable set locally.
  <br /><br />
  <strong>2. Archive instead of delete</strong><br />
  Just because you don’t want the old newspapers at home doesn’t mean you throw them in the fire. You send 
  them to storage. Similarly, once logs are rotated and zipped, I prefer archiving them to blob/object storage. 
  It’s cheaper, safer, and if you ever need them for audits or debugging, they’re still there.
  <br /><br />
  <strong>3. Alerts are like smoke alarms</strong><br />
  No matter how careful you are, things can still pile up. That’s why I always set alerts in the monitoring 
  system to warn me when disk usage crosses a threshold. My comfort zone is a warning at <strong>15% space left</strong>. 
  It’s like the smoke alarm beeping before the kitchen actually catches fire—it gives me time to act before 
  production workloads are disrupted.
  <br /><br />
  <strong>4. Apply it everywhere, not just production</strong><br />
  It’s tempting to think disk management matters only in production. But dev and QA environments are just as 
  capable of filling up and breaking unexpectedly. I’ve learned that applying the same hygiene across 
  environments saves me from “surprise outages” when I least expect them.
  <br /><br />
  In the end, managing cloud VM disk space isn’t about complicated tooling—it’s about discipline. 
  <strong>Rotate, archive, and alert.</strong> Keep your digital apartment clean, and it will serve you well.
</p>
        );
      },
    },
    {
    title: "The Gift of Open Source",
    description: "Collaboration Fuels Collective Progress",
    src: "https://images.unsplash.com/photo-1569017388730-020b5f80a004",
    ctaText: "Find out more",
    ctaLink: "/",
    content: () => (
      <p>
        Open source has been one of the greatest forces driving software
        engineering forward. It’s a living example of what happens when people
        across the world share their ideas, fix each other’s problems, and create
        tools that make life easier for everyone else. Entire industries run on
        open source — from programming languages to frameworks to infrastructure
        tools — and it continues to evolve because of this collective energy.
        <br />
        <br />
        For me personally, being able to contribute to projects like Strapi and
        Parlant was both motivating and humbling. It reminded me that no matter
        how small your contribution may feel, it can make a difference for
        someone else down the line. And beyond code, open source is about
        learning how to collaborate, review, and improve together. It’s a culture
        of generosity and shared growth.
        <br />
        <br />
        Reflecting on it, open source isn’t just a model of software development
        — it’s a model of community. It teaches us that progress doesn’t come
        from working in isolation, but from building with and for others.
      </p>
    ),
  },
  {
    title: "Availability vs Scalability",
    description: "Two Pillars of Reliability",
    src: "https://images.unsplash.com/photo-1670270103229-9a999f368bba",
    ctaText: "Find out more",
    ctaLink: "/",
    content: () => (
      <p>
        In software engineering, <strong>availability</strong> and{" "}
        <strong>scalability</strong> are two concepts that often get mentioned
        together, but they solve different problems. Availability is about
        keeping a system up and running — like a shop that never closes its
        doors. Scalability, on the other hand, is about handling growth — like
        adding more counters when a crowd shows up, so customers don’t have to
        wait in line.
        <br />
        <br />
        Technically speaking, availability is ensured through redundancy,
        failover systems, and monitoring. It’s about minimizing downtime and
        making sure the system can be trusted to respond when needed.
        Scalability comes into play when demand grows: you add more servers,
        introduce load balancers, or use clustering to spread the workload
        efficiently.
        <br />
        <br />
        Both are essential, and they work hand-in-hand. A highly available system
        that can’t scale will crumble under pressure, while a scalable system
        that isn’t available is practically useless. Thinking about both together
        — especially in cloud-native environments — helps design systems that are
        resilient, adaptable, and user-friendly. It’s not about choosing one over
        the other, but balancing both depending on what the workload demands.
      </p>
    ),
  },
  {
    title: "Documentation is a Superpower",
    description: "Read, Understand, Solve Better",
    src: "https://images.unsplash.com/photo-1606327054581-0a1d4bf42831",
    ctaText: "Find out more",
    ctaLink: "/",
    content: () => (
      <p>
        In the age of AI, it’s easy to forget how powerful reading{" "}
        <strong>documentation</strong> really is. AI can suggest quick fixes or
        give summaries, but true understanding often comes from going straight to
        the source: the official docs. I’ve learned that being able to read and
        interpret documentation is still one of the most valuable skills a
        developer can have.
        <br />
        <br />
        One example from my own experience was with Parlant. Instead of leaning
        on AI to guess answers, I dove into the code and documentation directly.
        It immediately clicked, and I understood the system far better. On top of
        that, I reached out to the founders and joined their community on Discord
        — and that gave me insights no AI could provide.
        <br />
        <br />
        To younger developers, my advice is simple: don’t skip the docs. AI can
        be a shortcut, but shortcuts won’t always help when you face something
        truly complex. Learning to read documentation trains your problem-solving
        skills, teaches you how a system was designed, and gives you the
        confidence to tackle challenges with clarity. In the long run, it’s the
        skill that separates good developers from great ones.
      </p>
    ),
  }
];
