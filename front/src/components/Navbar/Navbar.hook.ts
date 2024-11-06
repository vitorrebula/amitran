import { MenuProps } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useNavbar(){
    const location = useLocation();
    const [current, setCurrent] = useState('mail');
    const navigate = useNavigate();
    
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        navigate(`/${e.key}`);
    };

    useEffect(() => {
        if(location.pathname.includes('funcionarios')){
            setCurrent('funcionarios');
        }else if(location.pathname.includes('veiculos')){
            setCurrent('veiculos');
        }else if(location.pathname.includes('servicos')){
            setCurrent('servicos');
        }else{
            setCurrent('home');
        }
    }, [location]);

    return{
        onClick,
        current
    };
}

export default useNavbar;