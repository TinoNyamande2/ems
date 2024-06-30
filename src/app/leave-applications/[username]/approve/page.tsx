import { PendingLeaveTableDetails } from "../../tabledata";
import { Box } from "@mui/material";
import { PageHeader } from "../../../../../components/nav/pageHeader";
import { Metadata } from "next";
import Approve from "../../approve";
import { pageContainer } from "../../../../../components/styyle";
export const metadata: Metadata = {
    title: {
        default: `Pending Leave Applications`,
        template: ` %s `
    },
    description: `Register for free and manage your organisations leave applications seamlessly `,
}
export default function Page() {

    return (
        <Box sx={pageContainer}>
            <Box sx={{ marginTop: "3vh" }}>
                <PageHeader message="Pending Applications" />
            </Box>
            <Box>
                <Approve />
            </Box>
        </Box>
    )
}