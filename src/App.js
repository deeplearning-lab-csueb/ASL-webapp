import * as React from "react";
import withRoot from "./withRoot";
import Landing from "./components/Landing";
import Terms from "./Terms";
import { Route, Routes } from "react-router-dom";
import { HashRouter } from "react-router-dom";

const App = () => {
  return (
    <React.Fragment>
      {/* <HashRouter basename="/app">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </HashRouter> */}
      <Landing />
    </React.Fragment>
  );
};
export default withRoot(App);
