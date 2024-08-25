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
        </styled.HomePageContainer>
    );
}

export default HomePage;