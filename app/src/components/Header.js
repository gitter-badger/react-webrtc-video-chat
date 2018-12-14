import React from 'react';

import Navbar from './Navbar';
import UserSelector from './UserSelector';

export default function Header() {
    return (
        <React.Fragment>
            <Navbar />
            <UserSelector />
        </React.Fragment>
    );
}
