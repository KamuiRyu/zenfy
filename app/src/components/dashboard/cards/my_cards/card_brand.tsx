import AlipayIcon from "@/assets/icons/alipay_icon";
import AmexIcon from "@/assets/icons/amex_icon";
import DinersIcon from "@/assets/icons/diners_icon";
import DiscoverIcon from "@/assets/icons/discover_icon";
import EloIcon from "@/assets/icons/elo_icon";
import HipercardIcon from "@/assets/icons/hipercard_icon";
import JcbIcon from "@/assets/icons/jcb_icon";
import MaestroIcon from "@/assets/icons/maestro_icon";
import MastercardIcon from "@/assets/icons/mastercard_icon";
import MirIcon from "@/assets/icons/mir_icon";
import PayPalIcon from "@/assets/icons/paypal_icon";
import UnionPayIcon from "@/assets/icons/unionpay_icon";
import VisaIcon from "@/assets/icons/visa_icon";

export function CardBrand({ brand }: { brand: string }) {
  switch (brand.toLowerCase()) {
    case "visa":
      return <VisaIcon className="absolute w-full h-full object-contain" />;
    case "mastercard":
    case "mc":
      return  <MastercardIcon className="absolute w-full h-full object-contain" />;
    case "alipay":
      return <AlipayIcon className="absolute w-full h-full object-contain" />;
    case "amex":
      return <AmexIcon className="absolute w-full h-full object-contain" />;
    case "diners":
      return <DinersIcon className="absolute w-full h-full object-contain" />;
    case "discover":
      return <DiscoverIcon className="absolute w-full h-full object-contain" />;
    case "elo":
      return <EloIcon className="absolute w-full h-full object-contain" />;
    case "hipercard":
      return <HipercardIcon className="absolute w-full h-full object-contain" />;
      
    case "jcb":
      return <JcbIcon className="absolute w-full h-full object-contain" />;
    case "maestro":
      return <MaestroIcon className="absolute w-full h-full object-contain" />;
    case "mir":
      return <MirIcon className="absolute w-full h-full object-contain" />;
    case "paypal":
      return <PayPalIcon className="absolute w-full h-full object-contain" />;
    case "unionpay":
      return <UnionPayIcon className="absolute w-full h-full object-contain" />;
    default:
      return null;
  }
}
