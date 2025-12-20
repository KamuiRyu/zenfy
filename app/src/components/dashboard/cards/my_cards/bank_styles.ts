export type BankStyle = { gradient: string; neutral: string } | null;

export function bankStylesFor(bankName?: string): BankStyle {
  if (!bankName) return null;
  switch (bankName. toLowerCase()) {
  case "nubank":
    return { gradient:  "bg-gradient-to-br from-purple-700 to-purple-400 text-white", neutral: "bg-purple-50 text-purple-700" };
  case "itau": 
  case "itaú":
    return { gradient: "bg-gradient-to-br from-orange-600 to-orange-400 text-white", neutral: "bg-orange-50 text-orange-700" };
  case "santander":
    return { gradient: "bg-gradient-to-br from-red-600 to-red-400 text-white", neutral: "bg-red-50 text-red-700" };
  case "bradesco":
    return { gradient: "bg-gradient-to-br from-red-700 to-red-500 text-white", neutral: "bg-red-50 text-red-700" };
  case "bancodobrasil":
  case "bb": 
  case "banco do brasil": 
    return { gradient: "bg-gradient-to-br from-yellow-400 to-yellow-200 text-black", neutral:  "bg-yellow-50 text-yellow-800" };
  case "inter":
    return { gradient: "bg-gradient-to-br from-orange-500 to-orange-300 text-white", neutral: "bg-orange-50 text-orange-700" };
  case "caixa":
  case "caixa econômica":
  case "caixa economica":
    return { gradient:  "bg-gradient-to-br from-blue-700 to-blue-500 text-white", neutral: "bg-blue-50 text-blue-700" };
  case "c6":
  case "c6 bank": 
  case "c6bank":
    return { gradient: "bg-gradient-to-br from-gray-800 to-gray-600 text-white", neutral: "bg-gray-50 text-gray-700" };
  case "sicredi":
    return { gradient: "bg-gradient-to-br from-green-700 to-green-500 text-white", neutral: "bg-green-50 text-green-700" };
  case "picpay":
    return { gradient: "bg-gradient-to-br from-green-500 to-green-300 text-white", neutral: "bg-green-50 text-green-700" };
  case "next":
    return { gradient: "bg-gradient-to-br from-green-600 to-green-400 text-white", neutral: "bg-green-50 text-green-700" };
  case "neon":
    return { gradient:  "bg-gradient-to-br from-blue-500 to-cyan-400 text-white", neutral: "bg-blue-50 text-blue-700" };
  case "original":
  case "banco original":
    return { gradient: "bg-gradient-to-br from-green-600 to-green-400 text-white", neutral: "bg-green-50 text-green-700" };
  case "safra":
  case "banco safra":
    return { gradient: "bg-gradient-to-br from-blue-900 to-blue-700 text-white", neutral: "bg-blue-50 text-blue-900" };
  case "btg":
  case "btg pactual":
    return { gradient: "bg-gradient-to-br from-blue-900 to-blue-800 text-white", neutral: "bg-blue-50 text-blue-900" };
  case "will":
  case "will bank":
    return { gradient:  "bg-gradient-to-br from-yellow-500 to-yellow-300 text-black", neutral: "bg-yellow-50 text-yellow-800" };
  case "mercadopago":
  case "mercado pago":
    return { gradient: "bg-gradient-to-br from-blue-400 to-blue-200 text-white", neutral: "bg-blue-50 text-blue-600" };
  case "pagseguro":
  case "pagbank":
    return { gradient: "bg-gradient-to-br from-green-500 to-green-300 text-white", neutral: "bg-green-50 text-green-700" };
  case "banrisul":
    return { gradient: "bg-gradient-to-br from-blue-600 to-blue-400 text-white", neutral: "bg-blue-50 text-blue-700" };
  case "votorantim":
    return { gradient: "bg-gradient-to-br from-orange-700 to-orange-500 text-white", neutral: "bg-orange-50 text-orange-700" };
  default:
    return null;
  }
}