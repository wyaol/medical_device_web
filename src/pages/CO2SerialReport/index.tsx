import {Button, message, Select} from 'antd';
import React, {useEffect, useState, useCallback} from 'react';
import {getAllDataCollectionPeriods} from '../../service/plusWaveService';

const CO2SerialReport = () => {
    const [dataCollectionPeriods, setDataCollectionPeriods] = useState([]);
    const [periodId, setPeriodId] = useState<number | null>(null);
    useEffect(() => {
        getAllDataCollectionPeriods()
            .then(periods => {
                setDataCollectionPeriods(periods);
            })
            .catch((error: Error) => {
                message.error('获取采集时间段失败: ' + error.message);
            });
    }, []);
    const genResult = useCallback(() => {
        if (periodId === null) {
            message.warning('请先选择一个采集时间段');
            return;
        }
    }, [periodId]);
    return (
        <div>
            <div className="select-container">
                <label>选择采集时间段: </label>
                <Select
                    className="select-dropdown"
                    onChange={(value) => setPeriodId(value)}
                    options={dataCollectionPeriods.map(item => ({
                        value: item['id'],
                        label: `${item['start_time']} - ${item['end_time']}`
                    }))}
                    placeholder="请选择时间段"
                />
            </div>
            <Button type="primary" onClick={genResult} className="generate-report-button">
                生成报告
            </Button>
        </div>
    );
};

export default CO2SerialReport;