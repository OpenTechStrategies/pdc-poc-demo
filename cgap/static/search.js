const app = Vue.createApp({});

function hasMatch(firstString, secondString) {
  return firstString.toLowerCase().indexOf(secondString.toLowerCase()) >= 0;
}

app.component('ProposalSearch', {
  emits: ['update:modelValue'],
  data: function() {
    return {
      inputValue: '',
      selectedMatchIndex: null,
      matches: [],
      hasFocus: false,
    }
  },
  computed: {
    filteredMatches() {
      if (!this.hasInputValue) {
        return []
      }

      // We want to filter here as well to prevent common UX lag between API requests
      return this.matches.filter((match) => {
        return hasMatch(match.organization.name, this.inputValue)
        || hasMatch(match['description'], this.inputValue);
      });
    },
    hasMatches() {
      return this.filteredMatches.length >= 0 && this.inputValue !== '';
    },
    hasInputValue() {
      return this.inputValue.length > 0;
    },
  },
  methods: {
    fetchProposals(query) {
      try {
        const url = `/api/proposals`
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        var context = this
        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            const results = JSON.parse(this.response);
            context.matches = results;
          }
        };

        request.onerror = function() {
          console.log('Could not load proposal data.');
        };

        request.send();
      } catch {}
    },
    handleInput(event) {
      this.fetchProposals(event.target.value);
    },
    generateViewUrl(id) {
      return `/proposal/${id}`;
    }
  },

  template: `
<div class="row">
  <div class="col-12">
    <input class="form-control"
      v-model="inputValue"
      @input="handleInput"
      >
  </div>
</div>
<div>
  <div v-for="match in filteredMatches" class="proposal row">
    <div class="col-12">
      <h2>{{ match.organization.name }} ({{ match.organization.registration_number }})</h2>
      {{ match.description }}
      <div><a :href='generateViewUrl(match.id)'>(view)</a></div>
    </div>
  </div>
</div>
`
})
