import {Button, message, Select, Flex} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import {getAllDataCollectionPeriods, getBrainWavesRecordPresignedUrl} from '../../service/brainWavesService';
import rrwebPlayer from 'rrweb-player';
import {getObjectByPresignedUrl} from '../../service/objectStoreService'
import {decompressorEvents} from "../../utils";
import 'rrweb/dist/rrweb.min.css';
import 'rrweb-player/dist/style.css';


const BrainWavesRecord = () => {
  const recordContainer = document.querySelector('.co2-record-container') as HTMLElement;
  const playerContainer = document.querySelector('.co2-player-container') as HTMLElement;
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
    const presignedUrl = await getBrainWavesRecordPresignedUrl(filePath);
    const recordBlob: Blob = await getObjectByPresignedUrl(presignedUrl);
    const events = await decompressorEvents(recordBlob);
    const player = new rrwebPlayer({
      target: playerContainer,
      props: {
        events: events,
        width: 1580,
        height: 720,
        autoPlay: false,
        mouseTail: false,
        UNSAFE_replayCanvas: true,
      },
    });
    player.play();
  }, [filePath]);
  return (
    <Flex vertical={true} justify={"center"}>
      <Flex className="select-container" justify={"flex-start"} align={"center"}>
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
          查看记录
        </Button>
      </Flex>
      <div className="co2-player-container"/>
    </Flex>
  );
};

export default BrainWavesRecord;