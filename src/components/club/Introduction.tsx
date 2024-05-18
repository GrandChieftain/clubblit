import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { getFields } from "@/lib/airtable";
import Image from "next/image";
import logo from "@/assets/FinanceTeam.png"
import Link from "next/link";
import ColorBadge from "./ColorBadge";
import { cn } from "@/lib/utils";

export default async function Introduction({ className }: { className?: string }) {
  const fields = await getFields();
  if (fields){
    const eligible = fields['Eligible'] === "Yes";
    const receiptCompliant = fields['Receipt Compliance'] === "Compliant";

    const alternativeFunding = ["Alternative Funding", "SAF Recipient"];
    const altStatus = alternativeFunding.includes(fields['DSO Status'] as string);
    const altReason = (fields['DSO Status'] === alternativeFunding[0] && "Your organization has been provided alternative funding routes through the DSO and is thus ineligble to receive club funding. ") || (fields['DSO Status'] === alternativeFunding[1] && "This organization receives funding from the Student Activities Fee and is thus ineligible to receive club funding. ");

    const invalidStatuses = ["Suspended", "Disbanded", "Not in Good Standing"];
    const dsoStatus = !invalidStatuses.includes(fields['DSO Status'] as string);
    const reason = !receiptCompliant && !dsoStatus ? `Your organization has not been compliant with receipt submissions and ${["has also been suspended by", "has also been disbanded by", "is also not in good standing with"][invalidStatuses.findIndex((element) => element === fields['DSO Status'] as string)]} the DSO.` :
    !receiptCompliant ? "Your organization has not been compliant with receipt submissions in the past. " : fields['DSO Status'] === invalidStatuses[0] ? "Your organization has been suspended by the DSO and is thus ineligible for club funding. " : fields['DSO Status'] === invalidStatuses[1] ? "Your organization has been disbanded by the DSO and is thus ineligible for club funding. " : fields['DSO Status'] === invalidStatuses[2] ? "Your organization is not in good standing with the DSO and is thus ineligible for club funding. " : "";

    const badge = <ColorBadge color={eligible ? "rgb(0, 255, 0)" : "rgb(236, 26, 35)"}>{!eligible && "Not "}Eligible</ColorBadge>;

    return (
      <Alert style={{ gridTemplateColumns: "64px 1fr" }} className={cn("grid gap-x-3 h-fit dark:bg-[#19191A] border-[#E4E4E7] dark:border-[#515152]", className)}>
        <div className="flex items-center justify-center w-16 h-full">
          <Image src={logo} alt="" width={64} height={64} />
        </div>
        <div className="flex flex-col justify-center">
          <AlertTitle>Your organization's current status: {badge}</AlertTitle>
          <AlertDescription>
            {eligible ? <span>As you apply for funding, feel free to give us <Link href="" className="text-[#0070E0]">feedback</Link> so that we can add more features and continue to improve the platform. Thank you!</span> :  altStatus ? altReason + 'Please reach out if you have any concerns.' : reason + 'Message a member of the HUA Finance Team to discuss resolving this issue.'}
          </AlertDescription>
        </div>
      </Alert>
    )
  }
  else return (
      <Alert className="flex gap-2 h-fit dark:bg-[#19191A] border-[#E4E4E7] dark:border-[#515152]">
        <div className="flex items-center justify-center w-16 h-full"><Image src={logo} alt="" width={64} height={64} /></div>
        <div className="flex flex-col justify-center">
            <AlertTitle>Welcome to Clubblit, the HUA's new club funding portal.</AlertTitle>
            <AlertDescription>
                Create or join an organization to partake in the club funding process!
            </AlertDescription>
        </div>
      </Alert>
    )
}