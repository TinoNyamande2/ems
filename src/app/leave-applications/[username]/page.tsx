
import { Box } from "@mui/material";
import Applications from "../applications";
import { PageHeader } from "../../../../components/nav/pageHeader";
import type { Metadata } from 'next'
import { pageContainer } from "../../../../components/styyle";

export const metadata: Metadata = {
  title: {
    default:`Leave Application System`,
    template:` %s `
  },
  description: `Register for free and manage your organisations leave applications seamlessly `,
}

export default function Page() {

  return (
    <Box
      id="image"
      sx={pageContainer}
    >
      <Box>
        <PageHeader message="My Leave applications" />
      </Box>

      <Box sx={{ marginTop: "3vh" }}>
        <Applications />
      </Box>
    </Box>
  )

}