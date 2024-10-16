<script lang="ts">
  import Table from '../lib/components/Table.svelte'
  import '../app.css'
  import SuccinctIcon from '../lib/icons/succinct_icon.svg'
</script>

<div class="flex flex-col min-h-screen bg-gray-800 text-white p-5 w-full">
  <!-- TODO: Add i18n to internationalize page text -->
  <h1 class="text-4xl font-bold text-center">Telepathy Message Explorer</h1>
  <div class="w-full max-w-8xl">
    <Table />
  </div>
  <div class="flex justify-center gap-3 mt-auto">
    <span>Powered by </span><img src={SuccinctIcon} alt="Succinct Icon" class="w-24" /> 
  </div>
</div>
