import { MenuProps } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function useNavbar(){
    
    const [current, setCurrent] = useState('mail');
    const navigate = useNavigate();
    
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        navigate(`/${e.key}`);
    };

    return{
        onClick,
        current
    };
}

export default useNavbar;