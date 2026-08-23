import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

// RTL needs this flag outside Jest or act() warns on every render.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
