import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Container from "@mui/material/Container";
import Typography from "../components/Typography";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function BuildingCapacity() {
  return (
    <Container
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        my: 9,
      }}
    >
      <Typography variant="h4" marked="center" align="center" component="h2">
        Building Capacity
      </Typography>
      <div
        style={{
          overflowX: "auto",
          maxHeight: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src="/Building_Capacity.png"
          alt="CEO"
          sx={{
            m: 2,
            maxWidth: "80%",
          }}
        />
      </div>
    </Container>
  );
}
