import React, { useState, useMemo, ChangeEvent } from "react";
import { toast } from "sonner";
import { Address } from "wagmi";
import FriendtechContainer from "../containers/FriendtechContainer";
import useApproveAllowance from "../hooks/erc20/useApproveAllowance";
import useTokenData from "../hooks/erc20/useTokenData";
import useFriendtechData from "../hooks/friendtech/useFriendtechData";
import useApproveAirdrop from "../hooks/erc20/useApproveAirdrop";
import { AirdropRecipient, IAirdropEthProps } from "../types/airdrop";
import { ModalSelector } from "../types/modals";
import { recipientsParser } from "../types/parsers";
import { formatUnits } from "viem";

export default function Friendtech(props: IAirdropEthProps) {
  const { contractAddress = null, setSelected, setContractAddress } = props;

  // tokenAddress is the contract token address (e.g. the WETH contract)
  const [tokenAddress, setTokenAddress] = useState<Address>(
    (contractAddress as Address) || ""
  );
  const [recipients, setRecipients] = useState<[string, string][]>([]);
  const [openModal, setOpenModal] = useState<ModalSelector | false>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | false>(false);
  const [errorMessage, setErrorMessage] = useState<string | false>(false);

  const pattern = useMemo(() => /^0x[a-fA-F0-9]{40}$/, []);

  const displayMessage = (message: string, type?: "success" | "error") => {
    const errorMsg = type === "error" ? message : false;
    setErrorMessage(errorMsg);

    const loadingMsg = type === "error" ? false : message;
    setLoadingMessage(loadingMsg);

    type === "success" || type === "error"
      ? toast[type](message)
      : toast(message);
  };

  const displayModal = () => {
    setOpenModal("confirm");
    setLoadingMessage(false);
    setErrorMessage(false);
  };

  const { holders } = useFriendtechData(tokenAddress);

//   const parsedRecipients = useMemo(() => {
//     try {
//       return (
//         recipients.length
//           ? recipientsParser(tokenDecimals).parse(recipients)
//           : []
//       ) as AirdropRecipient[];
//     } catch (e) {
//       displayMessage((e as Error).message, "error");
//       return [] as AirdropRecipient[];
//     }
//   }, [tokenDecimals, recipients]);

  // low-priority todo: improve the typing without casting
//   const totalAllowance = useMemo(() => {
//     return parsedRecipients.reduce((acc: BigInt, { amount }) => {
//       const a = BigInt(acc.toString());
//       const b = BigInt(amount.toString());

//       return a + b;
//     }, BigInt(0));
//   }, [parsedRecipients]);

//   const { write: airdropWrite } = useApproveAirdrop(
//     tokenAddress,
//     parsedRecipients,
//     () => displayMessage("Airdrop transaction pending..."),
//     function onSuccess() {
//       displayMessage("Airdrop transaction successful!", "success");
//       setOpenModal("congrats");
//     },
//     function onError(error) {
//       displayMessage(error, "error");
//     }
//   );

//   const { allowance, write: approveWrite } = useApproveAllowance(
//     tokenAddress,
//     totalAllowance,
//     () => displayMessage("Approval transaction pending..."), // on Pending
//     function onSuccess() {
//       displayMessage("Approval transaction submitted!", "success");
//       airdropWrite?.();
//     },
//     function onError(error) {
//       displayMessage(error, "error");
//     }
//   );

//   // Switch over to ERC-721 if the contract entered is a 721
//   if (isERC721) {
//     setContractAddress?.(tokenAddress);
//     setSelected("ERC721");
//     return null;
//   }

  const handleTokenAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    if (rawInput.length > 42) return;

    const address = rawInput as Address;
    setTokenAddress(address);
    setContractAddress?.(address);

    if (!pattern.test(rawInput)) {
      setSelected("UNSET");
    }
  };

  const resetForm = () => {
    setSelected("UNSET");
    setRecipients([]);
    setContractAddress?.("");
  };

  return (
    <FriendtechContainer
      holders={holders}
      errorMessage={errorMessage}
      isERC721={false}
      loadingMessage={loadingMessage}
      openModal={openModal}
      displayModal={displayModal}
      handleTokenAddressChange={handleTokenAddressChange}
      resetForm={resetForm}
      setErrorMessage={setErrorMessage}
      setOpenModal={setOpenModal}
      setRecipients={setRecipients}
    />
  );
}
