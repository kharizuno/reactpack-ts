import React from 'react';
import { useLocation, useNavigate, useMatch, useParams } from 'react-router-dom';

import App from '../../../components/App';

export default function RouteApp() {

    const navigate = useNavigate();
    const location = useLocation();

    const match = useMatch(location.pathname);
    const params = useParams();

    const router = { match, location, navigate, params };

    return (
        <App {...router} />
    )
}