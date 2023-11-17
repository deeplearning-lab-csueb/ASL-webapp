import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from "../components/Typography";

import dad from '../dad.mp4';
import mom from '../mom.mp4';
import thankyou from '../thankyou.mp4';
import help from '../help.mp4';
import please from '../please.mp4';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';


const MainBannerLayoutRoot = styled('section')(({ theme }) => ({
  color: theme.palette.common.white,
  position: 'relative',
  display: 'block',
  alignItems: 'center',
  [theme.breakpoints.up('xs')]: {
    // height: '120vh',
    // minHeight: 200,
    // maxHeight: 1300,
    paddingTop: "5em"
  },
}));

const Background = styled(Box)(({ opacity }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  zIndex: -2,
  opacity: opacity,
}));

function MainBannerLayout(props) {
  const { sxBackground, children, backgroundOpacity } = props;
  const [chartType, setChartType] = React.useState('Thankyou');

  const handleChange = (event) => {
    setChartType(event.target.value);
  };
  const chooseVideo = (name) => {
    switch (name) {
      case "Dad": return dad; break;
      case "Mom": return mom; break;
      case "Thankyou": return thankyou; break;
      case "Help": return help; break;
      case "Please": return please; break;
      default: return thankyou; break;
    }
  };

  return (
    <MainBannerLayoutRoot>
      <Typography variant="h4" marked="center" align="center" component="h2">
        PRACTICE 
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center",paddingTop: "1em" }}>
        <video src={chooseVideo(chartType)} autoPlay loop muted style={{ objectFit: 'contain', width: '70%', height: '10%', display: "block", boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}>
          Your browser does not support the video tag.
        </video></Box>
      <Box sx={{ paddingTop: "1em", paddingBottom: "3em", display: "flex", justifyContent: "center" }}>*Video Source:popsign.org 
        <FormControl >
          <InputLabel id="demo-simple-select-label">ASL</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={chartType}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={"Dad"}>Dad</MenuItem>
            <MenuItem value={"Please"}>Please </MenuItem>
            <MenuItem value={"Mom"}>Mom </MenuItem>
            <MenuItem value={"Thankyou"}>Thankyou  </MenuItem>
            <MenuItem value={"Help"}>Help  </MenuItem>
          </Select>
        </FormControl></Box>
    </MainBannerLayoutRoot>
  );
}

MainBannerLayout.propTypes = {
  children: PropTypes.node,
  sxBackground: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
  backgroundOpacity: PropTypes.number,
};

MainBannerLayout.defaultProps = {
  backgroundOpacity: 0.6, // Default opacity value of 0.5 (adjust as needed)
};

export default MainBannerLayout;
