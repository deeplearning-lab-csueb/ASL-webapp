import * as React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import AppBar from "../components/AppBar";
import Toolbar from "../components/Toolbar";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
// import ASLlogo from '../asllogo.png'
const rightLink = {
  fontSize: 16,
  // color: "common.black",
  ml: 3,
};

const AppAppBar = (props) => {
  const myPropValue = props.myProp;
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <section>
      {/* <AppBar position="fixed" sx={{ backgroundColor: 'white' }} > */}
      <AppBar
        position="fixed"
        sx={{
          // backgroundColor: "white",
          display: "block",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 7px 50px 0 rgba(0,0,0,0.2)",
          padding: "0em 0em 0.1em 0em",
          height:"7%"
        }}
      >
        <Toolbar sx={{ justifyContent: "center", alignItems: "center" }}>
          <Box sx={{ flex: 1, display: "flex", height:"10vh" }}>
            {/* <Link
              variant="h6"
              underline="none"
              color="inherit"
              sx={{ fontSize: 24, display: "flex" }}
              href="/"
            > */}
              <img
                src="/ASL-webapp/asllogo.png"
                alt="asl logo"
                // style={{ width: "40vh", height: "10vh" }}
                style={{ display: "flex", maxWidth: "50%", minWidth: "5em" }}
              />
              {/* <ASLlogo/> */}
            {/* </Link> */}
          </Box>
          {isDesktop ? (
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <Link
                color="primary"
                href="#practice"
                variant="h6"
                underline="none"
                sx={rightLink}
              >
                {"Practise"}
              </Link>
              <Link
                color="primary"
                variant="h6"
                underline="none"
                sx={rightLink}
                href="#try"
              >
                {"Try"}
              </Link>
              {/* <Link
                variant="h6"
                color="primary"
                underline="none"
                sx={rightLink}
                href="#client"
              >
                {"Client"}
              </Link> */}
            </Box>
          ) : (
            <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
              <img alt="menu-icon" src="/menu-icon.png" />
            </button>
          )}

          {!isDesktop && isMenuToggled && (
            <div
              style={{
                position: "fixed",
                right: 0,
                bottom: 0,
                height: "100%",
                width: "300px",
                flexDirection: "column",
                display: "block",
                opacity: "1",
                backgroundColor: "#FFF7ED",
              }}
            >
              {/* Content of the new div */}
              <div style={{ position: "absolute", top: 0, right: 0 }}>
                <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
                  <img alt="close-icon" src="/close.png" />
                </button>
              </div>

              <div style={{ marginTop: "2rem" }}>
                <div
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Link
                    color="primary"
                    href="#practise"
                    variant="h6"
                    underline="none"
                    sx={rightLink}
                  >
                    {"Practise"}
                  </Link>
                </div>
                <div
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <Link
                    color="primary"
                    variant="h6"
                    underline="none"
                    sx={rightLink}
                    href="#try"
                  >
                    {"Try"}
                  </Link>
                </div>
                {/* <div
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Link
                    variant="h6"
                    color="primary"
                    underline="none"
                    sx={rightLink}
                    href="#client"
                  >
                    {"Client"}
                  </Link>
                </div> */}
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </section>
  );
};

export default AppAppBar;
