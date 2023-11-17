import * as React from "react";
import withRoot from "./withRoot";
import Landing from "./components/Landing";
import Terms from "./Terms";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </React.Fragment>
  );
};
export default withRoot(App);
