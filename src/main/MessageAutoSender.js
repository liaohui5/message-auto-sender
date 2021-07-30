import nks from 'node-key-sender';
import { clipboard } from 'electron';

export default async (event, data) => {
  // 将数据保存到剪切板
  clipboard.writeText(data);

  // 向操作系统发送 ctrl+v 的指令, 然后发送 enter 指令
  await nks
    .startBatch()
    .batchTypeCombination(['control', 'v'])
    .batchTypeKey('enter')
    .sendBatch();
};
