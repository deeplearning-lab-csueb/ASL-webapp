import * as React from "react";
import Button from "../components/Button";
import Typography from "../components/Typography";
import MainBannerLayout from "./MainBannerLayout";
import Box from "@mui/material/Box";
import { animated, useTrail, config } from "react-spring";

const AnimatedHeadings = ({ headings }) => {
  const trail = useTrail(headings.length, {
    from: { opacity: 0, transform: "translateX(100%)" },
    to: { opacity: 1, transform: "translateX(0)", color: "#69696a" },
    config: config.slow,
    delay: 500, // Delay between each heading
  });

  return (
    <div style={{ fontSize: "1.2em" }}>
      {trail.map((styles, index) => (
        <animated.p style={styles}>{headings[index]}</animated.p>
      ))}
    </div>
  );
};

const backgroundImage = "/diversity_image.jpg";

export default function MainBanner() {
  return (<>
    <Box
      component="section"
      id="practise"
    > <MainBannerLayout>
      </MainBannerLayout>
    </Box>
  </>
  );
}
