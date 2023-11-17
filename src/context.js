
import React, { createContext, useContext } from 'react';
const initialState = {
    ayushArray: [],
    user_name:"Ayush",
    censusData:[],
    
}


const DashboardContext = React.createContext(initialState);
export default DashboardContext;

