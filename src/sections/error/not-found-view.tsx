import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <>
      <Container
        sx={{
          py: 10,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Số 404 lớn */}
        <Typography
          variant="h1"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: '#0ba84a',
            fontSize: { xs: '80px', md: '120px' },
          }}
        >
          404
        </Typography>

        <Typography variant="h3" sx={{ mb: 2 }}>
          Oops! Page not found
        </Typography>

        <Typography sx={{ color: 'text.secondary', maxWidth: 480, textAlign: 'center', mb: 3 }}>
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
          sure to check your spelling.
        </Typography>

        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
          sx={{ backgroundColor: '#0ba84a', '&:hover': { backgroundColor: '#0a973f' } }}
        >
          Go to home
        </Button>
      </Container>
    </>
  );
}
