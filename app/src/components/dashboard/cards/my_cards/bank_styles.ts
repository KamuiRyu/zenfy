export type BankStyle = { gradient: string; neutral: string } | null;

export function bankStylesFor(bankName?: string): BankStyle {
  if (!bankName) return null;
  switch (bankName.toLowerCase()) {
  case "nubank":
    return { gradient: "bg-gradient-to-br from-purple-700 to-purple-400 text-white", neutral: "bg-purple-50 text-purple-700" };
  case "itau":
    return { gradient: "bg-gradient-to-br from-orange-600 to-orange-400 text-white", neutral: "bg-orange-50 text-orange-700" };
  case "santander":
    return { gradient: "bg-gradient-to-br from-red-600 to-red-400 text-white", neutral: "bg-red-50 text-red-700" };
  case "bradesco":
    return { gradient: "bg-gradient-to-br from-red-700 to-red-500 text-white", neutral: "bg-red-50 text-red-700" };
  case "bancodobrasil":
  case "bb":
  case "banco do brasil":
    return { gradient: "bg-gradient-to-br from-yellow-400 to-yellow-200 text-black", neutral: "bg-yellow-50 text-yellow-800" };
  case "inter":
    return { gradient: "bg-gradient-to-br from-emerald-600 to-emerald-400 text-white", neutral: "bg-emerald-50 text-emerald-700" };
  default:
    return null;
  }
}
