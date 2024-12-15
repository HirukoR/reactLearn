import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaChartBar, 
  FaCalendar, 
  FaClock,
} from 'react-icons/fa';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={30} color={color} style={{ opacity: 0.5 }} />
      </Box>
      <CardContent sx={{ width: '100%', p: 3 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const stats = [
    { icon: FaUsers, title: 'Пользователи', value: '1,234', color: '#2196f3' },
    { icon: FaChartBar, title: 'Продажи', value: '45.2K', color: '#4caf50' },
    { icon: FaCalendar, title: 'События', value: '28', color: '#f44336' },
    { icon: FaClock, title: 'Часы', value: '142', color: '#ff9800' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 4,
          }}
        >
          Панель управления
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Добро пожаловать!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Это ваша панель управления. Здесь вы можете видеть основную статистику и управлять вашим приложением.
                Используйте навигационное меню сверху для перехода между разделами.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Dashboard;
