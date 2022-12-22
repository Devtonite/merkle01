
    <script>
    
  import { onMount } from "svelte";
  import { isReady, Mina, PublicKey } from 'snarkyjs';

  onMount(async () => {
    await isReady;  

    const { Add } = await import('../../../contracts/build/src/')
    // Update this to use the address (public key) for your zkApp account
    // To try it out, you can try this address for an example "Add" smart contract that we've deployed to
    // Berkeley Testnet B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV
    const zkAppAddress = ''
    // This should be removed once the zkAppAddress is updated.
    if (!zkAppAddress) {
      console.error(
        'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4',
      );
    }
    const zkApp = new Add(PublicKey.fromBase58(zkAppAddress))
  });

    </script>

    <h1>
    Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
