import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DashboardContent } from 'src/layouts/dashboard';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Grid } from '@mui/material';

export function OverviewAnalyticsView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <DashboardContent maxWidth="xl">
      <Grid
        container
        spacing={3}
        sx={{ minHeight: '80vh', alignItems: 'center', justifyContent: 'center', py: 4 }}
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Box textAlign="center" sx={{ maxWidth: '900px', mx: 'auto', px: 2 }}>
            {/* Main Heading */}
            <motion.div>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                  color: 'success.dark',
                  mb: 3,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Welcome to Bondy
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div>
              <Typography
                variant="h4"
                sx={{
                  color: 'success.main',
                  mb: 2,
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  letterSpacing: '-0.01em',
                }}
              >
                Connect. Share. Grow Together.
              </Typography>
            </motion.div>

            {/* Description */}
            <motion.div>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mb: 6,
                  maxWidth: '700px',
                  mx: 'auto',
                  fontWeight: 400,
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  lineHeight: 1.6,
                }}
              >
                Build meaningful connections, share your moments, and discover amazing content from
                your community
              </Typography>
            </motion.div>

            {/* Animated Icons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 3, sm: 5, md: 6 },
                mt: 6,
                flexWrap: 'wrap',
              }}
            >
              {[
                {
                  icon: <PeopleIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />,
                  label: 'Community',
                  subtitle: '1M+ Users',
                  delay: 0,
                  color: '#2563eb',
                },
                {
                  icon: <FavoriteIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />,
                  label: 'Engagement',
                  subtitle: '10M+ Likes',
                  delay: 0.2,
                  color: '#dc2626',
                },
                {
                  icon: <TrendingUpIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />,
                  label: 'Growing',
                  subtitle: '↑ 150% YoY',
                  delay: 0.4,
                  color: '#16a34a',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: item.delay,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                  whileHover={{
                    scale: 1.15,
                    rotate: 5,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 140, sm: 160, md: 180 },
                      height: { xs: 140, sm: 160, md: 180 },
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}25 100%)`,
                      border: `3px solid ${item.color}30`,
                      color: item.color,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: `0 20px 40px ${item.color}30`,
                        borderColor: item.color,
                      },
                    }}
                  >
                    <motion.div>
                      {item.icon}
                    </motion.div>
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 2,
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        opacity: 0.8,
                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                        fontWeight: 600,
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {/* Call to Action */}
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.2 }}
            >
              <Box sx={{ mt: 8 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                    fontStyle: 'italic',
                  }}
                >
                  Where every connection matters
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Grid>
    </DashboardContent>
  );
}
