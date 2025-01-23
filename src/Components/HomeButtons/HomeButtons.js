

import React from "react";
import { useNavigate } from "react-router-dom";

const HomeButtons = () => {

    const navigate = useNavigate();
    return (
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <div className="d-flex flex-column align-items-center">
                    <button className="btn btn-primary btn-lg mb-3" style={{ width: '350px' }}
                        onClick={() => navigate('/manifest')}
                    >
                        1 - Conferir por caixa fechada
                    </button>
                    <button className="btn btn-secondary btn-lg" style={{ width: '350px' }}>
                        2 - Conferir volume a volume
                    </button>
                </div>
            </div>
        </div>

    )
}

export default HomeButtons; 