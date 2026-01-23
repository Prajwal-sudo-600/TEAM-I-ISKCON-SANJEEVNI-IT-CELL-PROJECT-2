export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4A300]/50";

  const variants = {
    primary:
      "bg-[#F4A300] text-white hover:bg-[#e09300] shadow-sm hover:shadow-md",

    outline:
      "border border-[#F4A300] text-[#F4A300] bg-transparent hover:bg-[#F4A300]/10",

    soft:
      "bg-[#F4A300]/10 text-[#F4A300] hover:bg-[#F4A300]/20",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
