import { IoHome } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";
import { FaTruckMoving } from "react-icons/fa";
import { FaPeopleCarry } from "react-icons/fa";
import { FaMap } from "react-icons/fa6";
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import * as styled from './Navbar.styles';
import useNavbar from './Navbar.hook';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Home',
    key: 'home',
    icon: <IoHome />,
  },
  {
    label: 'Funcionarios',
    key: 'funcionarios',
    icon: <RiTeamFill />,
  },
  {
    label: 'Frota',
    key: 'veiculos',
    icon: <FaTruckMoving />,
  },
  {
    label: 'Serviços',
    key: 'servicos',
    icon: <FaPeopleCarry />,
  },
  {
    label: 'Mapa de Acompanhamento',
    key: 'mapa',
    icon: <FaMap />,
  },
];

function Navbar() {
    const {current, onClick} = useNavbar();
  
    return (
        <styled.NavbarContainer>
            <styled.Logo src="logo_amitran.png" alt="logo amitran" />
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{justifyContent: 'center'}}/>
        </styled.NavbarContainer>
    )
}

export default Navbar;