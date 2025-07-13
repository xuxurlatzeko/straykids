
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCode: React.FC = () => {
    const [url, setUrl] = useState('');

    useEffect(() => {
        // We need to get the URL from the window object, which is only available client-side
        setUrl(window.location.href);
    }, []);

    if (!url) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-20 bg-white/90 p-3 rounded-lg shadow-lg backdrop-blur-sm transition-all hover:scale-105">
            <QRCodeSVG 
                value={url} 
                size={80} 
                bgColor={"#FFFFFF"} 
                fgColor={"#020617"}
                level={"L"}
                includeMargin={false}
            />
             <p className="text-xs text-center mt-1 text-slate-800 font-bold">¡Comparte!</p>
        </div>
    );
};

export default QRCode;
