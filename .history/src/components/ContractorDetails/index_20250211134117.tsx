import { notFound } from "next/navigation";
import ContractorDisplay from "./contractor";
import { getContractor } from "@/actions/contractorActions";



export default async function ContractorDetails({ contractorId }: { contractorId: string }) {
  const contractor = await getContractor(contractorId);
  if ("error" in contractor) {
    notFound();
  }

  return <ContractorDisplay contractor={contractor} benefits={contractor.benefits} taxes={contractor.appliedTaxes} contracts={contractor.contractsTerms}/>
   
}
