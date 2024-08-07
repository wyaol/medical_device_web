import { Select } from 'antd';
import React, { useEffect, useState } from 'react';

const PlusWaveReport = () => {
    useEffect(() => {
        
    }, [])

    return (<div>
        选择病人<Select options={[{ value: 'sample', label: <span>sample</span> }]} /><br/>
        选择采集时间段<Select options={[{ value: 'sample', label: <span>sample</span> }]} />
    </div>)
}

export default PlusWaveReport
