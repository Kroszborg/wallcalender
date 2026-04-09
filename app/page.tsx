import { Calendar } from "@/components/calendar/Calendar"

export const metadata = {
  title: "Wall Calendar",
  description: "An interactive wall calendar with date range selection and notes",
}

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-start justify-center p-4 py-10 md:p-10 md:py-16"
      style={{
        backgroundColor: "#e8e0d4",
        backgroundImage: [
          // Dot grid
          "radial-gradient(circle, rgba(160,148,132,0.35) 1px, transparent 1px)",
          // Warm vignette corners
          "radial-gradient(ellipse at 0% 0%, rgba(220,205,185,0.8) 0%, transparent 45%)",
          "radial-gradient(ellipse at 100% 100%, rgba(200,188,168,0.7) 0%, transparent 45%)",
          "radial-gradient(ellipse at 50% 50%, rgba(232,224,212,0.5) 0%, transparent 70%)",
        ].join(", "),
        backgroundSize: "22px 22px, 100% 100%, 100% 100%, 100% 100%",
      }}
    >
      <Calendar />
    </main>
  )
}
