import { Outlet, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import LandingPage from "./pages/landing/LandingPage";
import DeckPage from "./pages/deck/DeckPage";
import DeltasPage from "./pages/deltas/DeltasPage";
import NewPage from "./pages/new/NewPage";

const StyledApp = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg);
`;

const Layout = () => {
  return (
    <StyledApp>
      <Outlet />
    </StyledApp>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />

        <Route path="deck">
          <Route index element={<DeckPage />} />
          <Route path=":deckId" element={<DeckPage />} />
        </Route>

        <Route path="deltas" element={<DeltasPage />} />

        <Route path="new" element={<NewPage />} />

        <Route path="*" element={<LandingPage />} />
      </Route>
    </Routes>
  );
};

export default App;
