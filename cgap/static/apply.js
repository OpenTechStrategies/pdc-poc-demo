const app = Vue.createApp({});

app.component('LinkedAutofillInput', {
  props: ['field', 'modelValue'],
  emits: ['update:modelValue'],
  data: function() {
    return {
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
        const fieldValue = match[this.field];
        return fieldValue.toLowerCase().indexOf(this.inputValue.toLowerCase()) >= 0;
      });
    },
    selectedMatch() {
      return this.matches[selectedMatchIndex];
    },
    hasSelection() {
      return this.modelValue && this.modelValue.id !== 0
    },
    hasMatches() {
      return this.filteredMatches.length >= 0 && this.inputValue !== '';
    },
    showAutocomplete() {
      return this.hasMatches && !this.hasSelection && this.hasFocus;
    },
    hasInputValue() {
      return this.inputValue.length > 0;
    },
    inputValue() {
      if(this.modelValue
        && this.modelValue[this.field]) {
        return this.modelValue[this.field];
      }
      return '';
    }
  },
  methods: {
    fetchOrganizations(query) {
      try {
        const url = `/api/organizations`
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
          console.log('Could not load org data.');
        };

        request.send();
      } catch {}
    },
    getMatchValue(match) {
      return match[this.field]
    },
    makeSelection(selection) {
      this.$emit('update:modelValue', selection)
    },
    updateModel(updatedValue) {
      this.$emit('update:modelValue', updatedValue)
    },
    handleInput(event) {
      const updatedValue = {
        ...this.modelValue
      }
      updatedValue[this.field] = event.target.value;
      this.updateModel(updatedValue);
      this.fetchOrganizations(event.target.value);
    }
  },

  template: `
<input class="form-control"
  :value="inputValue"
  @input="handleInput"
  v-bind="$attrs"
  @focus="hasFocus = true"
  @blur="hasFocus = false"
  >
<div v-show="showAutocomplete" class="autocomplete">
  <ul>
    <li v-for="match in filteredMatches"
      @mousedown.prevent="makeSelection(match)"
      >{{ getMatchValue(match) }} :: {{ match.name }} ({{ match.registration_number }})</li>
  </ul>
</div>
`
})


app.component('AutofillForm', {
  data: function() {
    return {
      organization: {
        'id': 0,
        'name': '',
        'mission_statement': '',
        'website': '',
        'entity_type': '',
        'registration_number': '',
        'address': '',
        'phone': '',
        'email': '',
        'dba_name': '',
        'ceo_name': '',
        'ceo_title': '',
        'ceo_address': '',
        'operating_budget': '',
        'is_lobbying': 'false',
        'start_date': '',
        'grant_agreement_signatory': '',
        'fiscal_end_date': '',
      },
      proposal: {
        'id': '',
        'name': '',
        'created': '',
        'primary_contact_name': '',
        'requested_budget': '',
        'investment_start_date': '',
        'investment_end_date': '',
        'total_budget': '',
        'fiscal_sponsor_name': '',
        'description': '',
      },
    }
  },

  methods: {
    updateOrganization(organization) {
      var request = new XMLHttpRequest();
      var formData = new FormData();
      for ( var key in organization ) {
        formData.append(key, organization[key]);
      }
      console.log("UPDATING ORGANIZATION");
      request.open('POST', '/api/organizations/' + organization.id, true);
      request.send(formData);
    },

    createOrganization(organization, cb) {
      var request = new XMLHttpRequest();
      var formData = new FormData();
      for ( var key in organization ) {
        formData.append(key, organization[key]);
      }
      request.open('POST', '/api/organizations', true);
      const context = this;
      request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
          newOrganization = JSON.parse(this.response);
          context.organization.id = newOrganization.id;
          cb();
        }
      }
      request.send(formData);
    },

    createProposal(proposal, organizationId, cb) {
      var request = new XMLHttpRequest();
      var formData = new FormData();
      for ( var key in proposal ) {
        formData.append(key, proposal[key]);
      }
      formData.append('organization_id', organizationId)
      request.open('POST', '/api/proposals', true);
      const context = this;
      request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
          newProposal = JSON.parse(this.response);
          context.proposal.id = newProposal.id;
          cb();
        }
      }
      request.send(formData);
    },

    redirectToProposalView() {
      window.location.href = `/proposal/${this.proposal.id}`
    },

    submitForm() {
      if (this.organization.id !== 0) {
        this.updateOrganization(this.organization)
        this.createProposal(this.proposal, this.organization.id, this.redirectToProposalView)
      } else {
        this.createOrganization(this.organization, () => {
          this.createProposal(this.proposal, this.organization.id, this.redirectToProposalView)
        })
      }
    }
  },

  template: `
<fieldset>
<legend>Organization</legend>
<div class="mb-3">
  <label for="orgName" class="form-label">Organization Name</label>
  <linked-autofill-input
    v-model='organization'
    field='name'
    name='orgName'
    id='orgName'
    placeholder='type part of an org name here -- for example, try "blue" or "space"'
    ></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgMissionStatement" class="form-label">Organization Mission</label>
  <textarea
    v-model='organization.mission_statement'
    name='orgMissionStatement'
    id='orgMissionStatement'
    class='form-control'
    placeholder='mission statement -- does not autofill'
    ></textarea>
</div>
<div class="mb-3">
  <label for="orgWebsite" class="form-label">Organization Website</label>
  <linked-autofill-input
    v-model='organization'
    field='website'
    name='orgWebsite'
    id='orgWebsite'
    placeholder='org web site -- autofills (try typing slowly)'
    ></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgEntityType" class="form-label">Entity Type</label>
  <select id="orgEntityType" class="form-select">
    <option value="501(c)(3)">501(c)(3)</option>
    <option value="501(c)(4)">501(c)(4)</option>
    <option value="501(c)(6)">501(c)(6)</option>
  </select>
</div>
<div class="mb-3">
  <label for="orgRegistrationNumber" class="form-label">Registration Number</label>
  <linked-autofill-input
    v-model='organization'
    field='registration_number'
    name='orgRegistrationNumber'
    id='orgRegistrationNumber'
    aria-describedby='orgRegistrationNumberHelp'
    placeholder='EIN -- autofills, showing org name for accuracy'
    ></linked-autofill-input>
  <div id="orgRegistrationNumberHelp" class="form-text">(e.g. EIN / TIN)</div>
</div>
<div class="mb-3">
  <label for="orgAddress" class="form-label">Organization Address</label>
  <linked-autofill-input
    v-model='organization'
    field='address'
    name='orgAddress'
    id='orgAddress'
    placeholder='address -- autofills, also showing org name'
    ></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgPhone" class="form-label">Organization Phone</label>
  <linked-autofill-input
    v-model='organization'
    field='phone'
    name='orgPhone'
    id='orgPhone'
    placeholder='phone -- autofills, also showing org name'
    ></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgEmail" class="form-label">Organization Email</label>
  <linked-autofill-input
    v-model='organization'
    field='email'
    name='orgEmail'
    id='orgEmail'
    placeholder='email -- autofills, also showing org name'
    ></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgDba" class="form-label">Organization DBA</label>
  <linked-autofill-input
    v-model='organization'
    field='dba_name'
    name='orgDba'
    id='orgDba'
    placeholder='alternate name -- autofills, also showing org name'
    ></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgCeoName" class="form-label">CEO / Administrative Lead</label>
  <linked-autofill-input
    v-model='organization'
    field='ceo_name'
    name='orgCeoName'
    id='orgCeoName'
    placeholder='name of person -- autofills, also showing org name'
    ></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgOperatingBudget" class="form-label">Operating Budget</label>
  <linked-autofill-input
    v-model='organization'
    field='operating_budget'
    name='orgOperatingBudget'
    id='orgOperatingBudget'
    placeholder='operating budget'
    ></linked-autofill-input>
</div>
<div class="mb-3 form-check">
  <input v-model="organization.is_lobbying" type="checkbox" class="form-check-input" name="orgIsLobbying" id="orgIsLobbying">
  <label class="form-check-label" for="orgIsLobbying">We engage in lobbying activities</label>
</div>
<div class="mb-3">
  <label for="orgStartDate" class="form-label">Organization Start Date</label>
  <linked-autofill-input
    v-model='organization'
    field='start_date'
    name='orgStartDate'
    id='orgStartDate'
    placeholder='start date'
    ></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgSignatory" class="form-label">Grant Agreement Signatory</label>
  <linked-autofill-input
    v-model='organization'
    field='grant_agreement_signatory'
    name='orgSignatory'
    id='orgSignatory'
    placeholder='signatory'
    ></linked-autofill-input>
</div>
<div class="mb-3">
  <label for="orgFiscalEndDate" class="form-label">Organization Fiscal End Date</label>
  <linked-autofill-input
    v-model='organization'
    field='fiscal_end_date'
    name='orgFiscalEndDate'
    id='orgFiscalEndDate'
    placeholder='fiscal end date'
    ></linked-autofill-input>
</div>
</fieldset>
<fieldset>
<legend>Proposal</legend>
<div class="mb-3">
  <label for="proposalName" class="form-label">Project Name</label>
  <input
    type='text'
    v-model='proposal.name'
    name='proposalName'
    id='proposalName'
    class='form-control'
    placeholder='project name'
    >
</div>
<div class="mb-3">
  <label for="proposalContact" class="form-label">Primary Contact Name</label>
  <input
    type='text'
    v-model='proposal.primary_contact_name'
    name='proposalContactName'
    id='proposalContactName'
    class='form-control'
    placeholder='contact name'
    >
</div>
<div class="mb-3">
  <label for="proposalRequestedBudget" class="form-label">Requested Budget</label>
  <input
    type='text'
    v-model='proposal.requested_budget'
    name='proposalRequestedBudget'
    id='proposalRequestedBudget'
    class='form-control'
    placeholder='requested budget'
    >
</div>
<div class="mb-3">
  <label for="proposalStartDate" class="form-label">Investment Start Date</label>
  <input
    type='text'
    v-model='proposal.investment_start_date'
    name='proposalStartDate'
    id='proposalStartDate'
    class='form-control'
    placeholder='start date'
    >
</div>
<div class="mb-3">
  <label for="proposalEndDate" class="form-label">Investment End Date</label>
  <input
    type='text'
    v-model='proposal.investment_end_date'
    name='proposalEndDate'
    id='proposalEndDate'
    class='form-control'
    placeholder='end date'
    >
</div>
<div class="mb-3">
  <label for="proposalTotalBudget" class="form-label">Total Project Budget</label>
  <input
    type="text"
    v-model='proposal.total_budget'
    name='proposalTotalBudget'
    id='proposalTotalBudget'
    class='form-control'
    placeholder='project budget'
    >
</div>
<div class="mb-3">
  <label for="proposalFiscalSponsor" class="form-label">Fiscal Sponsor Organization</label>
  <input
    type='text'
    v-model='proposal.fiscal_sponsor_name'
    name='proposalFiscalSponsor'
    id='proposalFiscalSponsor'
    class='form-control'
    placeholder='fiscal sponsor'
    >
</div>
<div class="mb-3">
  <label for="proposalDescription" class="form-label">Executive Summary</label>
  <textarea
    v-model='proposal.description'
    name='proposalDescription'
    id='proposalDescription'
    class='form-control'
    placeholder='executive summary'
    ></textarea>
</div>
</fieldset>
<button type="submit" class="btn btn-primary"
  @click.prevent="submitForm">Submit</button>
`
})
