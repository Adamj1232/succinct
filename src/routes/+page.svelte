<script lang="ts">
  import Table from '../lib/components/Table.svelte'
  import '../app.css'
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-5">
  <!-- TODO: Add i18n to internationalize page text -->
  <h1 class="text-4xl font-bold mb-4 text-center">Telepathy Message Explorer</h1>
  <div class="w-full max-w-8xl p-4">
    <Table />
  </div>
</div>
