import { writeFileSync } from 'fs';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { task } from 'hardhat/config';

task(TASK_COMPILE).setAction(async (_, { ethers, artifacts }, runSuper) => {
  await runSuper();

  const msg = `\
DoubleDiceProtocol:   ${ethers.utils.hexDataLength((await artifacts.readArtifact('DoubleDiceProtocol')).deployedBytecode).toString().padStart(5, ' ')} bytes
ClassicDoubleDiceApp: ${ethers.utils.hexDataLength((await artifacts.readArtifact('ClassicDoubleDiceApp')).deployedBytecode).toString().padStart(5, ' ')} bytes
RandomDoubleDiceApp:  ${ethers.utils.hexDataLength((await artifacts.readArtifact('RandomDoubleDiceApp')).deployedBytecode).toString().padStart(5, ' ')} bytes
RouletteDoubleDiceApp:  ${ethers.utils.hexDataLength((await artifacts.readArtifact('RouletteDoubleDiceApp')).deployedBytecode).toString().padStart(5, ' ')} bytes
Limit:                ${(24576).toString().padStart(5, ' ')} bytes
`;
  process.stdout.write(msg);
  writeFileSync('./contract-size-report.txt', msg);
});
