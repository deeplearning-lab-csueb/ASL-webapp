import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from "../components/Typography";
import Thirsty from '../Thirsty.mp4';
import hungry from '../hungry.mp4';
import brother from '../brother.mp4';
import help from '../help.mp4';
import no from '../no.mp4';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import MovieClip from '../components/MovieClip';
import ListSubheader from '@mui/material/ListSubheader';

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
  const [chartType, setChartType] = React.useState('Aeroplane');
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleChange = (event) => {
    setChartType(event.target.value);
  };
  const chooseVideo = (name) => {
    switch (name) {
      case "Thirsty": return "_L2jHqSgpds"; break;
      case "Hungry": return "nzHSI34GIbQ"; break;
      case "Brother": return "VKDjD9Gq-hE"; break;
      // case "Help": return "HgRpq8gEnC8"; break;
      case "Hair": return "1cDVfYnnyeA"; break;
      case "Aeroplane": return "V8pj4-oxr2o"; break;
      case "No": return "Li3gtgJyyII"; break;
      case "Yes": return "c0P1sW02-Aw"; break;
      case "Up": return "fotnTKL9l7s"; break;
      case "Police": return "GNzp4-uBjKI"; break;
      case "High": return "dpC2IPJndYU"; break;
      case "Before": return "tSj76ol99JQ"; break;
      case "Giraffe": return "orRU3Ijv_mE"; break;
      case "Hello": return "xSYGBpalVTA"; break;
      default: return "V8pj4-oxr2o"; break; // Aeroplane
    }
  };

  return (
    <MainBannerLayoutRoot>

      <Typography variant="h4" marked="center" align="center" component="h2">
        PRACTICE
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", paddingTop: "1em" }}><MovieClip videoId={chooseVideo(chartType)}></MovieClip></Box>




      {/* <Box sx={{ display: "flex", justifyContent: "center", paddingTop: "1em" }}>
        <video src={chooseVideo(chartType)} autoPlay loop muted style={{ objectFit: 'contain', width: '70%', height: '10%', display: "block", boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}>
          Your browser does not support the video tag.
        </video></Box> */}
      {/* <Button onClick={handleOpen}>Show backdrop</Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}

      <Box sx={{ paddingTop: "1em", paddingBottom: "3em", display: "flex", justifyContent: "center" }}>
        <FormControl >
          <InputLabel id="demo-simple-select-label">ASL</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={chartType}
            label="Age"
            onChange={handleChange}
            sx={{ backgroundColor: "#3ab09e", color: "white", minWidth: '10em', display: 'flex', justifyContent: "center", alignContent: 'center' }}
          >
            <ListSubheader sx={{ fontFace: "bold", backgroundColor: "#3ab09e", color: "white",  display: 'flex', justifyContent: "center", alignContent: 'center' }}>EASY</ListSubheader>
            <MenuItem value={"Aeroplane"}>Aeroplane</MenuItem>
            <MenuItem value={"Before"}>Before</MenuItem>
            <MenuItem value={"Giraffe"}>Giraffe</MenuItem>
            <MenuItem value={"High"}>High</MenuItem>
            <MenuItem value={"Police"}>Police</MenuItem>
            <MenuItem value={"Up"}>Up</MenuItem>

            <ListSubheader sx={{ fontFace: "bold", backgroundColor: "#3ab09e", color: "white",  display: 'flex', justifyContent: "center", alignContent: 'center' }}>HARD</ListSubheader>
            <MenuItem value={"Brother"}>Brother</MenuItem>
            <MenuItem value={"Hair"}>Hair</MenuItem>
            <MenuItem value={"Hello"}>Hello </MenuItem>
            <MenuItem value={"Thirsty"}>Thirsty</MenuItem>
            <MenuItem value={"Hungry"}>Hungry</MenuItem>
            <MenuItem value={"No"}>No</MenuItem>
            <MenuItem value={"Yes"}>Yes</MenuItem>
            {/* <MenuItem value={"Help"}>Help  </MenuItem> */}
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
