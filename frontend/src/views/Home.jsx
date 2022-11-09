import React from 'react';
import { PrivateWrapper, ComingSoon } from '../components/layouts';

const Home = () => (
  <PrivateWrapper pageName="Dashboard">
    <ComingSoon pageName="Dashboard" />
  </PrivateWrapper>
);

export default Home;
