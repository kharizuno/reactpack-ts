import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';

import ErrorPage from './util/errorPage';

import RouteApp from './route/app';
import RouteDashboard from './route/dashboard';

export function RoutePage() {
    let element = useRoutes([
        { 
            path: "/", 
            element: <RouteApp />,
            errorElement: <ErrorPage />
        },
        { 
            path: "/dashboard/:id?", 
            element: <RouteDashboard /> 
        },
    ]);

    return element;

    // return (
    //     <Routes>
    //         <Route path="/" element={<AppTest router={router} />} />
    //         <Route path="/test" element={<Layout router={router} />} />
    //     </Routes>
    // );
}

export default function Router() {
    return (
        <BrowserRouter>
            <RoutePage />
        </BrowserRouter>
    );
}
