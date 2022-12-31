import assert from 'assert';
import { Contract, ContractFactory, ContractTransaction, Signer } from 'ethers';
import { SignerWithAddress } from '.';
import {
  ClassicDoubleDiceApp as ClassicDoubleDiceApp,
  DoubleDiceProtocol,
  DoubleDiceProtocol__factory,
  ClassicDoubleDiceApp__factory as ClassicDoubleDiceApp__factory,
  DummyERC20__factory,
  DummyUSDCoin__factory,
  DummyWrappedBTC__factory,
  GraphHelper__factory,
  ProxyAdmin,
  ProxyAdmin__factory,
  RandomDoubleDiceApp,
  RandomDoubleDiceApp__factory,
  SimpleOracle as TestDoubleDiceApp,
  SimpleOracle__factory,
  TransparentUpgradeableProxy__factory,
  VRFCoordinatorV2Mock__factory,
  DummyLinkToken__factory,
  RouletteDoubleDiceApp__factory,
  RouletteDoubleDiceApp
} from '../lib/contracts';
import { delaySeconds } from './utils';

// Here we could simply use @openzeppelin/hardhat-upgrades deployProxy function,
// but it does not work yet,
// compilation fails with error "Error: No node with id 5102 of type StructDefinition,EnumDefinition"
// Probably because user-defined value types are not yet supported:
// https://github.com/OpenZeppelin/openzeppelin-upgrades/issues/477
// This replacement can be dropped as soon as there is support

interface DeployContractArgs<F extends ContractFactory> {
  name: string;
  factoryCtor: new (deployer: Signer) => F;
  constructorArgs: Parameters<F['deploy']>;
}

type InitializableContract = Contract & {
  initialize(...args: unknown[]): Promise<ContractTransaction>;
}

type ContractTypeOf<F extends ContractFactory> = Awaited<ReturnType<F['deploy']>>

type ConstructorArgsOf<F extends ContractFactory> = Parameters<F['deploy']>;

// Adapted from https://stackoverflow.com/questions/63789897/typescript-remove-last-element-from-parameters-tuple-currying-away-last-argum
// type RemoveOverridesArg<Args extends unknown[]> = Args extends [...infer InitializerArgs, unknown?]
//   ? InitializerArgs
//   : never;

type RemoveOverridesArg<Args extends unknown[]> = Args extends [...infer InitializerArgs, unknown?] ? InitializerArgs : never;

type InitializerArgsOf<F extends ContractFactory> = ContractTypeOf<F> extends InitializableContract
  ? RemoveOverridesArg<Parameters<ContractTypeOf<F>['initialize']>>
  : undefined;

type AllArgsOf<F extends ContractFactory> = {
  constructorArgs: ConstructorArgsOf<F>;
  initializerArgs: InitializerArgsOf<F>;
}

interface DeployProxyArgs<F extends ContractFactory> {
  name: string;
  factoryCtor: new (deployer: Signer) => F;
  constructorArgs: ConstructorArgsOf<F>;
  initializerArgs?: InitializerArgsOf<F>;
}


class DeploymentHelper {

  deployer: SignerWithAddress;

  proxyAdmin: ProxyAdmin | null;

  constructor(deployer: SignerWithAddress, proxyAdminAddress?: string) {
    this.deployer = deployer;
    this.proxyAdmin = proxyAdminAddress ? ProxyAdmin__factory.connect(proxyAdminAddress, deployer) : null;
  }

  async deployProxyAdmin(): Promise<void> {
    this.proxyAdmin = await this.deployContract({ name: 'ProxyAdmin', factoryCtor: ProxyAdmin__factory, constructorArgs: [] });
  }

  async deployContract<F extends ContractFactory>({ name, factoryCtor, constructorArgs }: DeployContractArgs<F>): Promise<ContractTypeOf<F>> {
    const factory = new factoryCtor(this.deployer);
    const impl = await factory.deploy(...constructorArgs);
    console.log(`Deploying at ${impl.address}: ${name}...`);
    console.log(`Sent transaction: ${impl.deployTransaction.hash}`);
    await impl.deployed();
    return impl as ContractTypeOf<F>;
  }

  async deployUpgradeableProxy<F extends ContractFactory>({ name, factoryCtor, constructorArgs, initializerArgs }: DeployProxyArgs<F>): Promise<ContractTypeOf<F>> {
    assert(this.proxyAdmin, 'Must set ProxyAdmin before calling deployUpgradeableProxy');
    const impl = await this.deployContract({ name: `${name} impl`, factoryCtor, constructorArgs });
    const encodedInitializerData = initializerArgs ? impl.interface.encodeFunctionData('initialize', initializerArgs) : '0x';
    const proxy = await this.deployContract({ name: `TransparentUpgradeableProxy in front of ${name} impl at ${impl.address}`, factoryCtor: TransparentUpgradeableProxy__factory, constructorArgs: [impl.address, this.proxyAdmin.address, encodedInitializerData] });
    return new factoryCtor(this.deployer).attach(proxy.address) as ContractTypeOf<F>;
  }

  async upgradeProxy<F extends ContractFactory>({ name, factoryCtor, constructorArgs, proxyAddress }: DeployContractArgs<F> & { proxyAddress: string }): Promise<void> {
    assert(this.proxyAdmin, 'Must set ProxyAdmin before calling upgradeProxy');
    const impl = await this.deployContract({ name, factoryCtor, constructorArgs });

    // Note: If impl is deployed correctly, but for some reason upgrade fails with
    // "execution reverted: ERC1967: new implementation is not a contract",
    // comment the code block above, set implAddress directly, and reattempt upgrade.

    // Just in case "execution reverted: ERC1967: new implementation is not a contract" was happening because of reorgs
    console.log('Delaying 10 seconds...');
    await delaySeconds(10);

    console.log(`Calling ProxyAdmin(${this.proxyAdmin.address}),`);
    console.log(`  to upgrade TransparentUpgradeableProxyAddress(${proxyAddress}),`);
    console.log(`  to just-deployed impl DoubleDiceProtocol(${impl.address})...`);
    await (await this.proxyAdmin.upgrade(proxyAddress, impl.address)).wait();
    console.log('Upgraded.');
  }

}

export class DoubleDiceDeploymentHelper extends DeploymentHelper {

  deployDummyUSDCoin() {
    return this.deployContract({ name: 'DummyUSDCoin', factoryCtor: DummyUSDCoin__factory, constructorArgs: [] });
  }

  deployDummyWrappedBTC() {
    return this.deployContract({ name: 'DummyWrappedBTC', factoryCtor: DummyWrappedBTC__factory, constructorArgs: [] });
  }

  deployTestCoin(decimals: number) {
    const name = `TestCoin${decimals}`;
    return this.deployContract({ name, factoryCtor: DummyERC20__factory, constructorArgs: [name, `TEST${decimals}`, decimals] });
  }

  deployDummyLinkToken() {
    return this.deployContract({ name: 'DummyLinkToken', factoryCtor: DummyLinkToken__factory, constructorArgs: [] });
  }

  deployUpgradeableDoubleDiceProtocol({ constructorArgs, initializerArgs }: AllArgsOf<DoubleDiceProtocol__factory>) {
    return this.deployUpgradeableProxy({ name: 'DoubleDiceProtocol', factoryCtor: DoubleDiceProtocol__factory, constructorArgs, initializerArgs });
  }

  deployUpgradeableClassicDoubleDiceApp({ constructorArgs, initializerArgs }: AllArgsOf<ClassicDoubleDiceApp__factory>) {
    return this.deployUpgradeableProxy({ name: 'ClassicDoubleDiceApp', factoryCtor: ClassicDoubleDiceApp__factory, constructorArgs, initializerArgs });
  }

  deployUpgradeableRandomDoubleDiceApp({ constructorArgs, initializerArgs }: AllArgsOf<RandomDoubleDiceApp__factory>) {
    return this.deployUpgradeableProxy({ name: 'RandomDoubleDiceApp', factoryCtor: RandomDoubleDiceApp__factory, constructorArgs, initializerArgs });
  }

  deployUpgradeableTestDoubleDiceApp({ constructorArgs }: AllArgsOf<SimpleOracle__factory>) {
    return this.deployUpgradeableProxy({ name: 'SimpleOracle', factoryCtor: SimpleOracle__factory, constructorArgs });
  }

  deployUpgradeableRouletteDoubleDiceApp({ constructorArgs, initializerArgs }: AllArgsOf<RouletteDoubleDiceApp__factory>) {
    return this.deployUpgradeableProxy({ name: 'RouletteDoubleDiceApp', factoryCtor: RouletteDoubleDiceApp__factory, constructorArgs, initializerArgs });
  }

  deployUpgradeableGraphHelper() {
    return this.deployUpgradeableProxy({ name: 'GraphHelper', factoryCtor: GraphHelper__factory, constructorArgs: [] });
  }

  deployVRFCoordinatorV2Mock() {
    return this.deployContract({ name: 'VRFCoordinatorV2Mock', factoryCtor: VRFCoordinatorV2Mock__factory, constructorArgs: [0, 0] });
  }

  async setup({ protocol, classicApp, randomApp, testApp, rouletteApp }: {
    protocol: DoubleDiceProtocol;
    classicApp?: ClassicDoubleDiceApp;
    randomApp?: RandomDoubleDiceApp;
    testApp?: TestDoubleDiceApp;
    rouletteApp?: RouletteDoubleDiceApp
  }) {
    if (classicApp) {
      console.log(`Granting DoubleDiceProtocol.APPLICATION_ROLE to ClassicApp(${classicApp.address})`);
      await (await protocol.grantRole(await protocol.APPLICATION_ROLE(), classicApp.address)).wait();

      console.log(`Granting DoubleDice.OPERATOR_ROLE to admin ${this.deployer.address}`);
      await (await classicApp.grantRole(await classicApp.OPERATOR_ROLE(), this.deployer.address)).wait();

      console.log(`Granting quota of 100 rooms to admin ${this.deployer.address}`);
      await (await classicApp.adjustCreationQuotas([{ creator: this.deployer.address, relativeAmount: 100 }])).wait();
    }

    if (randomApp) {
      console.log(`Granting DoubleDiceProtocol.APPLICATION_ROLE to RandomApp(${randomApp.address})`);
      await (await protocol.grantRole(await protocol.APPLICATION_ROLE(), randomApp.address)).wait();
    }

    if (testApp) {
      console.log(`Granting DoubleDiceProtocol.APPLICATION_ROLE to TestApp(${testApp.address})`);
      await (await protocol.grantRole(await protocol.APPLICATION_ROLE(), testApp.address)).wait();
    }

    if (rouletteApp) {
      console.log(`Granting DoubleDiceProtocol.APPLICATION_ROLE to rouletteApp(${rouletteApp.address})`);
      await (await protocol.grantRole(await protocol.APPLICATION_ROLE(), rouletteApp.address)).wait();
    }
  }

  async upgradeDoubleDiceProtocol(proxyAddress: string, constructorArgs: ConstructorArgsOf<DoubleDiceProtocol__factory>): Promise<void> {
    await this.upgradeProxy({ proxyAddress, name: 'DoubleDiceProtocol', factoryCtor: DoubleDiceProtocol__factory, constructorArgs });
  }

  async upgradeClassicDoubleDiceApp(proxyAddress: string, constructorArgs: ConstructorArgsOf<ClassicDoubleDiceApp__factory>): Promise<void> {
    this.upgradeProxy({ proxyAddress, name: 'ClassicDoubleDiceApp', factoryCtor: ClassicDoubleDiceApp__factory, constructorArgs });
  }

  async upgradeRandomDoubleDiceApp(proxyAddress: string, constructorArgs: ConstructorArgsOf<RandomDoubleDiceApp__factory>): Promise<void> {
    this.upgradeProxy({ proxyAddress, name: 'RandomDoubleDiceApp', factoryCtor: RandomDoubleDiceApp__factory, constructorArgs });
  }

  async upgradeRouletteDoubleDiceApp(proxyAddress: string, constructorArgs: ConstructorArgsOf<RouletteDoubleDiceApp__factory>): Promise<void> {
    this.upgradeProxy({ proxyAddress, name: 'RouletteDoubleDiceApp', factoryCtor: RouletteDoubleDiceApp__factory, constructorArgs });
  }

}
