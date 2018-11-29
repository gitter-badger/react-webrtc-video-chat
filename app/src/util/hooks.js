import { useState } from 'react';

export function useInput(initvalue='') {
    const [value, setValue] = useState(initvalue);

    const onChange = e => setValue(e.target.value);

    return {
        value,
        onChange,
    }
}
