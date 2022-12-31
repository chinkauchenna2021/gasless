import {
  VirtualFloorResolution as VirtualFloorResolutionEvent
} from '../../../generated/DoubleDiceProtocol/DoubleDiceProtocol';
import { handleVirtualFloorResolution } from './main';

export function handleLegacyVirtualFloorResolution(event: VirtualFloorResolutionEvent): void {
  handleVirtualFloorResolution(event, event.params.vfId, event.params.resolutionType, event.params.winningOutcomeIndex, event.params.winnerProfits);
}
