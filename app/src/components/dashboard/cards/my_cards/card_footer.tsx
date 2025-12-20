"use client";

export default function CardFooter({
  holderName,
  expiry,
}: {
  holderName?: string;
  expiry: string;
}) {
  const name = holderName ?? "CARD HOLDER";

  return (
    <div className="flex justify-between items-center mt-auto">
      <div className="flex flex-col items-start">
        <span className="text-[10px] opacity-80">CARD HOLDER</span>
        <span className="text-sm font-semibold mt-1 uppercase leading-tight">
          {name}
        </span>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-[10px] opacity-80">VALID</span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{expiry}</span>
        </div>
      </div>
    </div>
  );
}
