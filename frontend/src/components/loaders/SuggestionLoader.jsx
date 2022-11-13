import React from 'react';
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

const SuggestionLoader = () => (
  <Card elevation={8}>
    <CardContent>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between" spacing={3}>
            <Grid item xs zeroMinWidth>
              <Skeleton variant="rectangular" height={20} />
            </Grid>
            <Grid item>
              <Skeleton variant="rectangular" height={20} width={20} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={20} />
            </Grid>
            <Grid item xs={11}>
              <Skeleton variant="rectangular" height={20} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={20} />
            </Grid>
            <Grid item xs={11}>
              <Skeleton variant="rectangular" height={20} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={20} />
            </Grid>
            <Grid item xs={11}>
              <Skeleton variant="rectangular" height={20} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
    <CardContent sx={{ p: 1.25, display: 'flex', pt: 0, justifyContent: 'center' }}>
      <Skeleton variant="rectangular" height={25} width={75} />
    </CardContent>
  </Card>
);

export default SuggestionLoader;
