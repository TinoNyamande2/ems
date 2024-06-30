import { PendingLeaveTableDetails } from "../../tabledata";
import { Box } from "@mui/material";
import { PageHeader } from "../../../../../components/nav/pageHeader";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: {
      default:`Pending Leave Applications`,
      template:` %s `
    },
    description: `Register for free and manage your organisations leave applications seamlessly `,
  }
export default function PendingApplications() {

    return (
        <>
            <Box sx={{ marginTop: "3vh" }}>
                <PageHeader message="My Pending Applications" />
            </Box>
            <PendingLeaveTableDetails />
        </>
    )
}