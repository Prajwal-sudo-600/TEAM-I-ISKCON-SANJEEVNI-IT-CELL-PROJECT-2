import FadeIn from "../../components/motion/FadeIn";
import Button from "../../components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d')",
        }}
      />
      <div className="absolute inset-0 bg-[#FAFAF7]/85" />

      <FadeIn>
        <div className="relative max-w-3xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-stone-900">
            Room & Resource Allocation
          </h1>

          <p className="text-[#6B6B6B] text-lg">
            A peaceful, organized and divine way to manage rooms and resources
            for ISKCON Sanjivani.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Button>Get Started</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
