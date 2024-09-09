import React, { Dispatch, SetStateAction } from 'react';
import * as styled from './HomePage.styles';
import { Navbar } from '../../components/Navbar';
import { Funcionario } from '../Funcionarios/Funcionarios';

interface HomePageProps {
    listaDeFuncionarios: Funcionario[];
    setListaDeFuncionarios: Dispatch<SetStateAction<Funcionario[]>>;
}

function HomePage(props: HomePageProps) {
    const {listaDeFuncionarios, setListaDeFuncionarios} = props;
      
    return(
        <styled.HomePageContainer>
            <Navbar />
            <div style={{fontSize: '2rem', width: '100%', textAlign: 'center', height: '300px', alignItems: 'center'}}><h2>Ainda to fazendo, aguenta aí</h2></div>
        </styled.HomePageContainer>
    );
}

export default HomePage;