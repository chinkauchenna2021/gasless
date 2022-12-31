import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import { ethers } from 'hardhat';
import { DoubleDiceDeploymentHelper } from '../helpers';
import {
  GraphHelper,
  GraphHelper__factory,
  VirtualFloorMetadataV1Struct
} from '../lib/contracts';

chai.use(chaiSubset);

describe('GraphHelper', () => {

  let deployer: SignerWithAddress;
  let graphHelper: GraphHelper;

  before(async function () {
    [deployer] = await ethers.getSigners();
    const deployerHelper = await new DoubleDiceDeploymentHelper(deployer);
    await deployerHelper.deployProxyAdmin();
    graphHelper = await deployerHelper.deployUpgradeableGraphHelper();
  });

  it('decodeVirtualFloorMetadataV1', async () => {
    const orig: VirtualFloorMetadataV1Struct = {
      category: 'category',
      subcategory: 'subcategory',
      title: 'title',
      description: 'description',
      isListed: true,
      opponents: [
        { title: 'opponents[0].title', image: 'opponents[0].image' },
        { title: 'opponents[1].title', image: 'opponents[1].image' },
      ],
      outcomes: [
        { title: 'outcomes[0].title' },
        { title: 'outcomes[1].title' },
        { title: 'outcomes[2].title' },
      ],
      resultSources: [
        { title: 'resultSources[0].title', url: 'resultSources[0].url' }
      ],
      discordChannelId: 'discordChannelId',
      extraData: '0x1122334455',
    };

    const encodedWithSelector = GraphHelper__factory.createInterface().encodeFunctionData('encodeVirtualFloorMetadataV1', [orig]);

    expect(encodedWithSelector).to.eq([
      '0x92bedfc0',
      '0000000000000000000000000000000000000000000000000000000000000020', // 000: *decoded
      '0000000000000000000000000000000000000000000000000000000000000140', // 020: 000: *category
      '0000000000000000000000000000000000000000000000000000000000000180', //      020: *subcategory
      '00000000000000000000000000000000000000000000000000000000000001c0', //      040: *title
      '0000000000000000000000000000000000000000000000000000000000000200', //      060: *description
      '0000000000000000000000000000000000000000000000000000000000000001', //      080: isListed
      '0000000000000000000000000000000000000000000000000000000000000240', //      0a0: *opponents
      '0000000000000000000000000000000000000000000000000000000000000420', //      0c0: *outcomes
      '00000000000000000000000000000000000000000000000000000000000005c0', //      0f0: *resultSources
      '00000000000000000000000000000000000000000000000000000000000006c0', //      100: *discordChannelId
      '0000000000000000000000000000000000000000000000000000000000000700', //      120: *extraData
      '0000000000000000000000000000000000000000000000000000000000000008', //      140: category.length
      '63617465676f7279000000000000000000000000000000000000000000000000', //      160: "category"
      '000000000000000000000000000000000000000000000000000000000000000b', //      180: subcategory.length
      '73756263617465676f7279000000000000000000000000000000000000000000', //      1a0: "subcategory"
      '0000000000000000000000000000000000000000000000000000000000000005', //      1c0: title.length
      '7469746c65000000000000000000000000000000000000000000000000000000', //      1f0: "title"
      '000000000000000000000000000000000000000000000000000000000000000b', //      200: description.length
      '6465736372697074696f6e000000000000000000000000000000000000000000', //      220: "description"
      '0000000000000000000000000000000000000000000000000000000000000002', //      240: opponents.length
      '0000000000000000000000000000000000000000000000000000000000000040', //      260: 000: *opponents[0]
      '0000000000000000000000000000000000000000000000000000000000000100', //      280: 020: *opponents[1]
      '0000000000000000000000000000000000000000000000000000000000000040', //      2a0: 040: 000: *opponents[0].title
      '0000000000000000000000000000000000000000000000000000000000000080', //      2c0: 060: 020: *opponents[0].image
      '0000000000000000000000000000000000000000000000000000000000000012', //      2f0: 080: 040: opponents[0].title.length
      '6f70706f6e656e74735b305d2e7469746c650000000000000000000000000000', //      300: 0a0: 060: "opponents[0].title"
      '0000000000000000000000000000000000000000000000000000000000000012', //      320: 0c0: 080: opponents[0].image.length
      '6f70706f6e656e74735b305d2e696d6167650000000000000000000000000000', //      340: 100: 0a0: "opponents[0].image" 
      '0000000000000000000000000000000000000000000000000000000000000040', //      360: ⋮
      '0000000000000000000000000000000000000000000000000000000000000080', //      380: ⋮
      '0000000000000000000000000000000000000000000000000000000000000012', //      3a0: ⋮
      '6f70706f6e656e74735b315d2e7469746c650000000000000000000000000000', //      3c0: ⋮
      '0000000000000000000000000000000000000000000000000000000000000012', //      3f0: ⋮
      '6f70706f6e656e74735b315d2e696d6167650000000000000000000000000000', //      400: ⋮
      '0000000000000000000000000000000000000000000000000000000000000003', //      420: outcomes.length
      '0000000000000000000000000000000000000000000000000000000000000060', //      440: ⋮
      '00000000000000000000000000000000000000000000000000000000000000c0', //      460: ⋮
      '0000000000000000000000000000000000000000000000000000000000000120', //      480: ⋮
      '0000000000000000000000000000000000000000000000000000000000000020', //      4a0: ⋮
      '0000000000000000000000000000000000000000000000000000000000000011', //      4c0: ⋮
      '6f7574636f6d65735b305d2e7469746c65000000000000000000000000000000', //      4f0: ⋮
      '0000000000000000000000000000000000000000000000000000000000000020', //      500: ⋮
      '0000000000000000000000000000000000000000000000000000000000000011', //      520: ⋮
      '6f7574636f6d65735b315d2e7469746c65000000000000000000000000000000', //      540: ⋮
      '0000000000000000000000000000000000000000000000000000000000000020', //      560: ⋮
      '0000000000000000000000000000000000000000000000000000000000000011', //      580: ⋮
      '6f7574636f6d65735b325d2e7469746c65000000000000000000000000000000', //      5a0: ⋮
      '0000000000000000000000000000000000000000000000000000000000000001', //      5c0: resultSources.length
      '0000000000000000000000000000000000000000000000000000000000000020', //      5f0: ⋮
      '0000000000000000000000000000000000000000000000000000000000000040', //      600: ⋮
      '0000000000000000000000000000000000000000000000000000000000000080', //      620: ⋮
      '0000000000000000000000000000000000000000000000000000000000000016', //      640: ⋮
      '726573756c74536f75726365735b305d2e7469746c6500000000000000000000', //      660: ⋮
      '0000000000000000000000000000000000000000000000000000000000000014', //      680: ⋮
      '726573756c74536f75726365735b305d2e75726c000000000000000000000000', //      6a0: ⋮
      '0000000000000000000000000000000000000000000000000000000000000010', //      6c0: discordChannelId.length
      '646973636f72644368616e6e656c496400000000000000000000000000000000', //      6f0: "discordChannelId"
      '0000000000000000000000000000000000000000000000000000000000000005', //      700: extraData.length
      '1122334455000000000000000000000000000000000000000000000000000000', //      720: extraData
    ].join(''));
    const encoded = ethers.utils.hexDataSlice(encodedWithSelector, 4);
    expect(await graphHelper.encodeVirtualFloorMetadataV1(orig)).to.eq(encoded);
    const decoded = await graphHelper.decodeVirtualFloorMetadataV1(encoded);
    expect(decoded).to.containSubset(orig);
  });

});