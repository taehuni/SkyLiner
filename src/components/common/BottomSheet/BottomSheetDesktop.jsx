import React from 'react';
import './BottomSheetDesktop.css';

export default function BottomSheetDesktop({ firstContent, secondContent }){
    return(
        <div className="bottomsheet-root">
            <div className="bottomsheet-header-container">
                <div></div>
            </div>
            <div className="bottomsheet-body-container">
                <div className="body-first-container">
                    {firstContent}
                </div>
                <div className="body-second-container">
                    {secondContent}
                </div>
            </div>
        </div>
    );
}
