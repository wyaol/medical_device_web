import {Button, message, Select} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import {getAllDataCollectionPeriods, getCO2DataRecordPresignedUrl} from '../../service/co2DataService';
import rrwebPlayer from 'rrweb-player';
import {getObjectByPresignedUrl} from '../../service/objectStoreService'
import {getCO2RecordMinioObjectName} from "../../utils";
import Gzip from 'gzip-js';

const decompressorEvents = async (blob: Blob) => {
    try {
        const arrayBuffer = new Uint8Array( await blob.arrayBuffer());
        const decompressedData = Gzip.unzip(arrayBuffer);
        const decompressedString = new TextDecoder().decode(new Uint8Array(decompressedData));
        return JSON.parse(decompressedString);
    } catch (error) {
        console.error('Error decompressing events:', error);
        return null;
    }
}
const CO2DataReport = () => {
    const recordContainer = document.querySelector('.co2-record-container') as HTMLElement;
    const [dataCollectionPeriods, setDataCollectionPeriods] = useState([]);
    const [filePath, setFilePath] = useState<string>('');
    useEffect(() => {
        getAllDataCollectionPeriods()
            .then(periods => {
                setDataCollectionPeriods(periods);
            })
            .catch((error: Error) => {
                message.error('获取采集时间段失败: ' + error.message);
            });
    }, []);
    const genResult = useCallback(async () => {
        if (filePath === null) {
            message.warning('请先选择一个采集时间段');
            return;
        }
        const presignedUrl = await getCO2DataRecordPresignedUrl(filePath);
        console.log("presignedUrl:", presignedUrl)
        const recordBlob: Blob = await getObjectByPresignedUrl(presignedUrl);
        console.log("blob:", recordBlob);
        const events = await decompressorEvents(recordBlob);
        console.log("de:", events);
        const player = new rrwebPlayer({
            target: recordContainer, // 播放器渲染的位置
            // 配置项
            props: {
                events: events,
                blockClass: 'rr-block',
                root: recordContainer, //回放界面渲染的位置
                width: 1024,
                height: 576,
                showController: true, // 是否显示播放器控制UI
                autoPlay: false, // 是否自动播放
                speedOption: [1, 2, 4, 8], // 倍速播放可选值
                triggerFocus: false, //回放时是否回放 focus 交互
                mouseTail: false // 是否回放鼠标轨迹
            },
        });
        player.play();
    }, [filePath]);
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div className="select-container"
                 style={{display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                <label>选择采集时间段: </label>
                <Select
                    className="select-dropdown"
                    onChange={(value) => setFilePath(value)}
                    options={dataCollectionPeriods.map(item => ({
                        value: item['file_path'],
                        label: `${item['start_time']} - ${item['end_time']}`
                    }))}
                    style={{marginRight: '20px'}}  // 添加右侧外边距
                    placeholder="请选择时间段"
                />
                <Button type="primary" onClick={genResult} className="generate-report-button">
                    生成报告
                </Button>
            </div>
            <div className="co2-record-container" style={{width: "100%", height: "600px"}}/>
        </div>
    );
};

export default CO2DataReport;