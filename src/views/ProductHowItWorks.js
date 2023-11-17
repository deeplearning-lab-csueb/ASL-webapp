import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '../components/Button';
import Typography from '../components/Typography';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import WebcamRecorder from '../components/WebcamRecorder';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

const number = {
  fontSize: 24,
  fontFamily: 'default',
  color: 'secondary.main',
  fontWeight: 'medium',
};

const image = {
  height: 55,
  my: 4,
};

function ProductHowItWorks() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', bgcolor: 'white', overflow: 'hidden' }} id="services"
    >
      {/* <WebcamRecorder /> */}
      {/* <Container
        sx={{
          mt: 10,
          mb: 15,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src="/productCurvyLines.png"
          alt="curvy lines"
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            top: -180,
            opacity: 0.7,
          }}
        />
        <Typography variant="h4" marked="center" align="center" component="h2" sx={{ mb: 14 }}>
          Our Suit of Services
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <a style={{ textDecoration: "none" }} href="https://www.bravespaces.co/">
                <Card raised={true} sx={{ maxWidth: 345 }} >
                  <CardActionArea>
                    <CardMedia
                      sx={{
                        backgroundColor: "#FFF7ED",
                        height: 1,
                        width: 1,
                        padding: 3
                      }}
                      component="img"
                      image="/br_logo.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Brave Spaces
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Perform a Diagnostic Analysis of Diversity and Inclusion.Build a Blueprint to Reduce the Equity Gap or Celebrate Diversity and Inclusion.Track and Report on Equity, Diversity,  and Inclusion.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card></a>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card raised={true} sx={{ maxWidth: 345, minHeight: 250 }}>
                <CardActionArea>
                  <CardMedia
                    sx={{
                      backgroundColor: "#FFF7ED",
                      height: 1,
                      width: 1,
                      padding: 3,
                    }}
                    component="img"
                    image="/programmatics_logo.png"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Programmatics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Perform a Diagnostic Analysis of Diversity and Inclusion.Build a Blueprint to Reduce the Equity Gap or Celebrate Diversity and Inclusion.Track and Report on Equity, Diversity,  and Inclusion.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card raised={true} sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia
                    sx={{
                      backgroundColor: "#FFF7ED",
                      height: 1,
                      width: 1,
                      padding: 3
                    }}
                    component="img"
                    image="/sindex_logo.png"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      SIndex
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Perform a Diagnostic Analysis of Diversity and Inclusion.Build a Blueprint to Reduce the Equity Gap or Celebrate Diversity and Inclusion.Track and Report on Equity, Diversity,  and Inclusion.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </div>
      </Container> */}
    </Box>
  );
}

export default ProductHowItWorks;
