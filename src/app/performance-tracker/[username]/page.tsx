import { Box } from "@mui/material";
import WorkItems from "../create";
import { pageContainer, siteTitle } from "../../../../components/styyle";
import type { Metadata } from 'next'
import { PageHeader } from "../../../../components/nav/pageHeader";

export const metadata: Metadata = {
  title: {
    default: `${siteTitle} - Performance Tracker`,
    template: ` %s `
  },
  description: `Manage employee leave applications , track performances and keep track of time being spent on various company projects for free`,
}
export default function Page() {

  return (
    <Box sx={pageContainer}>
      <PageHeader message="Your work items" />
      <Box sx={{ marginTop: "3vh" }} >
        <WorkItems />
      </Box>
    </Box>
  )

}