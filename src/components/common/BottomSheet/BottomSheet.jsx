import react from 'react';
import { useScreenMode } from '../../../scripts/useScreenMode.js';
import BottomSheetMobile from './BottomSheetMobile.jsx';
import BottomSheetDesktop from './BottomSheetDesktop.jsx';

export default function BottomSheet(props){
    const { isDesktop, isMobile } = useScreenMode();
    console.log(isDesktop, isMobile);
    if(isDesktop){
        //return(<BottomSheetDesktop {...props}/>);
    }else{
        return(<BottomSheetMobile {...props} />);
    }
    
}