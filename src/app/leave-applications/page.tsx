
import { Box } from "@mui/material";
import Applications from "./applications";
import { PageHeader } from "../../../components/nav/pageHeader";
import type { Metadata } from 'next'

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
      sx={{
        mt: { xs: 8, sm: 2 },
        alignSelf: 'center',
        height: "auto",
        width: '100%',
        backgroundSize: 'cover',
        borderRadius: '10px',
        outline: '1px solid',
        boxShadow:`0 0 12px 8px lightgray`
      }}
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