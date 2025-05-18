<script lang="ts">
  const { category, game, addToList }: { category?: { category_label: string, require_proof: boolean, proof_match: string }, game: number, addToList?: (category_label: string, proof_match: string, require_proof: boolean) => void } = $props();

  const PROOF_TYPES: { [mime: string]: string } = { '.*/.*': 'Any', 'video/.*': 'Video', 'image/.*': 'Images', 'audio/.*': 'Audio', '': 'Custom' };
  
  let editing: boolean = $state(false);
  let editName: string = $state(category?.category_label || '');
  let proofMatch: string = $state(category?.proof_match || '.*/.*');
  let proofReq: boolean = $state(category?.require_proof || false);
  let selectedPreset = $state((category?.proof_match && category?.proof_match in PROOF_TYPES) ? category?.proof_match : '');

  $effect(() => {
    selectedPreset;
  
    if (selectedPreset != '')
      proofMatch = selectedPreset;
  });

  async function editCategory() {
    if (category) {
      const resp = await fetch('/api/game/category/edit', {
        method: 'POST',
        body: JSON.stringify({
          category_label: category?.category_label,
          game,
          new_category_label: editName,
          proof_match: proofMatch,
          require_proof: proofReq
        })
      });

      if (resp.ok) editing = false;
    }
    else {
      const resp = await fetch('/api/game/category/add', {
        method: 'POST',
        body: JSON.stringify({
          category_label: editName,
          game,
          proof_match: proofMatch,
          require_proof: proofReq,
        })
      });

      if (resp.ok) {
        if (addToList)
          addToList(editName, proofMatch, proofReq);
        editName = '';
        proofMatch = '';
        proofReq = false;
        editing = false;
      }
    }
  }
</script>

{#if editing}
<div class="category editing">
  <div class="content">
    <input type="text" bind:value={editName}>
    <span class="sep"></span>
    <div class="proofreq">
      <label class="kvpair">
        <span class="k">Required</span>
        <div class="v checkbox {proofReq ? 'checked' : 'unchecked'}">
          {#if proofReq}
            <svg viewBox="0 0 8 8">
              <path
                d="M7 1L8 2L3 7L0 4L1 3L3 5Z">
              </path>
            </svg>
          {/if}
        </div>
        <input type="checkbox" bind:checked={proofReq} hidden>
      </label>
      <label class="kvpair">
        <span class="k">Type</span>
        <select class="v" bind:value={selectedPreset}>
          {#each Object.keys(PROOF_TYPES) as k}
            <option class="k" value={k}>{PROOF_TYPES[k]}</option>
          {/each}
        </select>
      </label>
      {#if selectedPreset == ''}
        <label class="kvpair">
          <span class="k">Constraint</span>
          <input type="text" class="v" bind:value={proofMatch}>
        </label>
      {/if}
    </div>
  </div>
  <button onclick={() => editing = false} aria-label="Cancel editing">
    <svg viewBox="0 0 10 10">
      <path
        d="M 0 1 L 1 0 L 5 4 L 9 0 L 10 1 L 6 5 L 10 9 L 9 10 L 5 6 L 1 10 L 0 9 L 4 5 Z">
      </path>
    </svg>
  </button>
  <button onclick={() => editCategory()} aria-label="Edit category">
    <svg viewBox="0 0 10 10">
      <path
        d="M 9 1 L 10 2 L 3 9 L 0 6 L 1 5 L 3 7 Z">
      </path>
    </svg>
  </button>
</div>
{:else}
  {#if category}
    <div class="category">
      <div class="content">
        <span>
          {editName}
        </span>
        <span class="sep"></span>
        <div class="proofreq">
          <div class="kvpair">
            <span class="k">
              Required
            </span>
            <span class="v">
              {proofReq ? 'Yes' : 'No'}
            </span>
          </div>
          <div class="kvpair">
            <span class="k">
              Type
            </span>
            <span class="type">
              {PROOF_TYPES[proofMatch] || proofMatch}
            </span>
          </div>
        </div>
      </div>
      <button onclick={() => editing = true} class="edit" aria-label="Edit category">
        <svg viewBox="0 0 10 10">
          <path
            d="M 8 0 L 10 2 L 3 9 L 1 9 L 1 7 Z">
          </path>
        </svg>
      </button>
    </div>
  {:else}
    <button class="category add" onclick={() => editing = true}>
      <span>+</span>
    </button>
  {/if}
{/if}

<style>

.category {
    padding: .5rem;
    display: flex;
    flex-direction: row;
    background-color: var(--bg3);
    border-radius: .5rem;
    align-items: center;

    gap: .5rem;

    box-sizing: border-box;

    &>span {
      flex: 1;
      text-align: center;
      user-select: none;
      color: inherit;
    }

    &>.content {
      display: flex;
      flex-direction: column;
      gap: .5rem;
      flex: 1;
      align-items: center;

      &>.sep {
        height: .125rem;
        width: 40%;
        border-radius: .125rem;
        background-color: var(--emphasis);
      }

      &>.proofreq {
        display: flex;
        flex-direction: row;
        gap: .5rem;

        &>.kvpair {
          display: flex;
          flex-direction: column;
          flex: 1;

          &>span {
            padding: .25rem;
            text-align: center;
          }

          &>.k {
            border-bottom: .125rem solid var(--emphasis);
          }
        }
      }
    }

    &>.edit {
      border: none;
      height: 2rem;
      width: 2rem;
      padding: .375rem;
      border-radius: .5rem;

      & path {
        fill: var(--emphasis);
      }
      &:hover, &:focus-visible, &:active {
        & path { fill: var(--fg-emphasis); }
      }
    }

    &.add {
      border: none;
    }
  }
  .editing {
    &>.content {

      &>input {
        height: 2rem;
        border: none;
        border-radius: .5rem;
        flex: 1;
        width: 100%;
        margin: 0;
      }

      &>.proofreq {
        &>.kvpair {
          gap: .5rem;
        }
        &>label>.v {
          height: 2rem;
          margin: 0;
          box-sizing: border-box;
          background-color: var(--bg2);
          border: .125rem solid var(--emphasis);
          color: inherit;
        }
        &>label>.checkbox {
          width: 2rem;
          padding: .25rem;
          align-self: center;
          
          &>svg>path {
            fill: var(--emphasis);
          }
        }
      }
    }

    &>button {
      height: 2rem;
      width: 2rem;
      border: none;
      border-radius: .5rem;

      & path {
        fill: var(--emphasis);
      }

      &:hover, &:active, &:focus-visible {
        & path {
          fill: var(--fg-emphasis);
        }
      }
    }
  }
</style>