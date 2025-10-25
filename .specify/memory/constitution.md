<!--
Sync Impact Report:
- Version change: None → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Code Quality
  - [PRINCIPLE_2_NAME] → II. Testing Standards
  - [PRINCIPLE_3_NAME] → III. User Experience Consistency
  - [PRINCIPLE_4_NAME] → IV. Performance Requirements
- Added sections: None
- Removed sections:
  - [PRINCIPLE_5_NAME]
  - [SECTION_2_NAME]
  - [SECTION_3_NAME]
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
- Follow-up TODOs: None
-->
# AWS-blog Constitution

## Core Principles

### I. Code Quality
All code must be clean, readable, and maintainable. It must adhere to the standards defined in `rules/coding-standards.md`. All new code must be peer-reviewed before merging to ensure compliance and knowledge sharing.

### II. Testing Standards
All new features must be accompanied by comprehensive tests, including unit and integration tests. Test coverage should be maintained above a defined threshold (e.g., 80%). Critical user paths must have end-to-end tests to guarantee stability.

### III. User Experience Consistency
The user interface and experience must be consistent across the entire application. All new components must follow the design guidelines and patterns established in `rules/component-guidelines.md`. Any deviation must be justified and approved.

### IV. Performance Requirements
The application must meet strict performance criteria. This includes page load times (e.g., LCP under 2.5s), API response times (e.g., p95 under 500ms), and resource utilization. Performance budgets must be defined for key user interactions and monitored continuously.

## Governance

All development must adhere to the principles outlined in this constitution. Proposed changes to this constitution must be submitted as a pull request, reviewed by the team, and approved by a project lead.

**Version**: 1.0.0 | **Ratified**: 2025-10-21 | **Last Amended**: 2025-10-21
