import Button from "../../components/ui/Button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#FBFAF6]/90 backdrop-blur border-b border-[#EAE7DF]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand */}
        <h1 className="text-lg font-semibold text-[#1f1f1f]">
          ISKCON Sanjivani
        </h1>

        {/* Right Side */}
        <div className="flex items-center gap-8 text-sm text-[#6B6B6B]">
          <a href="#stats" className="hover:text-[#F4A300] transition">
            Overview
          </a>
          <a href="#flow" className="hover:text-[#F4A300] transition">
            Process
          </a>
          <a href="#preview" className="hover:text-[#F4A300] transition">
            Preview
          </a>

          {/* Login Button – SAME AS START NOW */}
          <Button className="px-5 py-2">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
