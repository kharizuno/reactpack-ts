import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Dashboard from '../../../components/dashboard';

export default function RouteDashboard() {

    const navigate = useNavigate();
    const params = useParams();

    const router = { navigate, params };

    return (
        <Dashboard {...router} />
    )
}