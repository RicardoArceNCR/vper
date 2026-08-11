const LOGOS = [
  "/images/058581a5717cc878bde460c427a08820637f41cc.webp",
  "/images/58f20cc742861e64ac9eff42647c2497669d62e7.webp",
  "/images/2f5a3defb32cc8d2415b610d85fcc1b7451f2685.webp",
  "/images/8aac8bcc118fb4e2162f62506814e0b5ce8785bc.webp",
  "/images/8e99c0c29c5e4b0a534fe85dc562c953a924dd41.webp",
  "/images/322cb2cf8948424318858f728938d61af328c612.webp",
  "/images/1ce7e57b2ba62dbf92d53a8e530c5994313bd7eb.webp",
];

// Sin hooks/motion: puede quedarse como server component.
export default function LogoTicker() {
  return (
    <section className="bg-background py-12 md:mb-16 overflow-hidden">
      <div className="flex w-[280%] md:w-[180%] lg:w-[150%]">
        <div className="flex items-center justify-around w-full animate-ticker py-2 gap-12 md:gap-16">
          {LOGOS.map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt="Client Logo"
              className="h-8 md:h-12 object-contain opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 filter brightness-200 contrast-75 px-2"
            />
          ))}
          {LOGOS.map((logo, idx) => (
            <img
              key={`dup-${idx}`}
              src={logo}
              alt="Client Logo"
              className="h-8 md:h-12 object-contain opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 filter brightness-200 contrast-75 px-2"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
