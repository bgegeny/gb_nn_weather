import React from 'react';
import {
    BrowserRouter, Routes, Route, Navigate,
} from "react-router-dom";
import Main from "./ui/Main";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/weather" element={<Main />} />
                <Route path="*" element={<Navigate to="/weather" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
