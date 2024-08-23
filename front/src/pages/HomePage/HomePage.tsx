import React from 'react';
import * as styled from './HomePage.styles';
import { Navbar } from '../../components/Navbar';

function HomePage() {
      
        return(
            <styled.HomePageContainer>
                <Navbar />
            </styled.HomePageContainer>
        );
}

export default HomePage;