import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  MerkleWitness,
} from 'snarkyjs';

export class MerkleWitness20 extends MerkleWitness(20) {}

export class merkleContract extends SmartContract {
  @state(Field) treeRoot = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method initState(initialRoot: Field) {
    this.treeRoot.set(initialRoot);
  }

  @method update(
    leafWitness: MerkleWitness20,
    numberBefore: Field,
    incrementAmount: Field
  ) {
    const initialRoot = this.treeRoot.get();
    this.treeRoot.assertEquals(initialRoot);
    incrementAmount.assertLte(Field(10));

    const rootBefore = leafWitness.calculateRoot(numberBefore);
    rootBefore.assertEquals(initialRoot);

    const rootAfter = leafWitness.calculateRoot(
      numberBefore.add(incrementAmount)
    );
    this.treeRoot.set(rootAfter);
  }
}
