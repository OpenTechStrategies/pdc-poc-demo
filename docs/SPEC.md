# Proof-of-Concept Demo: Common Grant Application for Philanthropy (CGAP) -- Common Data Platform

The purpose of this CGAP Proof-of-Concept Demo is to show live
examples of how the envisioned Common Data Platform can help
grantseekers and grantmakers.  This demo is not the fully-functioning
data platform itself -- rather, it is a collection of interactive
examples showing what the eventual data platform will enable.

The PoC Demo has three screens:

1) **Grantseekers' data entry.**

   This screen is a mockup of how a Grants Management System (GMS) can
   integrate with CGAP to improve the grantseeker experience.  It
   demonstrates how a GMS can incorporate CGAP data to save
   grantseekers time and data entry effort, and improve data accuracy.

   It shows input fields that a grantseeking non-profit would
   typically fills in when applying for a grant (sometimes this
   happens via an online GMS, sometimes via a manually-submitted
   document).  The fields come from the [CGAP core
   fields](https://docs.google.com/spreadsheets/d/18bzxgnA7SFkQLTkUMUXJQeqx88g_SNGkCAXpgMpF4Ss/edit#gid=444784014)
   spreadsheet.

   As the grantseeker fills out *any* field on the screen, that field
   offers autofill based on our [sample
   data](https://docs.google.com/spreadsheets/d/1eiB-zdtp1mV_gcLvZoTag_uwjUdKluGeyPtELwBJE7Q/edit#gid=76958986).
   And once the autofill for a particular field is accepted, the
   *rest* of the fields then automatically fill in too.

   For example, the grantseeker might start by writing in their
   organization's name.  The interactive input would offer autofill,
   based on our sample data, and once the proposed name has been
   accepted by the user, all the other fields (EIN, address, etc)
   would then immediately fill in automatically.  They would remain
   editable, and if the user does edit them and hit "Submit", the
   updated values are saved in the database and are used for future
   autofill.

   Similarly, the grantseeker might by start typing in their
   organization's EIN.  That field would also autofill, but with an
   intelligent display: the autofill choices would show both EIN *and*
   org name, so that the user can quickly and easily recognize their
   own organization, choose that particular autofill option, and then
   (as above) every remaining field autofills too.

   Note for implementors: there is some text on this screen too,
   explaining how the data comes from GMSs and *not* from applicants
   logging in to the CGAP CDP and supplying that data manually.  The
   point of this platform is to make less work, not more, for
   applicants.  Don't worry about the exact wording of that text for
   now; let's focus on the functionality first.

2) **Funders' view.**

   Here, funders can search for grantseekers that match a particular
   profile.

   This screen shows a faceted search interface, enabling the user (a
   grantmaker) to search among the various non-profits whose core data
   is in CGAP's Common Data Platform, discovering ones whose proposals
   -- which were sent to *other* funders, and shared with CGAP under
   CGAP's data access and governance policies -- are in areas of
   interest to the funder doing the search.

   The search must therefore match on both organizational information
   and on proposal information.  Each proposal in the system is
   associated with its corresponding proposing organization (see the
   [Entity Relationship Diagram (ERD)](TODO: WE NEED TO MAKE AN ERD)).

3) **API documentation.** 

   This screen shows technical documentation for the PoC Demo API,
   which is a design preview of the API by which others (e.g., GMS
   vendors) will be able to send and receive data to/from the CGAP
   Common Data Platform under the governance of CGAP's data access
   policies.

TBD: There may be another view coming, or at least an API endpoint,
showing funder profiles too, similar to the applicant profiles already
implied by the above.  However, let's get the above done first and
look at funder profiles next -- the sample data for funder profiles is
not ready yet in any case.
