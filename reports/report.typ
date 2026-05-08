#set document(
  title: "Monthly Report",
  author: "VRConservation",
)

#set page(
  paper: "us-letter",
  margin: (top: 1in, bottom: 1in, left: 1in, right: 1in),
)

#set text(
  font: "New Computer Modern",
  size: 11pt,
  fill: rgb("#000000"),
)

#set heading(numbering: none)

#show heading.where(level: 1): it => {
  set text(size: 14pt, weight: "bold")
  it
  v(0.5em)
}

#show heading.where(level: 2): it => {
  set text(size: 12pt, weight: "bold")
  it
  v(0.3em)
}

#show table: set table(
  stroke: none,
)

// Placeholder for content - will be replaced by Python
#include "report_content.typ"
