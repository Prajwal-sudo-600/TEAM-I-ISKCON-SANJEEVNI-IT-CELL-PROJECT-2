import Button from "../../components/ui/Button";

export default function CTA() {
  return (
    <section className="py-28 px-6 bg-[#FBFAF6]">
      <div className="max-w-4xl mx-auto text-center bg-white rounded-3xl p-12 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-[#1f1f1f]">
          Serve with Order & Calm
        </h2>

        <p className="text-[#6B6B6B] max-w-xl mx-auto mb-8">
          A simple, respectful system designed to bring clarity and peace
          to room and resource management.
        </p>

        <Button className="hover:scale-[1.03] transition-transform duration-200">
          Start Now
        </Button>
      </div>
    </section>
  );
}
