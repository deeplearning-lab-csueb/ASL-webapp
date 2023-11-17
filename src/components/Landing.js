import * as React from "react";
import AppAppBar from "../views/AppAppBar";
import MainBanner from "../../src/views/MainBanner";
import withRoot from "../withRoot";
import AboutUs from "../../src/views/AboutUs";
import ProductHowItWorks from "../views/ProductHowItWorks";
import AppFooter from "../views/AppFooter";

const Landing = () => {
  const scrollTo = "services!";

  return (
    <React.Fragment>
      <AppAppBar myProp={scrollTo} />
      <MainBanner id="practise"/>
      <ProductHowItWorks   />
      <AboutUs id="try" />
      <AppFooter />
    </React.Fragment>
  );
};
export default withRoot(Landing);
