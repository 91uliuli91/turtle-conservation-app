'use client';

import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  AddCircleOutline,
  MapOutlined,
  AnalyticsOutlined,
  Pets,
  EggOutlined,
  CalendarToday
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import Link from 'next/link';

export default function TurtleTrackDashboard() {
  // Componentes estilizados
  const DashboardContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4B8F8C 0%, #0F2A1F 100%)',
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }));

  const GradientCard = styled(Card)(({ theme }) => ({
    background: alpha(theme.palette.common.white, 0.1),
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    height: '100%',
    '&:hover': {
      transform: 'translateY(-8px)',
      background: alpha(theme.palette.common.white, 0.15),
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
    },
  }));

  const ActivityCard = styled(Card)(({ theme }) => ({
    background: alpha(theme.palette.common.white, 0.1),
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    width: '100%',
    maxWidth: 400,
  }));

  const activityData = [
    { icon: <Pets />, title: 'Avistamiento de Tortuga Verde', time: 'Hace 2 horas', location: 'Playa Norte' },
    { icon: <EggOutlined />, title: 'Liberación de crías exitosa', time: 'Ayer, 16:30', location: 'Playa Sur' },
    { icon: <CalendarToday />, title: 'Nuevo evento programado', time: 'Mañana, 08:00', location: 'Santuario' },
  ];

  return (
    <DashboardContainer>
      {/* Header simple con solo el avatar de usuario */}
      <Box sx={{ 
        position: 'absolute', 
        top: theme => theme.spacing(4), 
        right: theme => theme.spacing(4),
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar 
          sx={{ 
            width: 45, 
            height: 45,
            border: '2px solid rgba(255,255,255,0.2)',
            bgcolor: '#2dbf78'
          }}
        >
          U
        </Avatar>
      </Box>

      {/* Título principal */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(90deg, #ffffff, #2dbf78)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2
          }}
        >
          TurtleTrack
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Sistema de conservación de tortugas marinas
        </Typography>
      </Box>

      {/* Los 3 botones principales */}
      <Grid container spacing={3} sx={{ maxWidth: 900, mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Link href="/formulario" passHref style={{ textDecoration: 'none' }}>
            <GradientCard>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(45, 191, 120, 0.2)', 
                  color: '#2dbf78', 
                  width: 60, 
                  height: 60,
                  margin: '0 auto 16px'
                }}>
                  <AddCircleOutline fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                  Registrar Evento
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Registra nuevos avistamientos y eventos
                </Typography>
              </CardContent>
            </GradientCard>
          </Link>
        </Grid>

        <Grid item xs={12} md={4}>
          <Link href="/mapa" passHref style={{ textDecoration: 'none' }}>
            <GradientCard>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(75, 143, 140, 0.2)', 
                  color: '#4B8F8C', 
                  width: 60, 
                  height: 60,
                  margin: '0 auto 16px'
                }}>
                  <MapOutlined fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                  Ver Mapa
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Explora eventos en el mapa
                </Typography>
              </CardContent>
            </GradientCard>
          </Link>
        </Grid>

        <Grid item xs={12} md={4}>
          <Link href="/estadisticas" passHref style={{ textDecoration: 'none' }}>
            <GradientCard>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(45, 191, 120, 0.2)', 
                  color: '#2dbf78', 
                  width: 60, 
                  height: 60,
                  margin: '0 auto 16px'
                }}>
                  <AnalyticsOutlined fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                  Estadísticas
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Analiza datos de conservación
                </Typography>
              </CardContent>
            </GradientCard>
          </Link>
        </Grid>
      </Grid>

      {/* Contenedor de actividad reciente */}
      <ActivityCard>
        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
          Actividad Reciente
        </Typography>
        
        <List sx={{ py: 0 }}>
          {activityData.map((activity, index) => (
            <ListItem key={index} sx={{ px: 0, py: 2 }}>
              <ListItemAvatar>
                <Avatar sx={{ 
                  bgcolor: 'rgba(45, 191, 120, 0.2)', 
                  color: '#2dbf78' 
                }}>
                  {activity.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {activity.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {activity.time} • {activity.location}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </ActivityCard>
    </DashboardContainer>
  );
}