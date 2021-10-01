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

      // Create a dictionary of of org + proposal objects
      const proposalGroupsObject = this.matches.reduce(
        function (accumulator, match) {
          if (!(match.organization.id in accumulator)) {
            accumulator[match.organization.id] = {
              organization: match.organization,
              proposals: [],
              matches: [],
            }
          }
          accumulator[match.organization.id].proposals.push(match);
          return accumulator;
        },
        {},
      )
      const proposalGroups = Object.values(proposalGroupsObject)
        .map((group) => {
          if (hasMatch(group.organization.name, this.inputValue)) {
            group.matches.push("Org Name");
          }
          if (hasMatch(group.organization.website, this.inputValue)) {
            group.matches.push("Website");
          }
          if (hasMatch(group.organization.address, this.inputValue)) {
            group.matches.push("Address");
          }
          if (hasMatch(group.organization.phone, this.inputValue)) {
            group.matches.push("Phone");
          }
          if (hasMatch(group.organization.ceo_name, this.inputValue)) {
            group.matches.push("CEO");
          }

          const matchedProposals = group.proposals.filter((proposal) => {
            return hasMatch(proposal.description, this.inputValue)
            || hasMatch(proposal.name, this.inputValue);
          })
          if (matchedProposals.length > 0) {
            group.matches.push("Proposal");
          }
          return group;
        })

      // We want to filter here as well to prevent common UX lag between API requests
      return proposalGroups.filter((match) => { return match.matches.length !== 0; });
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
    generateProposalViewUrl(id) {
      return `/proposal/${id}`;
    },
    generateOrganizationViewUrl(id) {
      return `/organization/${id}`;
    }
  },

  template: `
<div class="d-grid gap-3">
  <div>
    <input class="form-control"
      v-model="inputValue"
      @input="handleInput"
      placeholder='matches on name and mission statement -- for example, start typing "disaster"'
      >
  </div>
  <div v-for="match in filteredMatches" class="card">
    <div class="card-body">
      <h5 class="card-title">{{ match.organization.name }} <a :href='generateOrganizationViewUrl(match.organization.id)'>(View)</a></h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ match.organization.registration_number }}</h6>
      <p>{{match.organization.address}}</p>
      <h6>Proposals</h6>
      <ul class="list-group list-group-flush">
        <li v-for="proposal in match.proposals" class="list-group-item">
          {{proposal.name}}, {{proposal.requested_budget}} <a :href='generateProposalViewUrl(proposal.id)'>(view)</a>
        </li>
      </ul>
      <p class="card-text">Matched on: <span v-for="term in match.matches" class="badge bg-secondary ms-1">{{term}}</span></p>
    </div>
  </div>
</div>
`
})
