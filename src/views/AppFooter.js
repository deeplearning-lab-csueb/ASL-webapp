import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import TextField from '../components/TextField';
import { Link as RouterLink } from "react-router-dom";
function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      <MuiLink color="inherit" href="https://mui.com/">
        Your Website
      </MuiLink>{' '}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const iconStyle = {
  width: 48,
  height: 48,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'warning.main',
  mr: 1,
  '&:hover': {
    bgcolor: 'warning.dark',
  },
};

const LANGUAGES = [
  {
    code: 'en-US',
    name: 'English',
  },
  {
    code: 'fr-FR',
    name: 'Français',
  },
];

export default function AppFooter() {
  return (
    <Typography
      component="footer"
      sx={{ display: 'flex', bgcolor: 'secondary.light' }}
    >
      <Container sx={{ my: 8, display: 'flex' }}>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              spacing={2}
              sx={{ height: 120 }}
            >
              <Grid item sx={{ display: 'flex' }}>
              </Grid>
              <Grid item>
                {/* <Typography variant="body2" color="textSecondary">
                  &copy; {new Date().getFullYear()} ASL learning
                </Typography>
                <Typography variant="caption">
                  <MuiLink href="https://popsign.org" rel="sponsored" title="Freepik">
                    Video Source:popsign.org
                  </MuiLink>
                </Typography> */}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" marked="left" gutterBottom>
              Legal
            </Typography>
            <Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0 }}>
              {/* <Box component="li" sx={{ py: 0.5 }}>
                <RouterLink to="/">Terms</RouterLink>
              </Box>
              <Box component="li" sx={{ py: 0.5 }}>
                <RouterLink to="/">Privacy</RouterLink>
              </Box> */}
              <Typography variant="body2" color="textSecondary">
                &copy; {new Date().getFullYear()} ASL learning
              </Typography>
              <Typography variant="caption">
                <MuiLink href="https://popsign.org" rel="sponsored" title="Freepik">
                  Video Source:popsign.org
                </MuiLink>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={8} md={4}>
            <Typography variant="h6" marked="left" gutterBottom>
              Language
            </Typography>
            <TextField
              select
              size="medium"
              variant="standard"
              SelectProps={{
                native: true,
              }}
              sx={{ mt: 1, width: 150 }}
            >
              {LANGUAGES.map((language) => (
                <option value={language.code} key={language.code}>
                  {language.name}
                </option>
              ))}
            </TextField>
          </Grid>
          {/* <Grid item>
            <Typography variant="caption">
              {'Icons made by '}
              <MuiLink href="https://www.freepik.com" rel="sponsored" title="Freepik">
                Freepik
              </MuiLink>
              {' from '}
              <MuiLink href="https://www.flaticon.com" rel="sponsored" title="Flaticon">
                www.flaticon.com
              </MuiLink>
              {' is licensed by '}
              <MuiLink
                href="https://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC 3.0 BY
              </MuiLink>
            </Typography>
            <Typography variant="caption">
              {' & Images used from '}
              <MuiLink href="https://www.pexels.com/" rel="sponsored" title="Freepik">
                pexels
              </MuiLink>
            </Typography>
          </Grid> */}

        </Grid>
      </Container>
    </Typography>
  );
}
