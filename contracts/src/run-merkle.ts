import {
  AccountUpdate,
  Field,
  MerkleTree,
  Mina,
  PrivateKey,
  isReady,
  shutdown,
} from 'snarkyjs';
import { MerkleWitness20, merkleContract } from './merkle.js';

async function main() {
  await isReady;

  const local = Mina.LocalBlockchain();
  Mina.setActiveInstance(local);
  const deployAccount = local.testAccounts[0].privateKey;

  const merkleZkappPrivateKey = PrivateKey.random();
  const merkleZkappAddress = merkleZkappPrivateKey.toPublicKey();

  const height = 20;
  const tree = new MerkleTree(height);
  // MerkleWitness20

  const zkapp = new merkleContract(merkleZkappAddress);

  // Deploy Transaction
  const deployTxn = await Mina.transaction(deployAccount, () => {
    AccountUpdate.fundNewAccount(deployAccount);
    zkapp.deploy({ zkappKey: merkleZkappPrivateKey });
    zkapp.initState(tree.getRoot());
    zkapp.sign(merkleZkappPrivateKey);
  });
  await deployTxn.send();

  console.log('local Merkle tree with height 20: ');
  console.log(tree.getRoot());
  console.log('smart contract Merkle tree after initState: ');
  console.log(zkapp.treeRoot.get());

  // Update Transaction
  const incrementIndex = BigInt(522);
  const incrementAmount = Field(10);
  const witness = new MerkleWitness20(tree.getWitness(incrementIndex));

  const txn1 = await Mina.transaction(deployAccount, () => {
    zkapp.update(witness, Field(0), incrementAmount);
    zkapp.sign(merkleZkappPrivateKey);
  });
  await txn1.send();

  console.log('local Merkle tree with height 20: ');
  console.log(tree.getRoot());
  console.log('smart contract Merkle tree after update: ');
  console.log(zkapp.treeRoot.get());

  await shutdown();
}

main();
