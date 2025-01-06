import { useContext } from "react";
import { MissingContext } from "../components/MissingContext";

const useMissing = () => {
  return useContext(MissingContext);
};

export default useMissing;
